# React Query — Phân Tích Thay Thế Data Fetching

> So sánh pattern hiện tại với `@tanstack/react-query`.

---

## 1. Hiện Trạng

Project có **3 chỗ** gọi API từ client:

| Vị trí | Kiểu | Pattern hiện tại |
|--------|------|------------------|
| `useQuizQuestions.ts` | GET `/api/questions/random` | `useEffect` + `useState` (loading, questions) |
| `useQuizAttempt.ts` | POST `/api/attempts` | `useReducer` (3 phase) + `submitAttempt()` |
| `dashboard/page.tsx` | GET `/api/stats` | `useEffect` + `useState` (loading, stats) |

Cả 3 đều dùng `fetch()` native, wrapper trong `quiz.client.ts`.

---

## 2. Phân Loại State

Trước khi nói đến giải pháp, cần phân biệt rõ 3 loại state:

| Loại | Ví dụ | Công cụ phù hợp |
|------|-------|-----------------|
| **Server State** | questions, stats | React Query (`useQuery`) |
| **Network State** | request đang gửi? thành công? lỗi? | React Query (`useMutation`) |
| **UI State** | selectedOptionId, phase, modal open, theme | `useState` / `useReducer` |

**Nguyên tắc:** React Query quản lý dữ liệu đến từ server, không phải trạng thái giao diện.

---

## 3. Phân Tích Từng Vị Trí

### 3.1 `dashboard/page.tsx` — `useQuery` thay `useEffect`

**Loại state:** Server State (stats là dữ liệu từ server).

```ts
// Before — useEffect + useState
const [stats, setStats] = useState<StatsData | null>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/stats')
    .then((res) => res.json())
    .then((data) => { setStats(data); setLoading(false) })
    .catch(() => setLoading(false))
}, [])

// After — useQuery
const { data: stats, isLoading } = useQuery({
  queryKey: ['stats'],
  queryFn: () => fetch('/api/stats').then(r => r.json()),
})
```

**Kết luận:** Thay được hoàn toàn. `stats` là pure server state, không có UI logic phức tạp.

---

### 3.2 `useQuizQuestions.ts` — `useQuery` thay `useEffect`

**Loại state:** Server State (questions) + UI State (currentIdx, navigation).

```ts
// Before
const [questions, setQuestions] = useState<Question[]>(options.initialQuestions ?? [])
const [currentIdx, setCurrentIdx] = useState(0)
const [isLoading, setIsLoading] = useState(!options.initialQuestions)

useEffect(() => {
  if (options.initialQuestions) return
  setIsLoading(true)
  fetchQuestions({ type: options.type, difficulty: options.difficulty })
    .then((data) => setQuestions(data.questions))
    .catch(() => setQuestions([]))
    .finally(() => setIsLoading(false))
}, [options.type, options.difficulty, options.initialQuestions])
```

```ts
// After — useQuery cho server state, giữ useState cho UI state
export function useQuizQuestions(options) {
  const { data, isLoading } = useQuery({
    queryKey: ['questions', options.type, options.difficulty],
    queryFn: () => fetchQuestions({ type: options.type, difficulty: options.difficulty }),
    enabled: !options.initialQuestions,
    initialData: options.initialQuestions
      ? { questions: options.initialQuestions } : undefined,
  })

  // navigation state — UI State, không liên quan đến server
  const [currentIdx, setCurrentIdx] = useState(0)

  const questions = data?.questions ?? []
  const currentQuestion = questions[currentIdx] ?? null
  const advanceQuestion = useCallback(() => setCurrentIdx((i) => i + 1), [])
  const resetIdx = useCallback(() => setCurrentIdx(0), [])

  // ... trả về như cũ
}
```

**Kết luận:** `useEffect` + `useState(questions/isLoading)` thay được bằng `useQuery`. `currentIdx` và navigation là UI State — giữ nguyên.

---

### 3.3 `useQuizAttempt.ts` — Không thay thế toàn bộ

Đây là vị trí dễ nhầm nhất.

#### State hiện tại trong useReducer là gì?

| State | Loại | Giải thích |
|-------|------|------------|
| `phase: idle → submitting → answered` | **UI State** | Trạng thái màn hình, không phải request |
| `selectedOptionId` | **UI State** | User đã click vào option nào |
| `result: AttemptResult` | **Server State** | Dữ liệu server trả về |
| `correctCount` | **UI State** | Số câu đúng (tính từ đầu bài) |

#### Tại sao useMutation không thay được useReducer?

Vì **lifecycle khác nhau**:

```
Network lifecycle (useMutation):
  idle → pending → success/error
  Chỉ kéo dài trong lúc gọi API (~100ms-5s)

UI lifecycle (useReducer):
  idle → submitting → answered
  Kéo dài cho đến khi user bấm "Next Question" (~5-30s)
```

`answered` ≠ `success`. API có thể thành công sau 100ms, nhưng UI giữ trạng thái `answered` 20 giây để user đọc explanation.

#### Ví dụ: thêm nút "Hide Explanation"

Nếu dùng `mutation.isSuccess` để suy ra `answered`:

```
Click → mutation.success = true → UI hiện explanation
User bấm "Hide" → explanation ẩn
```

Lúc này mutation vẫn `success`, nhưng UI đã thay đổi. `mutation.isSuccess` không thể phản ánh `Hide Explanation`.

#### Ví dụ khác: Review Mode

Sau này có màn hình xem lại bài làm. User thấy:

```
Question 1: answered (đã chọn A)
Question 2: answered (đã chọn C)
Question 3: unanswered
```

Lúc này **không có mutation nào đang chạy** cả. Nếu `answered` = `mutation.isSuccess`, review mode sẽ không hoạt động.

#### Giải pháp đúng: useMutation + useReducer

```
Click option
    │
    ▼
dispatch({ type: 'SELECT', optionId })
    │                           │
    │                    useReducer cập nhật:
    │                    phase = 'submitting'
    │                    selectedOptionId = A
    │
    ▼
mutation.mutate({ questionId, selectedOptionId })
    │
    ▼
onSuccess(data)
    │
    ▼
dispatch({ type: 'SUBMIT_SUCCESS', result: data })
    │
    ▼
useReducer cập nhật:
    phase = 'answered'
    result = { isCorrect, correctOptionId, rationale }
    correctCount++
```

```ts
// After — kết hợp useMutation + useReducer
const mutation = useMutation({
  mutationFn: ({ questionId, selectedOptionId }) =>
    submitAttempt(questionId, selectedOptionId),
  onSuccess: (data) => {
    dispatch({ type: 'SUBMIT_SUCCESS', result: data })
    options.onStatsUpdate?.(options.currentIdx + 1, correctCount + (data.isCorrect ? 1 : 0))
  },
  onError: () => {
    dispatch({ type: 'SUBMIT_ERROR' })
  },
})

const handleSelect = useCallback(async (optionId: string) => {
  const question = options.currentQuestion
  if (!question || state.phase !== 'idle') return

  dispatch({ type: 'SELECT', optionId })
  mutation.mutate({ questionId: question.id, selectedOptionId: optionId })
}, [options.currentQuestion, state.phase])
```

**Reducer vẫn giữ nguyên** — chỉ khác là `SUBMIT_SUCCESS` không còn gọi sau `await submitAttempt()` nữa, mà gọi trong `mutation.onSuccess`.

#### useReducer sau khi refactor

```ts
type AttemptAction =
  | { type: 'SELECT'; optionId: string }
  | { type: 'SUBMIT_SUCCESS'; result: AttemptResult }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'CLEAR' }

function attemptReducer(state: AttemptState, action: AttemptAction): AttemptState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, phase: 'submitting', selectedOptionId: action.optionId }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        phase: 'answered',
        result: action.result,
        correctCount: state.correctCount + (action.result.isCorrect ? 1 : 0),
      }
    case 'SUBMIT_ERROR':
      return { ...state, phase: 'idle', selectedOptionId: null }
    case 'CLEAR':
      return { ...state, phase: 'idle', selectedOptionId: null, result: null }
  }
}
```

**Reducer không hề thay đổi so với hiện tại** — chỉ có `handleSelect` bỏ `try/catch` và gọi `mutation.mutate()` thay vì `await submitAttempt()`.

---

## 4. Kiến Trúc Tổng Thể Sau Khi Áp Dụng

```
                    APP STATE
                         │
          ┌──────────────┴──────────────┐
          │                             │
   Server State                   Client/UI State
          │                             │
   Questions                    selectedOptionId
   Stats                        phase (idle/submitting/answered)
   User                         currentIdx
                                correctCount
          │                     isModalOpen
   React Query                  theme
   (useQuery/useMutation)       │
                          useState / useReducer
```

**Luồng dữ liệu:**

```
User click
    │
    ▼
dispatch(SELECT)          ← UI State (useReducer)
    │
    ▼
mutation.mutate()         ← Network State (useMutation)
    │
    ▼
mutation.onSuccess()
    │
    ▼
dispatch(SUBMIT_SUCCESS)  ← UI State (useReducer)
    │
    ▼
UI: phase = answered
    result = ...
    highlight đáp án
    hiện rationale
```

- `useMutation` chỉ chịu trách nhiệm: gửi request, nhận response, retry khi lỗi
- `useReducer` chỉ chịu trách nhiệm: quyết định UI ở trạng thái nào

---

## 5. So Sánh

| Tiêu chí | Hiện tại | Sau khi áp dụng React Query |
|----------|----------|----------------------------|
| **useQuizQuestions** | `useEffect` + `useState` | `useQuery` cho questions, giữ `useState` cho currentIdx |
| **useQuizAttempt** | `useReducer` + `await submitAttempt()` | `useReducer` (giữ nguyên) + `useMutation` (thay `await submitAttempt()`) |
| **Dashboard** | `useEffect` + `useState` | `useQuery` |
| **Caching** | Không | Có (cache trong memory, TTL configurable) |
| **Dedup requests** | Không | Có (cùng queryKey chỉ gọi 1 lần) |
| **Retry** | Không | Có (mặc định 3 lần) |
| **Error handling** | `.catch()` thủ công | Tự động (error state có sẵn) |
| **Refetch on focus** | Không | Có |
| **Bundle thêm** | 0KB | ~15KB gzipped |

---

## 6. Lợi Ích

### 6.1 Bỏ được `useEffect` ở 2/3 chỗ
- `dashboard/page.tsx` và `useQuizQuestions.ts` — không cần `useEffect` + `useState` cho loading/data/error nữa
- `useQuizAttempt.ts` — vẫn giữ `useReducer` cho UI state, nhưng bỏ được `try/catch` thủ công

### 6.2 Cache + Dedup
- User vào practice type A, quay ra, vào lại → không fetch lại
- Nếu có nhiều component cùng mount và cùng gọi 1 query → chỉ 1 request

### 6.3 Error handling chuẩn
- Không còn `.catch()` thủ công hay unhandled promise rejection
- Retry tự động khi network lỗi

### 6.4 Tách biệt rõ ràng
- Server State → React Query
- UI State → useReducer/useState
- Không trộn lẫn trách nhiệm

---

## 7. Bất Lợi

### 7.1 Bundle size
- ~15KB gzipped

### 7.2 Học concepts mới
- `queryKey`, `staleTime`, `gcTime`, `invalidation` — cần hiểu để dùng đúng

### 7.3 Overkill nếu project không mở rộng
- 3 endpoints, caching chưa thực sự cần (mỗi lần vào practice là type khác nhau)

### 7.4 Client-only
- React Query không dùng được trong Server Components, Server Actions

### 7.5 Không thay được useReducer
- `useMutation` chỉ thay được phần network (gửi request, nhận response)
- `useReducer` vẫn cần cho UI state (phase, selectedOptionId, ...)

---

## 8. Kết Luận

| Vị trí | Có nên đổi? | Thay bằng |
|--------|-------------|-----------|
| `dashboard/page.tsx` | ✅ Nên | `useQuery` |
| `useQuizQuestions.ts` | ✅ Nên | `useQuery` cho GET, giữ `useState` cho currentIdx |
| `useQuizAttempt.ts` | ⚠️ Một phần | `useMutation` cho submit, **giữ nguyên** `useReducer` cho UI |

### Nếu bắt buộc phải chọn:

> **Nên chuyển, nhưng chỉ ở mức hợp lý:**
> 1. `@tanstack/react-query` đã có trong `package.json` + `QueryClientProvider` đã setup — không cần cài thêm
> 2. Đổi `dashboard/page.tsx` và `useQuizQuestions.ts` — lợi ích thấy ngay, rủi ro gần bằng 0
> 3. Với `useQuizAttempt.ts`: chỉ thêm `useMutation` để thay `await submitAttempt()`, giữ nguyên `useReducer`
> 4. Không bao giờ dùng `mutation.variables` làm UI state — dùng `useReducer` cho việc đó

### Lưu ý:

> **`answered` không phải `success`.**
> `success` là trạng thái của network request.
> `answered` là trạng thái của màn hình.
> Hai cái tình cờ cùng xảy ra trong dự án hiện tại, nhưng về bản chất khác nhau.
> Về lâu dài, đừng gộp chúng làm một.
