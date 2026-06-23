# Quiz Feature — Architecture & Data Flow

Feature path: `src/features/quiz/`

> 📖 **Chi tiết từng file code (input/output, flow, data transform):** [quiz-flow-detailed.md](quiz-flow-detailed.md)

---

## 1. Tổng Quan Layers

Quiz feature được chia làm 4 tầng, mỗi tầng có 1 responsibility duy nhất:

```
┌─────────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER  (components/*)                                 │
│  - Chỉ render JSX từ props                                          │
│  - Không gọi API, không chứa business logic                         │
│  - Chỉ gọi hook duy nhất: QuizEngine gọi useQuizEngine              │
├─────────────────────────────────────────────────────────────────────┤
│  ORCHESTRATION LAYER  (hooks/*)                                     │
│  - useQuizEngine: compose các data hooks, wire cross-cutting logic  │
│  - useQuizQuestions: quản lý danh sách câu hỏi + index             │
│  - useQuizAttempt: quản lý luồng trả lời (select → submit → result)│
│  - useQuizImport: quản lý dialog nhập câu hỏi                      │
├─────────────────────────────────────────────────────────────────────┤
│  PURE LOGIC LAYER  (controllers/*)                                  │
│  - Pure functions: cùng input → cùng output                         │
│  - Không import React, không gọi API, không side-effect            │
│  - Có thể test unit mà ko cần mock                                  │
├─────────────────────────────────────────────────────────────────────┤
│  NETWORK LAYER  (api/*)                                             │
│  - Chỉ gọi fetch(), trả về typed Promise                           │
│  - Không state, không logic transformation                          │
└─────────────────────────────────────────────────────────────────────┘
```

### File index

| File | Layer | Lines | Responsibility | Chi tiết |
|---|---|---|---|---|
| `types.ts` | Definition | 15 | Interfaces: `Question`, `AttemptResult`, `Option`, `OptionStatus`, `QuizState` | [📖](quiz-flow-detailed.md#2-typests--định-nghĩa-dữ-liệu) |
| `constants.ts` | Definition | 65 | Label maps, TYPE_CONTEXT, OPTION_LABELS, VALID_QUIZ_TYPES | [📖](quiz-flow-detailed.md#3-constantsts--hằng-số) |
| `api/quiz.api.ts` | Network | 35 | `fetchQuestions()`, `submitAttempt()` | [📖](quiz-flow-detailed.md#4-apiquizapits--network-layer) |
| `controllers/quiz.controller.ts` | Pure Logic | 90 | `generateTemplate()`, `generatePrompt()`, `parseImportedJSON()`, `calculateAccuracy()` | [📖](quiz-flow-detailed.md#5-controllersquizcontrollerts--pure-logic) |
| `controllers/question.controller.ts` | Pure Logic | 13 | `getOptionStatus()` | [📖](quiz-flow-detailed.md#6-controllersquestioncontrollerts--option-status-logic) |
| `controllers/theory.controller.tsx` | Pure Logic | 620 | `THEORY_DATA`, `getTheoryContent()` | [📖](quiz-flow-detailed.md#7-controllerstheorycontrollertsx--lý-thuyết) |
| `hooks/useQuizQuestions.ts` | Orchestration | 55 | Load questions, track currentIdx | [📖](quiz-flow-detailed.md#8-hooksusequizquestionsts--quản-lý-danh-sách-câu-hỏi) |
| `hooks/useQuizAttempt.ts` | Orchestration | 95 | Answer flow state machine (useReducer) | [📖](quiz-flow-detailed.md#9-hooksusequizattemptts--state-machine-trả-lời) |
| `hooks/useQuizImport.ts` | Orchestration | 58 | Import dialog state | [📖](quiz-flow-detailed.md#10-hooksusequizimportts--import-dialog) |
| `hooks/useQuizEngine.ts` | Orchestration | 95 | Compose 3 hooks trên, wire callbacks | [📖](quiz-flow-detailed.md#11-hooksusequizenginets--orchestrator) |
| `components/QuizEngine/QuizEngine.tsx` | Presentation | 160 | Smart component: call useQuizEngine, render children | [📖](quiz-flow-detailed.md#12-componentsquizenginequizenginetsx--smart-component) |
| `components/ImportDialog/ImportDialog.tsx` | Presentation | 90 | Dumb dialog: render + call controller for prompt | [📖](quiz-flow-detailed.md#16-componentsimportdialogimportdialogtsx) |
| `components/QuestionCard/QuestionCard.tsx` | Presentation | 65 | Dumb: question text + options + hint | [📖](quiz-flow-detailed.md#13-componentsquestioncardquestioncardtsx) |
| `components/OptionButton/OptionButton.tsx` | Presentation | 65 | Dumb: single option button with status styling | [📖](quiz-flow-detailed.md#14-componentsoptionbuttonoptionbuttontsx) |
| `components/RationaleBox/RationaleBox.tsx` | Presentation | 50 | Dumb: correct/incorrect + rationale + next | [📖](quiz-flow-detailed.md#15-componentsrationaleboxrationaleboxtsx) |
| `sections/TheorySection/TheorySection.tsx` | Presentation | 12 | Dumb: render theory content | [📖](quiz-flow-detailed.md#18-sectionstheorysectiontheorysectiontsx) |
| `sections/QuizSection/QuizSection.tsx` | Presentation | 54 | Layout: QuizEngine + sidebar progress | [📖](quiz-flow-detailed.md#17-sectionsquizsectionquizsectiontsx) |
| `sections/PracticeHeaderSection/PracticeHeaderSection.tsx` | Presentation | 17 | Dumb: header with type label | [📖](quiz-flow-detailed.md#19-sectionspracticeheadersectionpracticeheadersectiontsx) |

---

## 2. Data Flow Chi Tiết

> Chi tiết từng file: [`page.tsx` entry](quiz-flow-detailed.md#1-entry-point-page-server-component) · [`useQuizQuestions`](quiz-flow-detailed.md#8-hooksusequizquestionsts--quản-lý-danh-sách-câu-hỏi) · [`useQuizAttempt`](quiz-flow-detailed.md#9-hooksusequizattemptts--state-machine-trả-lời) · [`useQuizImport`](quiz-flow-detailed.md#10-hooksusequizimportts--import-dialog) · [`useQuizEngine`](quiz-flow-detailed.md#11-hooksusequizenginets--orchestrator)

### 2a. Khởi tạo Quiz (Page Load)

```
PracticeTypePage (server component)
│
├─ readFileSync('data/questions.json') → lọc theo type
│
├─ <PracticeHeaderSection typeLabel contextDesc />         ← pure render
├─ <TheorySection type />                                  ← pure render
└─ <QuizSection type initialQuestions={...} />
       │
       ▼
   QuizSection (client component)
       │
       ├─ useState({ total, correct })
       │
       └─ <QuizEngine type initialQuestions onStatsUpdate />
              │
              ▼
          QuizEngine (smart component)
              │
              └─ useQuizEngine({ type, initialQuestions, onStatsUpdate })
                     │
                     ├──► useQuizQuestions({ type, initialQuestions })
                     │       │
                     │       ├─ initialQuestions có?
                     │       │   ├─ YES → dùng luôn, isLoading = false
                     │       │   └─ NO  → fetchQuestions({ type, difficulty })
                     │       │              └─ GET /api/questions/random?type=...
                     │       │
                     │       └─ returns { questions, currentQuestion, currentIdx,
                     │                    isLoading, isEmpty, isComplete,
                     │                    setQuestions, advanceQuestion, resetIdx }
                     │
                     ├──► useQuizAttempt({ currentQuestion, currentIdx, onStatsUpdate })
                     │       │
                     │       └─ returns { selectedOptionId, submitting, result,
                     │                    correctCount, handleSelect, clearAnswer }
                     │
                     ├──► useQuizImport({ type, onImportQuestions })
                     │       │
                     │       └─ returns { showImport, importJson, importError,
                     │                    promptText, openImport, submitImport,
                     │                    setImportJson, closeImport }
                     │
                     └─ returns { currentQuestion, selectedOptionId, submitting,
                                  result, correctCount, currentIdx, totalQuestions,
                                  isLoading, isComplete, isEmpty, showImport,
                                  importJson, importError, promptText,
                                  handleSelect, handleNext, handleOpenImport,
                                  handleSubmitImport, setImportJson, closeImport,
                                  reset }
```

**Tại sao QuizEngine gọi hook (smart) còn các component con không gọi hook (dumb)?**

QuizEngine là **duy nhất cần biết về orchestration**. Nếu QuestionCard tự gọi useQuizAttempt, nó sẽ:
- Phụ thuộc vào implementation của attempt hook
- Không thể tái sử dụng ở màn hình khác
- Phá vỡ luồng dữ liệu 1 chiều (parent → child props)

> Chi tiết: [`useQuizAttempt` state machine](quiz-flow-detailed.md#9-hooksusequizattemptts--state-machine-trả-lời) · [`quiz.api.ts` submitAttempt](quiz-flow-detailed.md#4-apiquizapits--network-layer) · [`OptionButton`](quiz-flow-detailed.md#14-componentsoptionbuttonoptionbuttontsx)

### 2b. User Chọn Đáp Án

```
User click OptionButton
       │
       ▼
OptionButton.onSelect(optId)
       │
       ▼
QuizEngine.handleSelect(optId)
       │
       ▼
useQuizEngine.handleSelect
       │
       └─► useQuizAttempt.handleSelect(optId)
              │
              ├─ guard: currentQuestion? phase === 'idle'?
              │
              ├─ dispatch({ type: 'SELECT', optionId })
              │   └─ reducer: phase = 'submitting', selectedOptionId = optionId
              │              → QuizEngine re-render (submitting=true, button disabled)
              │
              ├─ await submitAttempt(questionId, optionId)
              │   └─ POST /api/attempts { questionId, selectedOptionId }
              │       └─ Server: prisma.question.findUnique → prisma.attempt.create
              │       └─ Returns: { isCorrect, correctOptionId, rationale, attempt: { id } }
              │
              ├─ newCorrect = state.correctCount + (isCorrect ? 1 : 0)
              │
              ├─ dispatch({ type: 'SUBMIT_SUCCESS', result: { isCorrect, correctOptionId, rationale } })
              │   └─ reducer: phase = 'answered', result = {...}, correctCount += 1
              │              → QuizEngine re-render (result hiển thị đúng/sai)
              │
              └─ options.onStatsUpdate(currentIdx + 1, newCorrect)
                  └─ QuizSection.onStatsUpdate → setStats → ProgressChart + StatsSummary update
```

**Tại sao `correctCount` được tính ở cả reducer và callback?**

Reducer cập nhật `state.correctCount` cho lần render tiếp theo. Callback (`onStatsUpdate`) cần `newCorrect` **ngay lập tức** để parent cập nhật stats mà ko cần chờ re-render. Công thức `state.correctCount + (isCorrect ? 1 : 0)` luôn khớp với reducer vì cả 2 đều dùng `state.correctCount` từ cùng 1 render.

> Chi tiết: [`handleNext` trong orchestrator](quiz-flow-detailed.md#functions-tự-định-nghĩa) · [`advanceQuestion`](quiz-flow-detailed.md#flow-thực-thi-1)

### 2c. Click "Next Question"

```
User click RationaleBox.onNext
       │
       ▼
QuizEngine.handleNext
       │
       └─► useQuizEngine.handleNext
              │
              ├─ attemptHook.clearAnswer()
              │   └─ dispatch({ type: 'CLEAR' })
              │       └─ reducer: phase = 'idle', selectedOptionId = null, result = null
              │
              └─ questionsHook.advanceQuestion()
                  └─ setCurrentIdx(i => i + 1)
                      → QuizEngine re-render (câu hỏi mới hiển thị)
```

**Tại sao `handleNext` nằm ở orchestrator, không nằm ở attempt hook?**

Vì nó cần phối hợp 2 hooks khác nhau:
- `attemptHook.clearAnswer()` — reset attempt state
- `questionsHook.advanceQuestion()` — chuyển câu hỏi

Nếu `handleNext` nằm trong `useQuizAttempt`, attempt hook sẽ phải biết về questions hook → tạo dependency vòng. Orchestrator giải quyết vấn đề này bằng cách đứng giữa 2 hooks.

> Chi tiết: [`useQuizImport`](quiz-flow-detailed.md#10-hooksusequizimportts--import-dialog) · [`quiz.controller` pure functions](quiz-flow-detailed.md#5-controllersquizcontrollerts--pure-logic) · [`ImportDialog`](quiz-flow-detailed.md#16-componentsimportdialogimportdialogtsx)

### 2d. Import Dialog

```
User click "+ Tự nhập câu hỏi"
       │
       ▼
QuizEngine.handleOpenImport
       │
       └─► useQuizImport.openImport
              │
              ├─ generateTemplate(type) → set importJson (JSON mẫu để edit)
              ├─ generatePrompt(type) → set promptText (prompt cho AI)
              └─ setShowImport(true)
                  → QuizEngine re-render (ImportDialog hiển thị)

User paste JSON → textarea.onChange
       │
       └─► useQuizImport.setImportJson(value)

User click "Sử dụng câu hỏi này"
       │
       ▼
QuizEngine.handleSubmitImport
       │
       └─► useQuizImport.submitImport
              │
              ├─ parseImportedJSON(importJson, type)
              │   └─ quiz.controller.parseImportedJSON
              │       └─ JSON.parse → map → validate → return Question[]
              │
              ├─ onImportQuestions(parsed)
              │   └─ questionsHook.setQuestions(parsed)
              │   └─ questionsHook.resetIdx()
              │   └─ attemptHook.clearAnswer()
              │   └─ onStatsUpdate(0, 0)
              │
              └─ setShowImport(false)
```

**Tại sao `parseImportedJSON` nằm trong controller, không nằm trong hook?**

- `parseImportedJSON` là pure function: nhận string → parse → validate → return `Question[]`
- Nó không cần biết React, không cần biết state, không cần biết component
- Dễ test: `expect(parseImportedJSON(json, 'word-form')).toEqual([...])`
- Có thể reuse ở feature khác (admin import)

> Chi tiết: [`reset` trong orchestrator](quiz-flow-detailed.md#functions-tự-định-nghĩa)

### 2e. Reset Quiz

```
User click "Làm lại" (ở màn hình hoàn thành)
       │
       ▼
QuizEngine.reset
       │
       └─► orchestrator.reset
              │
              ├─ questionsHook.resetIdx()   → currentIdx = 0
              ├─ attemptHook.clearAnswer()  → phase = idle, result = null
              └─ onStatsUpdate(0, 0)        → reset stats ở parent
```

---

> Chi tiết: [`useQuizAttempt` reducer](quiz-flow-detailed.md#state-machine-usereducer)

## 3. State Machine (useReducer)

`useQuizAttempt` dùng `useReducer` thay vì `useState` vì attempt flow có **phase transitions rõ ràng**.

### State

```typescript
type AttemptState = {
  phase: 'idle' | 'submitting' | 'answered'
  selectedOptionId: string | null
  result: AttemptResult | null
  correctCount: number
}
```

### Transitions

```
         SELECT                  SUBMIT_SUCCESS
  ┌──────────┐  ┌────────────────────┐
  ▼          │  │                    ▼
idle ───→ submitting ──────────→ answered
  ▲          │                      │
  │          │  SUBMIT_ERROR        │
  │          └──────────────────────┘
  │                                 │
  └─────────── CLEAR ───────────────┘
```

### Impossible states bị loại

| Tổ hợp state | Có thể xảy ra? |
|---|---|
| `phase: 'idle'` + `result !== null` | ❌ Reducer ko cho phép |
| `phase: 'submitting'` + `selectedOptionId: null` | ❌ Action `SELECT` luôn set `optionId` |
| `phase: 'answered'` + `result: null` | ❌ Action `SUBMIT_SUCCESS` luôn set `result` |
| `phase: 'submitting'` + `result !== null` | ❌ Chỉ `SUBMIT_SUCCESS` mới set result |

### Tại sao không dùng useReducer cho useQuizQuestions?

State của questions:
- `questions[]`, `currentIdx`, `isLoading`
- Quan hệ giữa chúng yếu: `FETCH_SUCCESS` vừa set questions vừa set isLoading
- Không có "phase machine" rõ ràng như attempt flow
- `useState` đơn giản hơn đọc, đủ cho 3 biến ít phụ thuộc

---

> Chi tiết từng component: [`QuizEngine`](quiz-flow-detailed.md#12-componentsquizenginequizenginetsx--smart-component) · [`QuestionCard`](quiz-flow-detailed.md#13-componentsquestioncardquestioncardtsx) · [`OptionButton`](quiz-flow-detailed.md#14-componentsoptionbuttonoptionbuttontsx) · [`RationaleBox`](quiz-flow-detailed.md#15-componentsrationaleboxrationaleboxtsx) · [`ImportDialog`](quiz-flow-detailed.md#16-componentsimportdialogimportdialogtsx)

## 4. Component Tree & Data Flow

```
PracticeTypePage (server)
  props: params.type
  │
  ├─ PracticeHeaderSection
  │   props: typeLabel, contextDesc
  │   → render: badge + h1 + p
  │
  ├─ TheorySection
  │   props: type
  │   → getTheoryContent(type) → render: section + table
  │
  └─ QuizSection (client)
      state: { total, correct }
      │
      └─ QuizEngine (client)
          hook: useQuizEngine({ type, initialQuestions, onStatsUpdate })
          │
          ├─ QuestionCard
          │   props: question, selectedOptionId, correctOptionId, onSelect
          │   │
          │   └─ OptionButton × 4
          │       props: text, label, status, onSelect
          │       → render: button với status style (idle/selected/correct/wrong/disabled)
          │
          ├─ RationaleBox (conditional: result !== null)
          │   props: isCorrect, rationale, onNext, hasNext
          │   → render: correct/incorrect box + explanation + next button
          │
          └─ ImportDialog (conditional: showImport)
              props: type, importJson, importError, onImportJsonChange,
                     onSubmitImport, onClose
              → render: modal với prompt + textarea + buttons
```

**Luồng props là 1 chiều (top-down):**
```
QuizEngine (stateful) ──props──► QuestionCard (stateless)
                                    ──props──► OptionButton (stateless)
QuizEngine (stateful) ──props──► RationaleBox (stateless)
QuizEngine (stateful) ──props──► ImportDialog (stateless)
```

**Luồng events là ngược lại (bottom-up):**
```
OptionButton.onClick ──callback──► QuestionCard.onSelect
    ──callback──► QuizEngine.handleSelect
    ──callback──► useQuizAttempt.handleSelect
    ──gọi API──► quiz.api.submitAttempt
```

---

## 5. Dependency Graph

```
QuizEngine.tsx
  ├── useQuizEngine.ts
  │   ├── useQuizQuestions.ts
  │   │   ├── types.ts
  │   │   └── api/quiz.api.ts
  │   │       └── types.ts
  │   ├── useQuizAttempt.ts
  │   │   ├── types.ts
  │   │   └── api/quiz.api.ts
  │   │       └── types.ts
  │   └── useQuizImport.ts
  │       ├── types.ts
  │       └── controllers/quiz.controller.ts
  │           ├── types.ts
  │           └── constants.ts
  ├── QuestionCard.tsx
  │   ├── OptionButton.tsx
  │   ├── constants.ts
  │   └── controllers/question.controller.ts
  │       └── types.ts
  ├── RationaleBox.tsx
  └── ImportDialog.tsx
      └── controllers/quiz.controller.ts
          ├── types.ts
          └── constants.ts
```

**Nguyên tắc dependency:**
- Component chỉ import: hook, dumb component, constants, controller
- Hook chỉ import: API, controller, types
- Controller chỉ import: types, constants (ko React, ko API)
- API chỉ import: types

---

## 6. File Organization Rationale

### `types.ts` — Định nghĩa hợp đồng dữ liệu

Tập trung tất cả interfaces vào 1 file để:
- Dễ review: mở 1 file là thấy toàn bộ data shape
- Tránh circular import: các file khác import từ đây mà ko sợ vòng
- Dễ tái cấu trúc: thay đổi type chỉ sửa 1 chỗ

### `controllers/` — Logic thuần tách khỏi React

Controller là pure function, ko biết React. Tại sao?
- **Test unit**: ko cần `renderHook`, ko cần mock — chỉ gọi function
- **Reuse**: `parseImportedJSON` có thể dùng ở admin feature
- **Reasoning**: function có cùng input → luôn cùng output, ko side effect

### `hooks/` — Kết nối controller + API + React state

Mỗi hook quản lý 1 nhóm state duy nhất. Tại sao tách nhiều hook?
- **Single Responsibility**: mỗi hook dễ đọc, dễ sửa
- **Testable**: test `useQuizAttempt` ko cần biết về `useQuizImport`
- **Composable**: orchestrator (`useQuizEngine`) là nơi duy nhất biết cách phối hợp

### `components/` — Render thuần

Component dumb (QuestionCard, OptionButton, RationaleBox, ImportDialog):
- **Ko gọi hook** → ko phụ thuộc vào implementation
- **Nhận props** → có thể reuse ở context khác
- **Dễ test snapshot** → ko cần mock hook

Component smart (QuizEngine):
- **Duy nhất gọi hook** → 1 điểm entry cho orchestration
- **Render các dumb component** → pass props xuống

### Tại sao không gộp QuizEngine + useQuizEngine?

QuizEngine chứa JSX chiếm 160 dòng, useQuizEngine chứa orchestration logic 95 dòng. Nếu gộp:
- File 250 dòng thay vì 2 file nhỏ
- JSX lẫn lộn với logic wire callback
- Ko thể test orchestration riêng

---

## 7. Entry Point (Page)

```typescript
// src/app/(main)/practice/[type]/page.tsx

export default async function PracticeTypePage({ params }) {
  const { type } = await params       // server component → đọc params
  const typeLabel = TYPE_LABEL_MAP[type]
  const contextDesc = TYPE_CONTEXT[type]
  const initialQuestions = loadQuestions(type)  // server-side: readFileSync

  return (
    <>
      <PracticeHeaderSection typeLabel contextDesc />    ← pure UI
      <TheorySection type />                             ← pure UI
      <QuizSection type initialQuestions />              ← client component
    </>
  )
}
```

**Tại sao page load questions ở server?**

`loadQuestions()` dùng `fs.readFileSync` — chỉ chạy được ở server component. Kết quả được truyền xuống client component (`QuizSection`) qua props. Client ko cần gọi API lần nào nếu đã có data từ server.

Nếu ko có `initialQuestions` (VD: truy cập từ link ko có data file), `useQuizQuestions` sẽ tự động fetch từ `/api/questions/random` ở client.

---

## 8. Tài liệu tham khảo

| File | Mô tả |
|---|---|
| [quiz-flow-detailed.md](quiz-flow-detailed.md) | Giải thích chi tiết từng file: input/output, flow thực thi, data transform, mapping controller → hook → component |

