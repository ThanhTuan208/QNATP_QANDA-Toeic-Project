# Quiz Feature — Detailed Code Explanation

> File này giải thích chi tiết từng file code trong `src/features/quiz/`, input/output, flow thực thi, và dữ liệu biến đổi qua từng bước.

---

## Mục lục

- [1. Entry Point: Page Server Component](#1-entry-point-page-server-component)
- [2. types.ts — Định nghĩa dữ liệu](#2-typests--định-nghĩa-dữ-liệu)
- [3. constants.ts — Hằng số](#3-constantsts--hằng-số)
- [4. api/quiz.api.ts — Network Layer](#4-apiquizapits--network-layer)
- [5. controllers/quiz.controller.ts — Pure Logic](#5-controllersquizcontrollerts--pure-logic)
- [6. controllers/question.controller.ts — Option Status Logic](#6-controllersquestioncontrollerts--option-status-logic)
- [7. controllers/theory.controller.tsx — Lý thuyết](#7-controllerstheorycontrollertsx--lý-thuyết)
- [8. hooks/useQuizQuestions.ts — Quản lý danh sách câu hỏi](#8-hooksusequizquestionsts--quản-lý-danh-sách-câu-hỏi)
- [9. hooks/useQuizAttempt.ts — State Machine trả lời](#9-hooksusequizattemptts--state-machine-trả-lời)
- [10. hooks/useQuizImport.ts — Import dialog](#10-hooksusequizimportts--import-dialog)
- [11. hooks/useQuizEngine.ts — Orchestrator](#11-hooksusequizenginets--orchestrator)
- [12. components/QuizEngine/QuizEngine.tsx — Smart Component](#12-componentsquizenginequizenginetsx--smart-component)
- [13. components/QuestionCard/QuestionCard.tsx](#13-componentsquestioncardquestioncardtsx)
- [14. components/OptionButton/OptionButton.tsx](#14-componentsoptionbuttonoptionbuttontsx)
- [15. components/RationaleBox/RationaleBox.tsx](#15-componentsrationaleboxrationaleboxtsx)
- [16. components/ImportDialog/ImportDialog.tsx](#16-componentsimportdialogimportdialogtsx)
- [17. sections/QuizSection/QuizSection.tsx](#17-sectionsquizsectionquizsectiontsx)
- [18. sections/TheorySection/TheorySection.tsx](#18-sectionstheorysectiontheorysectiontsx)
- [19. sections/PracticeHeaderSection/PracticeHeaderSection.tsx](#19-sectionspracticeheadersectionpracticeheadersectiontsx)

---

## 1. Entry Point: Page Server Component

**File:** `src/app/(main)/practice/[type]/page.tsx`

### Input

| Tên | Loại | Nguồn |
|---|---|---|
| `params` | `Promise<{ type: string }>` | Next.js dynamic route segment `[type]` |

### Flow

```
URL: /practice/comparison
  → params = Promise<{ type: "comparison" }>
    → await params → { type: "comparison" }
      → validate: VALID_TYPES.has("comparison") ✅
      → typeLabel = TYPE_LABEL_MAP["comparison"]  // "So Sánh Hơn"
      → contextDesc = TYPE_CONTEXT["comparison"]
      → initialQuestions = loadQuestions("comparison")  // readFileSync lọc theo type
```

### `loadQuestions(type)` — Server-side data loading

**Input:** `type: string` (slug, VD: `"comparison"`)

**Process:**
1. `readFileSync('data/questions.json')` → đọc toàn bộ JSON
2. `.filter(q => q.type === type)` — lọc slug trực tiếp (so sánh string)
3. `.map(...)` — transform format raw → format `Question` (thêm `id`, `questionText`, `order`)

**Output:** `Question[]` — mảng câu hỏi đã lọc theo type

### Output (render)

| Component | Props nhận |
|---|---|
| `PracticeHeaderSection` | `typeLabel`, `contextDesc` |
| `TheorySection` | `type` |
| `QuizSection` | `type`, `initialQuestions` |

---

## 2. types.ts — Định nghĩa dữ liệu

**File:** `src/features/quiz/types.ts`

### Các interface/type được định nghĩa

| Tên | Kiểu | Mục đích |
|---|---|---|
| `Option` | `{ id, text, order }` | Một đáp án trong câu hỏi |
| `Question` | `{ id, questionText, type, difficulty, hint, options[] }` | Câu hỏi hoàn chỉnh |
| `AttemptResult` | `{ isCorrect, correctOptionId, rationale }` | Kết quả trả về từ API submit |
| `QuizState` | `'loading' \| 'ready' \| 'answered' \| 'complete'` | ⚠ Defined nhưng **không dùng** |
| `OptionStatus` | `'idle' \| 'selected' \| 'correct' \| 'wrong' \| 'disabled'` | Trạng thái hiển thị của 1 option button |

### Ai dùng interface nào?

| Interface | File sử dụng |
|---|---|
| `Option` | `Question` (embedded), `QuizSection`, `loadQuestions` |
| `Question` | Hooks: `useQuizQuestions`, `useQuizAttempt`, `useQuizEngine`. Components: `QuizEngine`, `QuestionCard`. API: `quiz.api.ts` |
| `AttemptResult` | `useQuizAttempt`, `useQuizEngine`, `RationaleBox` |
| `OptionStatus` | `question.controller`, `OptionButton`, `QuestionCard` |

### Data flow của `Option`:

```
data/questions.json (raw format)
  → loadQuestions() transform
    → Question { options: Option[] }
      → QuizEngine → QuestionCard → OptionButton
```

---

## 3. constants.ts — Hằng số

**File:** `src/features/quiz/constants.ts`

### Các exports

| Tên | Kiểu | Input → Output | Dùng ở đâu |
|---|---|---|---|
| `QUESTION_TYPE_LABELS` | `Record<string, string>` | `"COMPARISON"` → `"Comparisons (So sánh)"` | Dashboard hiển thị type |
| `TYPE_SLUG_MAP` | `Record<string, string>` | `"comparison"` → `"COMPARISON"` | ⚠ Defined nhưng **không dùng** |
| `TYPE_LABEL_MAP` | `Record<string, string>` | `"comparison"` → `"So Sánh Hơn"` | `page.tsx` lấy label hiển thị header |
| `TYPE_CONTEXT` | `Record<string, string>` | `"comparison"` → mô tả ngữ cảnh | `page.tsx` lấy description |
| `TYPE_LABEL_MAP_FULL` | `Record<string, string>` | `"comparison"` → `"Comparisons (So sánh)"` | `quiz.controller` → `generatePrompt()` |
| `OPTION_LABELS` | readonly `["A","B","C","D"]` | `OPTION_LABELS[idx]` → `"A"` | `QuestionCard` render label cho option |
| `VALID_QUIZ_TYPES` | `Set<string>` | `"comparison"` → `true` | Validate type slug |

---

## 4. api/quiz.api.ts — Network Layer

**File:** `src/features/quiz/api/quiz.api.ts`

### `fetchQuestions(params)`

| Item | Chi tiết |
|---|---|
| **Input** | `{ type?: string, difficulty?: string }` |
| **Transform** | `type.toUpperCase()` — slug → enum (VD: `"comparison"` → `"COMPARISON"`) |
| **HTTP** | `GET /api/questions/random?type=COMPARISON` |
| **Response** | `{ questions: Question[], total: number }` |
| **Error** | `!res.ok` → throw `'Không thể tải câu hỏi'` |
| **Gọi từ** | `useQuizQuestions` (trong `useEffect`) |

### `submitAttempt(questionId, selectedOptionId)`

| Item | Chi tiết |
|---|---|
| **Input** | `questionId: string`, `selectedOptionId: string` |
| **HTTP** | `POST /api/attempts` body `{ questionId, selectedOptionId }` |
| **Response** | `AttemptResult & { attempt: { id: string } }` |
| **Error** | `!res.ok` → throw `'Không thể ghi nhận câu trả lời'` |
| **Gọi từ** | `useQuizAttempt.handleSelect` |

### Full data flow API

```
useQuizQuestions
  → fetchQuestions({ type: "comparison" })
    → GET /api/questions/random?type=COMPARISON
      → Response JSON → Question[]
        → setQuestions(data.questions) → re-render

useQuizAttempt.handleSelect(optionId)
  → submitAttempt("q123", "opt456")
    → POST /api/attempts
      → Response JSON → { isCorrect, correctOptionId, rationale, attempt }
        → dispatch(SUBMIT_SUCCESS, result) → re-render
```

---

## 5. controllers/quiz.controller.ts — Pure Logic

**File:** `src/features/quiz/controllers/quiz.controller.ts`

### `generateTemplate(type)`

| Item | Chi tiết |
|---|---|
| **Input** | `type: string` (slug) |
| **Process** | `SAMPLE_QUESTIONS[type]` → lấy câu hỏi mẫu → `JSON.stringify` với format 4 option + hint |
| **Output** | `string` (JSON formatted) — template để user paste vào textarea |
| **Gọi từ** | `useQuizImport.openImport()`, `ImportDialog` button "Đặt lại mẫu" |

**Ví dụ output:**
```json
[
  {
    "question": "The new system is ______ than the previous version.",
    "type": "comparison",
    "difficulty": "medium",
    "options": [
      { "text": "Đáp án A", "isCorrect": true, "rationale": "Giải thích" },
      ...
    ],
    "hint": "Gợi ý cho người học"
  }
]
```

### `generatePrompt(type)`

| Item | Chi tiết |
|---|---|
| **Input** | `type: string` (slug) |
| **Process** | `TYPE_LABEL_MAP_FULL[type]` → lấy label đầy đủ → template string prompt |
| **Output** | `string` — prompt instruction cho AI sinh câu hỏi |
| **Gọi từ** | `useQuizImport.openImport()`, `ImportDialog` render |

### `parseImportedJSON(raw, type)`

| Item | Chi tiết |
|---|---|
| **Input** | `raw: string` (JSON text từ textarea), `type: string` (slug fallback) |
| **Process** | `JSON.parse` → validate từng item (có `question`, `options`) → transform thành `Question[]` |
| **Output** | `Question[]` |
| **Error** | Throw nếu parse lỗi hoặc thiếu field |
| **Gọi từ** | `useQuizImport.submitImport()` |

**Transform detail:**
```
Raw JSON item:
  { question: "...", type?: "...", difficulty?: "...", options: [...], hint?: "..." }

→ Question:
  { id: "custom_0_1234567890",
    questionText: "...",
    type: item.type ?? type,        // fallback về type param nếu item ko có type
    difficulty: item.difficulty ?? "medium",
    hint: item.hint ?? null,
    options: [{ id: "opt_custom_0_0", text: "...", order: 0 }, ...]
  }
```

### `calculateAccuracy(correct, total)`

| Item | Chi tiết |
|---|---|
| **Input** | `correct: number`, `total: number` |
| **Process** | `Math.round((correct / total) * 100)` |
| **Output** | `string` — VD: `"75%"`, `"0%"` nếu total = 0 |
| **Gọi từ** | Không tìm thấy trong codebase — ⚠ dead code |

---

## 6. controllers/question.controller.ts — Option Status Logic

**File:** `src/features/quiz/controllers/question.controller.ts`

### `getOptionStatus(optId, selectedOptionId, correctOptionId)`

| Item | Chi tiết |
|---|---|
| **Input** | `optId: string`, `selectedOptionId: string \| null`, `correctOptionId: string \| null` |
| **Logic** | |

```
correctOptionId === null?  → chưa trả lời
  ├─ optId === selectedOptionId → "selected" (tạm thời highlight)
  └─ khác → "idle"

correctOptionId !== null?  → đã trả lời xong
  ├─ optId === correctOptionId → "correct" (tô xanh)
  ├─ optId === selectedOptionId && khác correctOptionId → "wrong" (tô đỏ)
  └─ còn lại → "disabled" (không click được)
```

| **Output** | `OptionStatus` |
|---|---|
| **Gọi từ** | `QuestionCard` map từng option → `getOptionStatus(opt.id, selectedOptionId, correctOptionId)` |

---

## 7. controllers/theory.controller.tsx — Lý thuyết

**File:** `src/features/quiz/controllers/theory.controller.tsx`

### `getTheoryContent(type)`

| Item | Chi tiết |
|---|---|
| **Input** | `type: string` (slug) |
| **Process** | `THEORY_DATA[type] ?? DEFAULT_THEORY` — lookup trong Record |
| **Output** | `TheoryContent = { title: string, content: ReactNode }` |
| **Gọi từ** | `TheorySection` (server component) — render trực tiếp JSX |

**Lưu ý:** File này chứa `THEORY_DATA` với 10 type × ~60 dòng JSX table mỗi type → tổng ~620 dòng. Mỗi type có 1 bảng HTML (table) riêng giải thích ngữ pháp.

---

## 8. hooks/useQuizQuestions.ts — Hook quản lý state danh sách câu hỏi

**File:** `src/features/quiz/hooks/useQuizQuestions.ts`

### Mục đích tồn tại

Là hook **quản lý danh sách câu hỏi + vị trí hiện tại** cho toàn bộ luồng quiz ở client-side. Nó đóng vai trò:

1. **Chứa state trung tâm** của danh sách questions (`useState<Question[]>`)
2. **Fetch dữ liệu từ API** nếu không có `initialQuestions`
3. **Điều khiển vị trí** đang làm tới câu nào (`currentIdx`)
4. **Public các trạng thái tổng hợp** (loading, empty, complete) cho UI

### Nó đang thực hiện logic cho AI? Cho cái gì?

Cho `useQuizEngine` — hook tổng điều phối (orchestrator).

Trong `useQuizEngine`, các hook con hoạt động theo nguyên tắc **phân tách trách nhiệm**:

```
useQuizEngine (tổng điều phối)
  ├── useQuizQuestions   ← quản lý questions + currentIdx
  ├── useQuizAttempt     ← quản lý submit + kết quả
  └── useQuizImport      ← quản lý import JSON
```

`useQuizEngine` lấy `questionsHook.currentQuestion` và `questionsHook.currentIdx` rồi **truyền xuống `useQuizAttempt`**:

```typescript
// useQuizEngine.ts:47
const attemptHook = useQuizAttempt({
  currentQuestion: questionsHook.currentQuestion,  // ← lấy từ useQuizQuestions
  currentIdx: questionsHook.currentIdx,             // ← lấy từ useQuizQuestions
  onStatsUpdate: options.onStatsUpdate,
})
```

Và **cung cấp handler `handleNext`** cho UI gọi khi chuyển câu:

```typescript
// useQuizEngine.ts:63
const handleNext = useCallback(() => {
  attemptHook.clearAnswer()
  questionsHook.advanceQuestion()  // ← tăng currentIdx
}, [])
```

### Luồng chi tiết hook hoạt động

#### 1. Khởi tạo

```typescript
const [questions, setQuestions] = useState<Question[]>(options.initialQuestions ?? [])
const [currentIdx, setCurrentIdx] = useState(0)
const [isLoading, setIsLoading] = useState(!options.initialQuestions)
//               ^ nếu không có initialQuestions → loading = true ngay lập tức
```

#### 2. `useEffect` — Fetch từ API nếu không có `initialQuestions`

```typescript
useEffect(() => {
  if (options.initialQuestions) return          // có sẵn → skip fetch
  setIsLoading(true)
  fetchQuestions({ type, difficulty })          // gọi quiz.api.ts
    .then((data) => setQuestions(data.questions))
    .catch(() => setQuestions([]))
    .finally(() => setIsLoading(false))
}, [options.type, options.difficulty, options.initialQuestions])
```

→ `fetchQuestions()` gọi **`GET /api/questions/random?type=...&difficulty=...`** (xem `quiz.api.ts:24`)

#### 3. Điều khiển vị trí

```typescript
const advanceQuestion = useCallback(() => {
  setCurrentIdx((i) => i + 1)     // lên câu tiếp theo
}, [])

const resetIdx = useCallback(() => {
  setCurrentIdx(0)                  // quay về câu đầu
}, [])
```

#### 4. State dẫn xuất (derived state)

```typescript
const currentQuestion = questions[currentIdx] ?? null   // câu đang làm
const totalQuestions = questions.length                  // tổng số câu
const isEmpty = questions.length === 0 && !isLoading     // không có câu hỏi
const isComplete = currentIdx >= questions.length && questions.length > 0  // đã xong hết
```

### Output hook cung cấp cho orchestrator

```typescript
{
  questions,           // Question[] — toàn bộ danh sách
  currentQuestion,     // Question | null — câu đang làm
  currentIdx,          // number — index hiện tại
  totalQuestions,      // number — tổng số
  isLoading,           // boolean — đang fetch
  isEmpty,             // boolean — không có câu nào
  isComplete,          // boolean — đã làm hết
  setQuestions,        // (q: Question[]) => void — cho useQuizImport gán questions từ JSON import
  advanceQuestion,     // () => void — handleNext gọi
  resetIdx,            // () => void — reset gọi
}
```

### Tổng kết

| Câu hỏi | Trả lời |
|---|---|
| **Để làm gì?** | Quản lý danh sách câu hỏi + vị trí hiện tại trong quiz flow |
| **Logic cho ai?** | Cho `useQuizEngine` (orchestrator) — nó cung cấp `currentQuestion` cho `useQuizAttempt` và `advanceQuestion` cho `handleNext` |
| **Tại sao tách riêng?** | Vì questions và position không liên quan đến submit logic — nếu gộp vào `useQuizAttempt` sẽ phức tạp. Tách ra giúp mỗi hook có 1 responsibility duy nhất |
| **Input nhận gì?** | `type`, `difficulty` (để fetch), `initialQuestions` (nếu có sẵn, ví dụ từ import JSON) |
| **Output trả gì?** | questions list + current question + trạng thái + control functions |

---

## 9. hooks/useQuizAttempt.ts — Hook state machine trả lời câu hỏi

**File:** `src/features/quiz/hooks/useQuizAttempt.ts`

### Mục đích tồn tại

Là hook **quản lý state machine cho hành động trả lời câu hỏi** — từ lúc user click chọn đáp án đến khi nhận kết quả từ API. Nó đóng vai trò:

1. **Điều khiển state machine** (`idle → submitting → answered → idle`) qua `useReducer`
2. **Gọi API submit** (`POST /api/attempts`) khi user chọn đáp án
3. **Tính cumulative `correctCount`** và báo parent qua `onStatsUpdate`

### Nó đang thực hiện logic cho AI? Cho cái gì?

Cho `useQuizEngine` (orchestrator).

`useQuizEngine` truyền `currentQuestion` từ `useQuizQuestions` xuống `useQuizAttempt`:

```typescript
// useQuizEngine.ts:47
const attemptHook = useQuizAttempt({
  currentQuestion: questionsHook.currentQuestion,  // ← từ useQuizQuestions
  currentIdx: questionsHook.currentIdx,
  onStatsUpdate: options.onStatsUpdate,
})
```

`useQuizAttempt` trả về `handleSelect` để `QuestionCard` gọi, và `result` để `RationaleBox` render:

```
useQuizEngine (tổng điều phối)
  ├── useQuizQuestions   ← quản lý questions + currentIdx
  │     ↓ cung cấp currentQuestion
  ├── useQuizAttempt     ← quản lý submit + kết quả  [BẠN ĐANG Ở ĐÂY]
  │     ↓ trả về result, handleSelect, correctCount
  │     → QuestionCard (gọi handleSelect khi click option)
  │     → RationaleBox (render result.isCorrect + rationale)
  │     → QuizSection (nhận onStatsUpdate)
  └── useQuizImport      ← quản lý import JSON
```

### Luồng chi tiết — Giải thích từng type, const, interface

#### 1. `type AttemptPhase` — Union type cho state machine

```typescript
type AttemptPhase = 'idle' | 'submitting' | 'answered'
```

**Kỹ thuật:** Union type (literal string union) — chỉ chấp nhận 1 trong 3 giá trị. Đây là cách TypeScript implement **finite state machine**: phase chỉ có thể chuyển theo chiều `idle → submitting → answered → idle`.

| Phase | Ý nghĩa | UI tương ứng |
|---|---|---|
| `idle` | Chưa chọn gì, sẵn sàng click | OptionButton hiển thị trạng thái hover |
| `submitting` | Đang gọi API `POST /api/attempts` | Option bị disable, hiển thị loading |
| `answered` | Đã có kết quả từ API | RationaleBox hiện, OptionButton xanh/đỏ |

#### 2. `type AttemptState` — State shape

```typescript
type AttemptState = {
  phase: AttemptPhase
  selectedOptionId: string | null
  result: AttemptResult | null
  correctCount: number
}
```

**Kỹ thuật:** Gom tất cả state liên quan đến submit vào 1 object duy nhất. Không tách thành nhiều `useState` riêng lẻ — vì các state này thay đổi đồng bộ theo action.

**Liên hệ:** `result` kiểu `AttemptResult` import từ `types.ts:16-20` — interface chung cho cả hook và component `RationaleBox`:

```typescript
// types.ts
export interface AttemptResult {
  isCorrect: boolean        // đúng/sai
  correctOptionId: string   // ID đáp án đúng
  rationale: string         // giải thích
}
```

#### 3. `type AttemptAction` — Discriminated Union cho reducer

```typescript
type AttemptAction =
  | { type: 'SELECT'; optionId: string }
  | { type: 'SUBMIT_SUCCESS'; result: AttemptResult }
  | { type: 'SUBMIT_ERROR' }
  | { type: 'CLEAR' }
```

**Kỹ thuật:** **Discriminated Union** — mỗi action có `type` là literal string riêng, và payload khác nhau. TypeScript tự động thu hẹp kiểu trong `switch (action.type)`:

| Action | Payload | Khi nào xảy ra |
|---|---|---|
| `SELECT` | `optionId: string` | User click 1 option |
| `SUBMIT_SUCCESS` | `result: AttemptResult` | API `POST /api/attempts` trả về thành công |
| `SUBMIT_ERROR` | Không payload | API lỗi (mạng, server 500...) |
| `CLEAR` | Không payload | Chuẩn bị chuyển câu (handleNext) hoặc import mới |

**Liên hệ:** `AttemptResult` được định nghĩa ở `types.ts` — cùng kiểu với response JSON từ API route `POST /api/attempts`:

```typescript
// quiz.api.ts:13-15
interface SubmitAttemptResponse extends AttemptResult {
  attempt: { id: string }
}
```

→ API route trả về `{ isCorrect, correctOptionId, rationale, attempt: { id } }`
→ `SubmitAttemptResponse` kế thừa `AttemptResult` + thêm `attempt.id`

#### 4. `function attemptReducer` — Reducer thuần (pure function)

```typescript
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

**Kỹ thuật:** **Immutable update** — `...state` spread operator tạo object mới thay vì mutate. Mỗi case trả về state mới dựa trên state cũ + action.

**Sơ đồ chuyển phase:**
```
SELECT           SUBMIT_SUCCESS
idle ────────→ submitting ──────────→ answered
                 │                      │
                 │ SUBMIT_ERROR         │ CLEAR
                 └────→ idle ←──────────┘
```

**Điểm đặc biệt:** `correctCount` được tính trong reducer (dòng 31) — đây là **business logic thuần** nằm trong reducer, dễ test độc lập.

#### 5. `const INITIAL_STATE` — State khởi tạo (module-level)

```typescript
const INITIAL_STATE: AttemptState = {
  phase: 'idle',
  selectedOptionId: null,
  result: null,
  correctCount: 0,
}
```

**Kỹ thuật:** Tách hằng số ra khỏi function — **module-level constant**, chỉ tạo 1 lần khi file load. Tránh tạo object mới mỗi lần render (so với khai báo trong function component).

#### 6. `interface UseQuizAttemptOptions` — Props contract (input)

```typescript
interface UseQuizAttemptOptions {
  currentQuestion: Question | null  // từ useQuizQuestions → câu đang làm
  currentIdx: number                 // từ useQuizQuestions → vị trí hiện tại
  onStatsUpdate?: (total: number, correct: number) => void  // callback → QuizSection
}
```

**Liên hệ tới ai?**

| Prop | Ai cung cấp? | Đi đâu? |
|---|---|---|
| `currentQuestion` | `useQuizEngine.ts:48` — lấy từ `questionsHook.currentQuestion` | Dùng làm `question.id` gọi `submitAttempt()` |
| `currentIdx` | `useQuizEngine.ts:49` — lấy từ `questionsHook.currentIdx` | Tính `currentIdx + 1` gửi cho `onStatsUpdate` |
| `onStatsUpdate` | `useQuizEngine.ts:50` — nhận từ component `QuizEngine` props | Gọi `onStatsUpdate(currentIdx + 1, newCorrect)` → `QuizSection` update sidebar |

#### 7. `interface UseQuizAttemptReturn` — Output contract

```typescript
interface UseQuizAttemptReturn {
  selectedOptionId: string | null
  submitting: boolean
  result: AttemptResult | null
  correctCount: number
  handleSelect: (optionId: string) => Promise<void>
  clearAnswer: () => void
}
```

**Liên hệ tới ai?**

| Output | Ai dùng? | Để làm gì? |
|---|---|---|
| `selectedOptionId` | `QuizEngine` → `QuestionCard` → `OptionButton` | Highlight option đang được selected (trong lúc submitting) |
| `submitting` | `QuizEngine` | Hiển thị text "Đang kiểm tra..." trên UI |
| `result` | `QuizEngine` → `RationaleBox` | Render đúng/sai + rationale giải thích |
| `correctCount` | `QuizEngine` → stats UI | Hiển thị số câu đúng tích lũy |
| `handleSelect` | `QuizEngine` → `QuestionCard` → `OptionButton.onClick` | Xử lý khi user click 1 option |
| `clearAnswer` | `useQuizEngine.handleNext` và `reset` | Reset phase về `idle` trước khi chuyển câu |

#### 8. `useReducer` hook — State machine pattern

```typescript
const [state, dispatch] = useReducer(attemptReducer, INITIAL_STATE)
```

**Tại sao dùng `useReducer` thay vì `useState`?**

```
useState:  setPhase('submitting'); setSelectedOptionId(id); ...
           → 3-4 lần setState riêng lẻ, dễ sai thứ tự, gây re-render nhiều lần

useReducer: dispatch({ type: 'SELECT', optionId })
            → 1 lần dispatch → 1 lần re-render → state luôn đồng bộ
```

`useReducer` phù hợp khi:
- State là object nhiều field thay đổi cùng lúc
- Có nhiều phase chuyển đổi (state machine)
- Logic chuyển đổi phức tạp, muốn tách riêng khỏi component

#### 9. `handleSelect` — Function chính (xử lý click option)

```typescript
const handleSelect = useCallback(async (optionId: string) => {
  const question = options.currentQuestion
  if (!question || state.phase !== 'idle') return       // [1] Guard clause

  dispatch({ type: 'SELECT', optionId })                  // [2] Optimistic UI

  try {
    const data = await submitAttempt(question.id, optionId)  // [3] Gọi API
    const newCorrect = state.correctCount + (data.isCorrect ? 1 : 0)
    dispatch({ type: 'SUBMIT_SUCCESS', result: data })       // [4] Success → answered
    options.onStatsUpdate?.(options.currentIdx + 1, newCorrect)  // [5] Báo stats
  } catch {
    dispatch({ type: 'SUBMIT_ERROR' })                       // [6] Error → rollback
  }
}, [options.currentQuestion, options.currentIdx, state.phase,
    state.correctCount, options.onStatsUpdate])
```

**Phân tích từng kỹ thuật:**

| # | Kỹ thuật | Dòng | Giải thích |
|---|---|---|---|
| [1] | **Guard clause** | `if (!question \|\| phase !== 'idle') return` | Không cho submit nếu chưa có câu hỏi hoặc đang submit — tránh double click |
| [2] | **Optimistic UI** | `dispatch({ type: 'SELECT' })` | Cập nhật UI ngay lập tức trước khi API trả về — user thấy option bị disable ngay khi click |
| [3] | **Async/await** | `await submitAttempt(...)` | Gọi API bất đồng bộ — không block UI |
| [4] | **Derived state** | `newCorrect = correctCount + (isCorrect ? 1 : 0)` | Tính `newCorrect` local trước dispatch — tránh race condition do closure capturing state cũ |
| [5] | **Optional chaining** | `onStatsUpdate?.(...)` | Gọi callback lên parent component nếu được cung cấp (an toàn với `?.`) |
| [6] | **Rollback** | `catch → SUBMIT_ERROR` | Nếu API lỗi → phase về `idle`, user có thể click lại option khác |

**useCallback dependencies:** 5 dependencies được liệt kê chính xác để tránh **stale closure** — nếu thiếu `state.phase` hoặc `state.correctCount`, function sẽ dùng giá trị cũ khi render.

#### 10. `clearAnswer` — Reset function

```typescript
const clearAnswer = useCallback(() => {
  dispatch({ type: 'CLEAR' })
}, [])
```

**Kỹ thuật:** `useCallback` với `[]` dependency — function chỉ tạo 1 lần, không bao giờ thay đổi reference. Quan trọng vì `clearAnswer` được truyền vào `useQuizEngine.handleNext` — nếu reference thay đổi mỗi render, `handleNext` cũng bị recreate.

#### 11. Output wrapping — Derived state

```typescript
return {
  selectedOptionId: state.selectedOptionId,
  submitting: state.phase === 'submitting',   // derived boolean
  result: state.result,
  correctCount: state.correctCount,
  handleSelect,
  clearAnswer,
}
```

**submitting là derived state** — không phải state riêng, được suy ra từ `state.phase === 'submitting'`. Tránh duplicate state.

### Bản đồ liên kết đầy đủ

```
useQuizEngine (orchestrator)
    │
    ├── useQuizQuestions
    │     → cung cấp currentQuestion, currentIdx
    │
    ├── useQuizAttempt  ← BẠN ĐANG Ở ĐÂY
    │     │
    │     │ Input (từ orchestrator):
    │     │   currentQuestion  ── Question | null  ── từ questionsHook
    │     │   currentIdx       ── number             ── từ questionsHook
    │     │   onStatsUpdate    ── callback           ── từ QuizEngine props
    │     │
    │     │ Internal:
    │     │   useReducer(attemptReducer, INITIAL_STATE)
    │     │     → state: { phase, selectedOptionId, result, correctCount }
    │     │     → dispatch: SELECT | SUBMIT_SUCCESS | SUBMIT_ERROR | CLEAR
    │     │
    │     │ Gọi ra:
    │     │   quiz.api.submitAttempt(questionId, optionId)
    │     │     → POST /api/attempts body: { questionId, selectedOptionId }
    │     │     → response: { isCorrect, correctOptionId, rationale }
    │     │
    │     │ Output (cho orchestrator):
    │     │   selectedOptionId → QuestionCard → OptionButton (style)
    │     │   submitting       → QuizEngine (loading text)
    │     │   result           → RationaleBox (kết quả)
    │     │   correctCount     → QuizSection (stats)
    │     │   handleSelect     → QuestionCard → OptionButton.onClick
    │     │   clearAnswer      → handleNext / reset
    │     │
    │     └── useQuizImport
    │           → gọi clearAnswer khi import thành công
```

### Luồng sự kiện hoàn chỉnh khi user click 1 option

```
User click Option B trong OptionButton
  → OptionButton.onClick("opt_B")
    → QuestionCard.onSelect("opt_B")          [guard: nếu disabled thì không chạy]
      → QuizEngine.handleSelect("opt_B")      [thực chất là attemptHook.handleSelect]
        │
        ├─ [GUARD] if (!currentQuestion || phase !== 'idle') return
        │   → nếu đang submitting hoặc đã answered → bỏ qua
        │
        ├─ dispatch({ type: 'SELECT', optionId: "opt_B" })
        │   → state.phase = 'submitting'
        │   → state.selectedOptionId = "opt_B"
        │   → re-render: OptionButton B hiển thị selected (xanh border)
        │   → re-render: các OptionButton khác disabled (mờ, không click được)
        │
        ├─ await submitAttempt("q123", "opt_B")    // POST /api/attempts
        │   │
        │   ├─ SUCCESS:
        │   │   data = { isCorrect: true, correctOptionId: "opt_B", rationale: "..." }
        │   │   dispatch({ type: 'SUBMIT_SUCCESS', result: data })
        │   │   │   → state.phase = 'answered'
        │   │   │   → state.result = data
        │   │   │   → state.correctCount += 1 (nếu đúng)
        │   │   │   → re-render:
        │   │   │       OptionButton B → xanh + icon ✓
        │   │   │       RationaleBox hiện → "Correct! + rationale"
        │   │   │
        │   │   onStatsUpdate(currentIdx + 1, correctCount + 1)
        │   │     → QuizSection.setStats({ total, correct })
        │   │     → sidebar stats update
        │   │
        │   └─ ERROR: (mạng lỗi, server 500...)
        │       dispatch({ type: 'SUBMIT_ERROR' })
        │         → state.phase = 'idle'
        │         → state.selectedOptionId = null
        │         → re-render: tất cả option về trạng thái ban đầu
        │         → user có thể click lại option khác
        │
User click "Next Question" button
  → RationaleBox.onNext()
    → QuizEngine.handleNext()
      ├─ attemptHook.clearAnswer()
      │   → dispatch({ type: 'CLEAR' })
      │     → state.phase = 'idle'
      │     → state.result = null
      │     → state.selectedOptionId = null
      │
      └─ questionsHook.advanceQuestion()
          → currentIdx + 1
          → currentQuestion = questions[currentIdx + 1]
          → QuestionCard render câu mới
```

### Output hook cung cấp cho orchestrator

```typescript
{
  selectedOptionId,    // string | null — option đang chọn (trong lúc submitting)
  submitting,          // boolean — true nếu đang gọi API
  result,              // AttemptResult | null — { isCorrect, correctOptionId, rationale }
  correctCount,        // number — tổng số câu đúng tích lũy
  handleSelect,        // (optionId: string) => Promise<void>
  clearAnswer,         // () => void
}
```

### Tổng kết

| Câu hỏi | Trả lời |
|---|---|
| **Để làm gì?** | Quản lý state machine trả lời câu hỏi — từ click → submit API → hiện kết quả |
| **Logic cho ai?** | Cho `useQuizEngine` (orchestrator) — cung cấp `handleSelect` cho `QuestionCard`, `result` cho `RationaleBox`, `correctCount` cho stats |
| **Tại sao tách riêng?** | Vì submit logic không liên quan đến danh sách questions. Nếu gộp vào `useQuizQuestions`, mỗi lần đổi câu phải reset state submit → phức tạp và dễ bug |
| **Input nhận gì?** | `currentQuestion` (từ useQuizQuestions), `currentIdx`, `onStatsUpdate` |
| **Output trả gì?** | `selectedOptionId`, `submitting`, `result`, `correctCount`, `handleSelect`, `clearAnswer` |

---

## 10. hooks/useQuizImport.ts — Hook quản lý import dialog

**File:** `src/features/quiz/hooks/useQuizImport.ts`

### Mục đích tồn tại

Là hook **quản lý dialog import câu hỏi** — cho phép user tự nhập JSON câu hỏi hoặc dùng AI sinh. Nó đóng vai trò:

1. **Quản lý UI state** của dialog (mở/đóng, nội dung textarea, lỗi)
2. **Sinh template mẫu** + prompt cho AI qua `quiz.controller`
3. **Parse + validate JSON** user nhập và gửi lên orchestrator

### Nó đang thực hiện logic cho AI? Cho cái gì?

Cho `useQuizEngine` (orchestrator).

Khi import thành công, gọi `onImportQuestions` — callback do `useQuizEngine` cung cấp:

```typescript
// useQuizEngine.ts:53
const importHook = useQuizImport({
  type: options.type,
  onImportQuestions: (questions) => {
    questionsHook.setQuestions(questions)    // gán questions mới
    questionsHook.resetIdx()                 // quay về câu đầu
    attemptHook.clearAnswer()                // reset trạng thái submit
    options.onStatsUpdate?.(0, 0)            // reset stats
  },
})
```

```
useQuizEngine (tổng điều phối)
  ├── useQuizQuestions   ← quản lý questions + currentIdx
  ├── useQuizAttempt     ← quản lý submit + kết quả
  └── useQuizImport      ← quản lý import JSON  [BẠN ĐANG Ở ĐÂY]
        Gọi controllers: generateTemplate, generatePrompt, parseImportedJSON
        Gọi callback: onImportQuestions → setQuestions + resetIdx + clearAnswer + reset stats
```

### Luồng chi tiết hook hoạt động

#### 1. `openImport()` — Mở dialog

```typescript
const openImport = useCallback(() => {
  const currentType = options.type ?? 'word-form'
  setImportJson(generateTemplate(currentType))    // JSON mẫu vào textarea
  setPromptText(generatePrompt(currentType))       // prompt cho AI
  setImportError('')
  setShowImport(true)
}, [options.type])
```

#### 2. User edit textarea

```typescript
// setImportJson — user gõ vào textarea, state được update trực tiếp
// ImportDialog: <textarea value={importJson} onChange={e => setImportJson(e.target.value)} />
```

#### 3. `submitImport()` — Xác nhận import

```typescript
const submitImport = useCallback(() => {
  setImportError('')
  try {
    const parsed = parseImportedJSON(importJson, options.type ?? 'word-form')
    if (parsed.length === 0) {
      setImportError('Không tìm thấy câu hỏi nào trong dữ liệu.')
      return
    }
    options.onImportQuestions(parsed)   // gửi lên orchestrator
    setShowImport(false)                 // đóng dialog
  } catch (e) {
    setImportError(e instanceof Error ? e.message : 'Lỗi parse JSON')
  }
}, [importJson, options.type, options.onImportQuestions])
```

### Output hook cung cấp cho orchestrator

```typescript
{
  showImport,      // boolean — render ImportDialog hay không
  importJson,      // string — nội dung textarea
  importError,     // string — thông báo lỗi (rỗng nếu không lỗi)
  promptText,      // string — prompt cho AI (⚠ hiện không dùng)
  openImport,      // () => void — mở dialog
  submitImport,    // () => void — xác nhận import
  setImportJson,   // (value: string) => void — edit textarea
  closeImport,     // () => void — đóng dialog
}
```

### Tổng kết

| Câu hỏi | Trả lời |
|---|---|
| **Để làm gì?** | Quản lý dialog import — cho user paste JSON câu hỏi hoặc dùng template AI |
| **Logic cho ai?** | Cho `useQuizEngine` (orchestrator) — import xong gọi callback để cập nhật questions, reset vị trí, reset stats |
| **Tại sao tách riêng?** | Vì import là feature độc lập — không liên quan đến questions list hay submit. Nếu gộp vào `useQuizEngine` sẽ phình to và khó maintain |
| **Input nhận gì?** | `type` (để sinh template/prompt), `onImportQuestions` (callback khi import xong) |
| **Output trả gì?** | showImport, importJson, importError, promptText + 4 handlers (open, submit, set, close) |

---

## 11. hooks/useQuizEngine.ts — Hook orchestrator tổng điều phối

**File:** `src/features/quiz/hooks/useQuizEngine.ts`

### Mục đích tồn tại

Là hook **orchestrator (tổng điều phối)** — kết nối 3 hook con (`useQuizQuestions`, `useQuizAttempt`, `useQuizImport`) thành 1 interface duy nhất cho component `QuizEngine`. Nó đóng vai trò:

1. **Khởi tạo 3 hook con** với đúng props — truyền `currentQuestion` từ questionsHook xuống attemptHook
2. **Định nghĩa functions phối hợp** (`handleNext`, `reset`) — gọi nhiều hook con cùng lúc
3. **Map output** của 3 hook con thành 1 interface flat duy nhất

### Nó đang thực hiện logic cho AI? Cho cái gì?

Cho component `QuizEngine` — component không cần biết bên trong có 3 hook con, chỉ cần 1 `useQuizEngine(props)`:

```typescript
// QuizEngine.tsx
const engine = useQuizEngine({ type, difficulty, initialQuestions, onStatsUpdate })
// engine.handleSelect → chuyển đến attemptHook
// engine.handleNext → clearAnswer + advanceQuestion
// engine.reset → resetIdx + clearAnswer + reset stats
```

```
QuizEngine (component)                                 [AI Ở ĐÂY]
  │
  └── useQuizEngine(props)                             [BẠN ĐANG Ở ĐÂY]
        │
        ├── useQuizQuestions({ type, difficulty, initialQuestions })
        │     → questionsHook: { currentQuestion, currentIdx, advanceQuestion, resetIdx, ... }
        │
        ├── useQuizAttempt({ currentQuestion, currentIdx, onStatsUpdate })
        │     → attemptHook: { selectedOptionId, result, correctCount, handleSelect, clearAnswer }
        │     ↑ phụ thuộc currentQuestion từ questionsHook — đây là cầu nối
        │
        └── useQuizImport({ type, onImportQuestions })
              → importHook: { showImport, importJson, importError, ... }
              ↑ onImportQuestions gọi questionsHook.setQuestions + resetIdx + attemptHook.clearAnswer
```

### Luồng chi tiết hook hoạt động

#### 1. Orchesrate 3 hook con (đầu file)

```typescript
const questionsHook = useQuizQuestions({
  type: options.type,
  difficulty: options.difficulty,
  initialQuestions: options.initialQuestions,
})

const attemptHook = useQuizAttempt({
  currentQuestion: questionsHook.currentQuestion,
  currentIdx: questionsHook.currentIdx,
  onStatsUpdate: options.onStatsUpdate,
})

const importHook = useQuizImport({
  type: options.type,
  onImportQuestions: (questions) => {
    questionsHook.setQuestions(questions)
    questionsHook.resetIdx()
    attemptHook.clearAnswer()
    options.onStatsUpdate?.(0, 0)
  },
})
```

#### 2. `handleNext` — Chuyển câu tiếp theo

```typescript
const handleNext = useCallback(() => {
  attemptHook.clearAnswer()          // reset attempt: phase → idle, result → null
  questionsHook.advanceQuestion()    // currentIdx + 1 → câu tiếp theo
}, [attemptHook.clearAnswer, questionsHook.advanceQuestion])
```

#### 3. `reset` — Reset toàn bộ

```typescript
const reset = useCallback(() => {
  questionsHook.resetIdx()           // currentIdx → 0
  attemptHook.clearAnswer()          // reset attempt
  options.onStatsUpdate?.(0, 0)      // reset stats parent
}, [questionsHook.resetIdx, attemptHook.clearAnswer, options.onStatsUpdate])
```

### Output hook cung cấp cho QuizEngine

```typescript
{
  // Từ useQuizQuestions:
  currentQuestion, currentIdx, totalQuestions, isLoading, isComplete, isEmpty,
  // Từ useQuizAttempt:
  selectedOptionId, submitting, result, correctCount, handleSelect,
  // Từ useQuizImport:
  showImport, importJson, importError, promptText,
  handleOpenImport, handleSubmitImport, setImportJson, closeImport,
  // Tự định nghĩa:
  handleNext, reset
}
```

### Tổng kết

| Câu hỏi | Trả lời |
|---|---|
| **Để làm gì?** | Tổng điều phối 3 hook con, cung cấp 1 interface duy nhất cho component QuizEngine |
| **Logic cho ai?** | Cho component `QuizEngine` — component chỉ cần gọi 1 hook thay vì 3 hook riêng lẻ |
| **Tại sao cần hook này?** | Pattern **Composition Hook**: gom 3 responsibility liên quan nhưng tách rời vào 1 orchestrator, giữ cho component gọn nhẹ |
| **Input nhận gì?** | `type`, `difficulty`, `initialQuestions` (→ questionsHook), `onStatsUpdate` (→ attemptHook + importHook) |
| **Output trả gì?** | 24 values — gồm state + handlers từ 3 hook con + 2 functions phối hợp (handleNext, reset) |
  currentQuestion, currentIdx, totalQuestions, isLoading, isComplete, isEmpty,
  // Từ useQuizAttempt:
  selectedOptionId, submitting, result, correctCount, handleSelect,
  // Từ useQuizImport:
  showImport, importJson, importError, promptText,
  handleOpenImport, handleSubmitImport, setImportJson, closeImport,
  // Tự định nghĩa:
  handleNext, reset
}
```

---

## 12. components/QuizEngine/QuizEngine.tsx — Smart Component

**File:** `src/features/quiz/components/QuizEngine/QuizEngine.tsx`

### Input (props)

| Prop | Kiểu | Truyền từ |
|---|---|---|
| `type` | `string \| undefined` | `QuizSection` |
| `difficulty` | `string \| undefined` | `QuizSection` |
| `initialQuestions` | `Question[] \| undefined` | `QuizSection` |
| `onStatsUpdate` | `((total, correct) => void) \| undefined` | `QuizSection` |

### Render logic (4 trạng thái)

```
QuizEngine(props)
  → useQuizEngine(props)  // 24 values
  │
  ├── isLoading === true?
  │   └── render: <Loader2 /> spinner
  │
  ├── isEmpty === true?  (hết câu hỏi sau fetch lỗi)
  │   └── render: "Chưa có câu hỏi" + button Import
  │
  ├── isComplete === true?  (currentIdx >= questions.length)
  │   └── render: "Hoàn thành!" + stats + reset + import buttons
  │
  └── default (có câu hỏi)
      └── render:
            ├─ Header: "Câu X/Y" + "Đang kiểm tra..." (nếu submitting)
            ├─ QuestionCard (nếu currentQuestion)
            │   props: question, selectedOptionId, correctOptionId, onSelect
            ├─ RationaleBox (nếu result)
            │   props: isCorrect, rationale, onNext, hasNext
            └─ ImportDialog (nếu showImport)
                props: type, importJson, importError, ...handlers
```

### Props mapping đến component con

| Component | Props từ QuizEngine |
|---|---|
| `QuestionCard` | `currentQuestion`, `selectedOptionId`, `result?.correctOptionId ?? null`, `handleSelect` |
| `RationaleBox` | `result.isCorrect`, `result.rationale`, `handleNext`, `currentIdx < totalQuestions - 1` |
| `ImportDialog` | `props.type`, `importJson`, `importError`, `setImportJson`, `handleSubmitImport`, `closeImport` |

---

## 13. components/QuestionCard/QuestionCard.tsx

**File:** `src/features/quiz/components/QuestionCard/QuestionCard.tsx`

### Input (props)

| Prop | Kiểu | Nguồn |
|---|---|---|
| `question` | `{ id, questionText, type, hint?, options[] }` | `QuizEngine.currentQuestion` |
| `selectedOptionId` | `string \| null` | `useQuizAttempt.selectedOptionId` |
| `correctOptionId` | `string \| null` | `useQuizAttempt.result?.correctOptionId` |
| `onSelect` | `(optionId: string) => void` | `useQuizAttempt.handleSelect` |

### Logic

```
QuestionCard render:
  ├─ Badge: question.type
  ├─ Text: question.questionText
  │
  ├─ Options list:
  │   └─ map each option:
  │       └─ getOptionStatus(opt.id, selectedOptionId, correctOptionId)
  │         → status: 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled'
  │       └─ <OptionButton text, label={A/B/C/D}, status, onSelect />
  │
  └─ Hint box (nếu isAnswered && question.hint)
      ├─ Đúng → border xanh
      └─ Sai → border đỏ
```

### Controller sử dụng

- `getOptionStatus()` từ `question.controller`  
  **Input:** `optId, selectedOptionId, correctOptionId`  
  **Output:** `OptionStatus`

---

## 14. components/OptionButton/OptionButton.tsx

**File:** `src/features/quiz/components/OptionButton/OptionButton.tsx`

### Input (props)

| Prop | Kiểu | Mô tả |
|---|---|---|
| `text` | `string` | Nội dung đáp án |
| `label` | `string` | `"A"` / `"B"` / `"C"` / `"D"` |
| `status` | `OptionStatus` | Trạng thái hiển thị |
| `onSelect` | `() => void` | Callback khi click |

### Render logic

```
STATUS_STYLES[status]:
  idle      → border-default, hover xanh
  selected  → border xanh, bg xanh nhạt
  correct   → border xanh, bg xanh nhạt + icon ✓
  wrong     → border đỏ, bg đỏ nhạt + icon ✗
  disabled  → opacity 60, cursor not-allowed

onClick: chỉ chạy nếu status !== 'disabled'
```

---

## 15. components/RationaleBox/RationaleBox.tsx

**File:** `src/features/quiz/components/RationaleBox/RationaleBox.tsx`

### Input (props)

| Prop | Kiểu | Nguồn |
|---|---|---|
| `isCorrect` | `boolean` | `result.isCorrect` |
| `rationale` | `string` | `result.rationale` |
| `onNext` | `() => void` | `useQuizEngine.handleNext` |
| `hasNext` | `boolean` | `currentIdx < totalQuestions - 1` |

### Render

```
RationaleBox:
  ├─ Header: "Correct!" (xanh) / "Incorrect" (đỏ) + icon
  ├─ Body: rationale text
  └─ Button "Next Question" (chỉ nếu hasNext === true)
      → onClick: onNext
```

---

## 16. components/ImportDialog/ImportDialog.tsx

**File:** `src/features/quiz/components/ImportDialog/ImportDialog.tsx`

### Input (props)

| Prop | Kiểu | Nguồn |
|---|---|---|
| `type` | `string` | `QuizEngine.props.type` |
| `importJson` | `string` | `useQuizImport.importJson` |
| `importError` | `string` | `useQuizImport.importError` |
| `onImportJsonChange` | `(value) => void` | `useQuizImport.setImportJson` |
| `onSubmitImport` | `() => void` | `useQuizImport.submitImport` |
| `onClose` | `() => void` | `useQuizImport.closeImport` |

### Controller sử dụng

- `generatePrompt(type)` — render prompt cho AI (dòng 22)
- `generateTemplate(type)` — button "Đặt lại mẫu" (dòng 82)

### Render

```
ImportDialog (modal):
  ├─ Header: "Tự nhập câu hỏi" + ✕ button
  ├─ AI instruction box
  │   └─ <pre>{promptText}</pre>  ← generatePrompt(type)
  ├─ Textarea: {importJson} + onChange → onImportJsonChange
  ├─ Error box (nếu importError)
  └─ Buttons:
      ├─ "Sử dụng câu hỏi này" → onSubmitImport
      └─ "Đặt lại mẫu" → onImportJsonChange(generateTemplate(type))
```

---

## 17. sections/QuizSection/QuizSection.tsx

**File:** `src/features/quiz/components/sections/QuizSection/QuizSection.tsx`

### Input (props)

| Prop | Kiểu | Nguồn |
|---|---|---|
| `type` | `string` | `page.tsx` |
| `initialQuestions` | `Question[]` | `page.tsx` (từ server) |

### State

| State | Kiểu | Set khi nào |
|---|---|---|
| `stats` | `{ total: number, correct: number }` | `onStatsUpdate` callback từ QuizEngine |

### Render

```
QuizSection:
  ├─ Main: <QuizEngine type initialQuestions onStatsUpdate />
  └─ Sidebar:
      ├─ ProgressChart (correct, total)
      └─ StatsSummary (completed, total, correct)
```

---

## 18. sections/TheorySection/TheorySection.tsx

**File:** `src/features/quiz/components/sections/TheorySection/TheorySection.tsx`

### Input (props)

| Prop | Kiểu | Nguồn |
|---|---|---|
| `type` | `string` | `page.tsx` |

### Controller sử dụng

- `getTheoryContent(type)` từ `theory.controller`  
  **Input:** `"comparison"`  
  **Output:** `{ title: string, content: JSX }`

### Render

```tsx
<TheorySection type="comparison">
  → getTheoryContent("comparison")
    → { title: "Bảng Tra Cứu So Sánh Hơn", content: <table>...</table> }
  → Render title + content
```

---

## 19. sections/PracticeHeaderSection/PracticeHeaderSection.tsx

**File:** `src/features/quiz/components/sections/PracticeHeaderSection/PracticeHeaderSection.tsx`

### Input (props)

| Prop | Kiểu | Nguồn |
|---|---|---|
| `typeLabel` | `string` | `TYPE_LABEL_MAP[type]` (từ page.tsx) |
| `contextDesc` | `string` | `TYPE_CONTEXT[type]` (từ page.tsx) |

### Render

```
PracticeHeaderSection:
  ├─ Badge: "Part 5 Practice"
  ├─ h1: typeLabel (VD: "So Sánh Hơn")
  └─ p: contextDesc (mô tả ngắn)
```

---

## Phụ lục: Bảng mapping Controller → Hook → Component

| Controller function | Gọi từ hook | Hook gọi từ | Component render |
|---|---|---|---|
| `generateTemplate(type)` | `useQuizImport.openImport()` | `useQuizEngine` | `ImportDialog` button "Đặt lại mẫu" |
| `generatePrompt(type)` | `ImportDialog` render (trực tiếp) | — | `ImportDialog` `<pre>` |
| `parseImportedJSON(raw, type)` | `useQuizImport.submitImport()` | `useQuizEngine` | — |
| `calculateAccuracy(correct, total)` | ⚠ Không dùng | — | — |
| `getOptionStatus(optId, selId, corId)` | — | — | `QuestionCard` render |
| `getTheoryContent(type)` | — | — | `TheorySection` render |
