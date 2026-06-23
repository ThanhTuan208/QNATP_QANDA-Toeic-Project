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

## 8. hooks/useQuizQuestions.ts — Quản lý danh sách câu hỏi

**File:** `src/features/quiz/hooks/useQuizQuestions.ts`

### Input (options)

| Prop | Kiểu | Mục đích | Bắt buộc? |
|---|---|---|---|
| `type` | `string \| undefined` | Filter type khi fetch API | Không |
| `difficulty` | `string \| undefined` | Filter độ khó khi fetch API | Không |
| `initialQuestions` | `Question[] \| undefined` | Data từ server, nếu có thì skip fetch | Không |

### Internal State

| State | Kiểu | Initial | Set khi nào |
|---|---|---|---|
| `questions` | `Question[]` | `initialQuestions ?? []` | Fetch thành công / lỗi / import |
| `currentIdx` | `number` | `0` | `advanceQuestion()` / `resetIdx()` |
| `isLoading` | `boolean` | `!initialQuestions` | `useEffect` chạy → `true` → `finally` → `false` |

### Derived State (tính từ state, không phải state riêng)

| Value | Công thức | Dùng ở đâu |
|---|---|---|
| `currentQuestion` | `questions[currentIdx] ?? null` | QuizEngine → QuestionCard |
| `totalQuestions` | `questions.length` | Hiển thị `Câu X / Y` |
| `isEmpty` | `questions.length === 0 && !isLoading` | QuizEngine render "Chưa có câu hỏi" |
| `isComplete` | `currentIdx >= questions.length && length > 0` | QuizEngine render "Hoàn thành!" |

### Flow thực thi

```
[KHỞI TẠO]
useQuizQuestions({ type: "comparison", initialQuestions: [...] })
  → initialQuestions có → questions = initialQuestions, isLoading = false
  → useEffect KHÔNG chạy (skip vì có initialQuestions)

useQuizQuestions({ type: "comparison" })  // không initialQuestions
  → questions = [], isLoading = true
  → useEffect chạy
    → fetchQuestions({ type: "comparison" })
      → .then: setQuestions(data.questions), isLoading = false
      → .catch: setQuestions([]), isLoading = false

[ADVANCE]
advanceQuestion() → setCurrentIdx(i => i + 1)
  → currentQuestion = questions[currentIdx + 1]
  → isComplete = (currentIdx + 1) >= questions.length

[RESET]
resetIdx() → setCurrentIdx(0)
  → currentQuestion = questions[0], isComplete = false

[IMPORT (từ bên ngoài)]
setQuestions(newQuestions)  // do useQuizEngine gọi từ import hook
  → questions = newQuestions, currentIdx giữ nguyên
  → Cần resetIdx() sau đó
```

### Output (return)

| Value | Kiểu | Nguồn |
|---|---|---|
| `questions` | `Question[]` | State |
| `currentQuestion` | `Question \| null` | Derived |
| `currentIdx` | `number` | State |
| `totalQuestions` | `number` | Derived |
| `isLoading` | `boolean` | State |
| `isEmpty` | `boolean` | Derived |
| `isComplete` | `boolean` | Derived |
| `setQuestions` | `(Question[]) => void` | Setter — dùng cho import |
| `advanceQuestion` | `() => void` | `setCurrentIdx(i => i+1)` |
| `resetIdx` | `() => void` | `setCurrentIdx(0)` |

---

## 9. hooks/useQuizAttempt.ts — State Machine trả lời

**File:** `src/features/quiz/hooks/useQuizAttempt.ts`

### Input (options)

| Prop | Kiểu | Mục đích |
|---|---|---|
| `currentQuestion` | `Question \| null` | Question hiện tại để gửi lên API |
| `currentIdx` | `number` | Index hiện tại để gửi stats |
| `onStatsUpdate` | `((total, correct) => void) \| undefined` | Callback báo parent stats |

### State Machine (useReducer)

**State:**
```
{
  phase: 'idle' | 'submitting' | 'answered'
  selectedOptionId: string | null
  result: AttemptResult | null
  correctCount: number
}
```

**Actions:**

| Action | Điều kiện | State cũ → State mới |
|---|---|---|
| `SELECT` `{ optionId }` | phase === 'idle' | `idle` → `submitting`, set `selectedOptionId` |
| `SUBMIT_SUCCESS` `{ result }` | — | `submitting` → `answered`, set `result`, `correctCount += 1` nếu đúng |
| `SUBMIT_ERROR` | — | `submitting` → `idle`, clear `selectedOptionId` |
| `CLEAR` | — | `answered` → `idle`, clear `selectedOptionId` + `result` |

### Flow thực thi

```
handleSelect("opt_B")
  │
  ├─ Guard: if (!currentQuestion) return
  │         if (phase !== 'idle') return
  │
  ├─ dispatch(SELECT, "opt_B")
  │   → phase = 'submitting', selectedOptionId = "opt_B"
  │   → QuizEngine re-render: OptionButton B hiển thị selected, disabled các option khác
  │
  ├─ await submitAttempt("q123", "opt_B")    // POST /api/attempts
  │   ├─ SUCCESS:
  │   │   → data = { isCorrect: true, correctOptionId: "opt_B", rationale: "..." }
  │   │   → newCorrect = correctCount + 1
  │   │   → dispatch(SUBMIT_SUCCESS, data)
  │   │   │   → phase = 'answered', result = data, correctCount += 1
  │   │   │   → QuizEngine re-render: OptionButton B xanh, RationaleBox hiện
  │   │   → onStatsUpdate(currentIdx + 1, newCorrect)
  │   │     → QuizSection.setStats({ total: currentIdx+1, correct: newCorrect })
  │   │
  │   └─ ERROR:
  │       → dispatch(SUBMIT_ERROR)
  │         → phase = 'idle', selectedOptionId = null (user có thể thử lại)
  │
clearAnswer()
  → dispatch(CLEAR) → phase = 'idle', result = null, selectedOptionId = null
```

### Output (return)

| Value | Kiểu | Nguồn |
|---|---|---|
| `selectedOptionId` | `string \| null` | `state.selectedOptionId` |
| `submitting` | `boolean` | Derived: `state.phase === 'submitting'` |
| `result` | `AttemptResult \| null` | `state.result` |
| `correctCount` | `number` | `state.correctCount` |
| `handleSelect` | `(optionId: string) => Promise<void>` | Function |
| `clearAnswer` | `() => void` | Function |

---

## 10. hooks/useQuizImport.ts — Import dialog

**File:** `src/features/quiz/hooks/useQuizImport.ts`

### Input (options)

| Prop | Kiểu | Mục đích |
|---|---|---|
| `type` | `string \| undefined` | Dùng cho `generateTemplate`, `generatePrompt`, `parseImportedJSON` |
| `onImportQuestions` | `(Question[]) => void` | Callback gửi questions đã parse lên orchestrator |

### Internal State

| State | Kiểu | Set khi nào |
|---|---|---|
| `showImport` | `boolean` | `openImport` → true, `submitImport`/`closeImport` → false |
| `importJson` | `string` | `openImport` → template, user edit → `setImportJson` |
| `importError` | `string` | `openImport` → clear, `submitImport` → lỗi parse |
| `promptText` | `string` | `openImport` → `generatePrompt(type)` |

### Flow thực thi

```
openImport()
  → type = options.type ?? 'word-form'
  → setImportJson(generateTemplate(type))    // JSON mẫu vào textarea
  → setPromptText(generatePrompt(type))       // prompt cho AI
  → setImportError('')
  → setShowImport(true)                       // hiện dialog

User edit textarea → setImportJson(newValue)

submitImport()
  → setImportError('')
  → try:
      parsed = parseImportedJSON(importJson, options.type ?? 'word-form')
      if (parsed.length === 0):
        setImportError('Không tìm thấy câu hỏi nào.')
        return
      onImportQuestions(parsed)               // gửi lên orchestrator
      setShowImport(false)                    // đóng dialog
    catch(e):
      setImportError(e.message)               // hiện lỗi parse

closeImport()
  → setShowImport(false)
```

### Output (return)

| Value | Kiểu | Ghi chú |
|---|---|---|
| `showImport` | `boolean` | Render dialog |
| `importJson` | `string` | Nội dung textarea |
| `importError` | `string` | Thông báo lỗi |
| `promptText` | `string` | ⚠ Return nhưng **không dùng** (QuizEngine không destructure) |
| `openImport` | `() => void` | Mở dialog |
| `submitImport` | `() => void` | Xác nhận import |
| `setImportJson` | `(value: string) => void` | Edit textarea |
| `closeImport` | `() => void` | Đóng dialog |

---

## 11. hooks/useQuizEngine.ts — Orchestrator

**File:** `src/features/quiz/hooks/useQuizEngine.ts`

### Input (options)

| Prop | Kiểu | Đi đâu |
|---|---|---|
| `type` | `string \| undefined` | → `useQuizQuestions`, `useQuizImport` |
| `difficulty` | `string \| undefined` | → `useQuizQuestions` |
| `initialQuestions` | `Question[] \| undefined` | → `useQuizQuestions` |
| `onStatsUpdate` | `((total, correct) => void) \| undefined` | → `useQuizAttempt` + `reset` |

### Logic orchestration

Hook này **không có state riêng**. Nó chỉ:

1. **Khởi tạo 3 hook con** với đúng props
2. **Định nghĩa functions phối hợp** (`handleNext`, `reset`)
3. **Map output** của 3 hook con thành 1 interface duy nhất

```
useQuizEngine({ type, difficulty, initialQuestions, onStatsUpdate })
  │
  ├── useQuizQuestions({ type, difficulty, initialQuestions })
  │     → questionsHook: { questions, currentQuestion, currentIdx, totalQuestions,
  │                        isLoading, isEmpty, isComplete, setQuestions,
  │                        advanceQuestion, resetIdx }
  │
  ├── useQuizAttempt({
  │       currentQuestion: questionsHook.currentQuestion,
  │       currentIdx: questionsHook.currentIdx,
  │       onStatsUpdate
  │     })
  │     → attemptHook: { selectedOptionId, submitting, result, correctCount,
  │                      handleSelect, clearAnswer }
  │
  └── useQuizImport({
        type,
        onImportQuestions: (questions) => {
          questionsHook.setQuestions(questions)
          questionsHook.resetIdx()
          attemptHook.clearAnswer()
          onStatsUpdate?.(0, 0)
        }
      })
      → importHook: { showImport, importJson, importError, promptText,
                      openImport, submitImport, setImportJson, closeImport }
```

### Functions tự định nghĩa

#### `handleNext` (dòng 63-66)
```ts
const handleNext = useCallback(() => {
  attemptHook.clearAnswer()         // reset attempt: phase → idle, result → null
  questionsHook.advanceQuestion()   // currentIdx + 1 → câu tiếp theo
}, [attemptHook.clearAnswer, questionsHook.advanceQuestion])
```

#### `reset` (dòng 68-72)
```ts
const reset = useCallback(() => {
  questionsHook.resetIdx()          // currentIdx → 0
  attemptHook.clearAnswer()         // reset attempt
  options.onStatsUpdate?.(0, 0)     // reset stats parent
}, [questionsHook.resetIdx, attemptHook.clearAnswer, options.onStatsUpdate])
```

### Output (return) — 24 values

Đây là interface duy nhất mà component `QuizEngine` thấy:

```ts
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
