# Feature Structure Architecture

Reference implementation: `src/features/quiz/`

## Directory Layout

```
features/<feature>/
├── types.ts                        # Interfaces / Types
├── constants.ts                    # Constants, label maps
├── client/
│   └── <feature>.client.ts         # fetch/axios calls (ko state, ko logic)
├── utils/
│   ├── <feature>.utils.ts          # Pure functions, ko biết React, dễ test
│   └── ...
├── hooks/
│   ├── use<Resource>.ts            # Data hook (1 responsibility)
│   ├── use<Resource>.ts            # Data hook (1 responsibility)
│   └── use<Feature>Engine.ts       # Orchestrator: compose các data hooks
└── components/
    ├── SmartComponent/             # Gọi orchestrator hook, render dumb components
    │   ├── SmartComponent.tsx
    │   └── index.ts
    ├── DumbComponent/              # Render thuần, nhận props
    │   ├── DumbComponent.tsx
    │   └── index.ts
    └── sections/                   # Page-level layout components
        ├── ExampleSection/
        └── ...
```

## Layer Responsibilities

### 1. `types.ts` + `constants.ts` — Definition Layer
- TypeScript interfaces
- Constants, enums, label maps
- Không import gì từ React

### 2. `client/<feature>.client.ts` — Network Layer
- Chỉ gọi `fetch()` hoặc `axios`
- Nhận params, trả về typed Promise
- **KO** có React state, **KO** có logic xử lý

```typescript
// quiz.client.ts
export async function fetchQuestions(params) {
  const res = await fetch(`/api/questions/random?${params}`)
  return res.json()
}

export async function submitAttempt(questionId, selectedOptionId) {
  const res = await fetch('/api/attempts', { method: 'POST', body: ... })
  return res.json()
}
```

### 3. `utils/*.ts` — Pure Logic Layer
- Pure functions: cùng input → luôn cùng output
- **KHÔNG** import React, **KHÔNG** gọi API
- Dễ unit test (ko cần mock React)

```typescript
// quiz.utils.ts
export function parseImportedJSON(raw: string, type: string): Question[]
export function generatePrompt(type: string): string
export function generateTemplate(type: string): string

// question.utils.ts
export function getOptionStatus(optId, selectedId, correctId): OptionStatus
```

### 4. `hooks/*.ts` — Orchestration Layer

#### Data Hooks (1 responsibility / hook)
Mỗi hook quản lý **1 nhóm state duy nhất**:

```typescript
// useQuizQuestions.ts — chỉ load questions + index
export function useQuizQuestions(options) {
  // State: questions[], currentIdx, isLoading
  // Actions: setQuestions, advanceQuestion, resetIdx
  return { questions, currentQuestion, currentIdx, isLoading, ... }
}

// useQuizAttempt.ts — chỉ submit + result
export function useQuizAttempt(options) {
  // State: selectedOptionId, result, correctCount, submitting
  // Actions: handleSelect (gọi API), clearAnswer
  return { selectedOptionId, submitting, result, ... }
}

// useQuizImport.ts — chỉ import dialog
export function useQuizImport(options) {
  // State: showImport, importJson, importError
  // Actions: openImport, submitImport, closeImport
  return { showImport, importJson, ... }
}
```

#### Orchestrator Hook
Compose các data hooks, wire callbacks giữa chúng:

```typescript
// useQuizEngine.ts
export function useQuizEngine(options) {
  const questions = useQuizQuestions(options)
  const attempt = useQuizAttempt({
    currentQuestion: questions.currentQuestion,
    currentIdx: questions.currentIdx,
    onStatsUpdate: options.onStatsUpdate,
  })
  const importDialog = useQuizImport({
    type: options.type,
    onImportQuestions: (q) => {
      questions.setQuestions(q)
      attempt.clearAnswer()
    },
  })

  // Wire cross-hook actions
  const handleNext = useCallback(() => {
    attempt.clearAnswer()
    questions.advanceQuestion()
  }, [...])
  
  // Return flattened state + actions
  return { ...questions, ...attempt, ...importDialog, handleNext, reset }
}
```

### 5. `components/*` — Presentation Layer

#### Smart Component
Gọi orchestrator hook, render dumb components:

```typescript
// QuizEngine/QuizEngine.tsx
export function QuizEngine(props) {
  const { currentQuestion, selectedOptionId, result, ... } = useQuizEngine(props)
  
  if (isLoading) return <Loading />
  if (isEmpty) return <EmptyState ... />
  if (isComplete) return <CompleteState ... />
  
  return (
    <>
      <QuestionCard question={currentQuestion} ... />
      <RationaleBox result={result} ... />
      <ImportDialog ... />
    </>
  )
}
```

#### Dumb Component
Chỉ render JSX từ props, ko có state, ko gọi hook:

```typescript
// OptionButton/OptionButton.tsx
export function OptionButton({ text, label, status, onSelect }) {
  return <button className={STATUS_STYLES[status]} onClick={onSelect}>{label} {text}</button>
}

// ImportDialog/ImportDialog.tsx
export function ImportDialog({ type, importJson, onSubmitImport, ... }) {
  // Pure render, logic từ controller
  return <div>...</div>
}
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        PAGE (page.tsx)                          │
│  <QuizSection type={type} initialQuestions={questions} />       │
└─────────────────────────┬────────────────────────────────────────┘
                          │ props
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    QuizSection (layout)                          │
│  onStatsUpdate → setStats → <ProgressChart />                    │
│  <QuizEngine type initialQuestions onStatsUpdate />              │
└─────────────────────────┬────────────────────────────────────────┘
                          │ props
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    QuizEngine (smart)                             │
│  useQuizEngine({ type, initialQuestions, onStatsUpdate })        │
│  → { questions, attempt, import, handleNext, ... }               │
└──┬──────────┬──────────────┬──────────────────────────────────────┘
   │          │              │
   ▼          ▼              ▼
┌────────┐ ┌──────────┐ ┌──────────────┐
│Question│ │Rationale │ │ImportDialog  │
│Card    │ │Box       │ │(dumb)        │
│(dumb)  │ │(dumb)    │ │              │
└────────┘ └──────────┘ └──────────────┘

Flow chi tiết khi user chọn đáp án:
1. OptionButton onClick → handleSelect(optionId)
2. useQuizAttempt.handleSelect → gọi submitAttempt() (API)
3. API POST /api/attempts → trả về { isCorrect, correctOptionId, rationale }
4. useQuizAttempt cập nhật result, correctCount
5. useQuizAttempt gọi onStatsUpdate → QuizSection cập nhật stats
6. Result render → QuestionCard hiển thị đúng/sai + RationaleBox hiển thị giải thích
7. User click "Next Question" → handleNext (clear answer + advance question)
```

## Rules

| Rule | Bắt buộc |
|---|---|
| Controller KO import React | ✅ |
| Controller KO gọi API | ✅ |
| Data hook chỉ 1 nhóm state | ✅ |
| Orchestrator ko có state riêng | ✅ |
| Dumb component ko gọi hook | ✅ |
| Component folder + barrel export index.ts | ✅ |
