# Saved Question Sets — Import & Select Multiple Question Sets

## Mục đích

Cho phép user import nhiều bộ đề JSON riêng biệt, lưu lại qua các lần truy cập, và có thể chuyển đổi giữa các bộ đề (default server seed vs custom import).

---

## Vấn đề hiện tại

```
Import JSON → setQueryData ghi đè cache React Query
Back        → component unmount → cache mất (nếu cleanup)
Refresh     → cache trong memory mất hoàn toàn
Quay lại    → chỉ thấy seed questions ban đầu
```

**Không lưu được danh sách bộ đề đã import, không chọn lại được.**

---

## Kiến trúc giải pháp

### Tổ chức thư mục theo domain (thay vì tính năng)

```
src/features/quiz/
├── sources/                          # Quản lý mọi nguồn câu hỏi
│   ├── storage.client.ts             ← localStorage CRUD
│   ├── useSavedQuestionSets.ts       ← hook quản lý bộ đề đã lưu
│   └── useQuestionSource.ts          ← ⭐ chọn nguồn: server / savedSet
│
├── engine/                           # Logic làm bài quiz
│   ├── useQuizEngine.ts
│   ├── useQuizAttempt.ts
│   └── useQuizQuestions.ts
│
├── import/                           # Nhập bộ đề
│   ├── useQuizImport.ts
│   └── ImportNameModal.tsx
│
└── components/                       # UI
    ├── SavedSetSelector.tsx
    └── ManageSetsModal.tsx
```

**Nguyên tắc:**
- `sources/` — chỉ lo cung cấp questions từ đâu, không biết quiz
- `engine/` — chỉ xử lý logic làm bài, không biết nguồn questions
- `import/` — chỉ nhập/xử lý JSON, không biết UI khác
- `components/` — chỉ UI, gọi hook, không chứa logic

---

### Luồng dữ liệu mới

```
useQuestionSource()
  ├─ savedSets (từ localStorage)
  ├─ activeSetId (user chọn)
  │
  ├─ activeSetId === null
  │   └─ useQuizQuestions() ← questions từ server/seed
  │
  └─ activeSetId !== null
      └─ savedSets[activeSetId].questions ← questions từ import
            │
            ▼
        questions: Question[]   ← đầu ra duy nhất
            │
            ▼
        useQuizEngine() ← không biết questions đến từ đâu
            │
            ▼
        Quiz UI
```

**`useQuizQuestions` không biết gì về savedSets** — nó chỉ nhận `questions` từ `useQuestionSource`.

---

### Data model

```ts
// SavedSet — lưu trong localStorage
interface SavedSet {
  id: string
  name: string
  createdAt: string
  type: string
  source: 'import'   // ← để mở rộng sau này: 'ai' | 'cloud' | 'download'
  questionCount: number
  questions: Question[]
}
```

---

## Các stage thực hiện

### Stage 1 — Storage layer

**File:** `src/features/quiz/sources/storage.client.ts`

**Mục đích:** Abstraction cho localStorage. Sau này đổi thành IndexedDB/API thì các hook không cần sửa.

```ts
export interface SavedSet {
  id: string
  name: string
  createdAt: string
  type: string
  source: 'import'
  questions: Question[]
}

const STORAGE_KEY = 'quiz:imported-sets'

export function loadSavedSets(): SavedSet[]
export function saveSavedSets(sets: SavedSet[]): void
export function generateId(): string
```

**Chi tiết:**
- `loadSavedSets()` — đọc từ localStorage, parse JSON, fallback `[]` nếu lỗi/corrupt
- `saveSavedSets()` — ghi vào localStorage
- `generateId()` — tạo uuid dùng `crypto.randomUUID()` (có sẵn trong browser)
- `SavedSet.source` mặc định là `'import'` — sau này có thể mở rộng

---

### Stage 2 — Hook quản lý bộ đề đã lưu

**File:** `src/features/quiz/sources/useSavedQuestionSets.ts`

**Mục đích:** CRUD danh sách bộ đề + quản lý activeSetId (UI state, không lưu localStorage).

```ts
export function useSavedQuestionSets() {
  // Load từ localStorage khi mount
  const [savedSets, setSavedSets] = useState<SavedSet[]>(() => loadSavedSets())
  // Đồng bộ xuống localStorage
  useEffect(() => { saveSavedSets(savedSets) }, [savedSets])

  // activeSetId là UI state — mất khi refresh
  const [activeSetId, setActiveSetId] = useState<string | null>(null)

  const addSet = (name, questions, type): string    // trả về id
  const deleteSet = (id: string): void
  const renameSet = (id: string, newName: string): void
  const duplicateSet = (id: string): string          // ⭐ copy bộ đề

  const activeSet = savedSets.find(s => s.id === activeSetId) ?? null

  return { savedSets, activeSetId, activeSet,
           setActiveSetId, addSet, deleteSet, renameSet, duplicateSet }
}
```

**Lưu ý quan trọng:**
- `savedSets` — persist, lưu trong localStorage
- `activeSetId` — UI state, không persist (mặc định null khi refresh)

---

### Stage 3 — ⭐ Question Source (abstraction layer mới)

**File:** `src/features/quiz/sources/useQuestionSource.ts`

**Mục đích:** Nhận `savedSets` + `activeSetId`, quyết định lấy questions từ đâu, trả về cùng interface.

```ts
export function useQuestionSource(options: {
  type?: string
  difficulty?: string
  initialQuestions?: Question[]
  savedSets: SavedSet[]
  activeSetId: string | null
}) {
  // Nếu đang chọn bộ đề import → lấy từ savedSets
  const activeSet = options.activeSetId
    ? options.savedSets.find(s => s.id === options.activeSetId)
    : null

  // Nếu không chọn import → gọi server / seed
  const { data, isLoading } = useQuery({
    queryKey: ['questions', options.type, options.difficulty],
    queryFn: () => fetchQuestions({ type: options.type, difficulty: options.difficulty }),
    enabled: !options.initialQuestions && !options.activeSetId,  // ← không fetch nếu đang xem import
    initialData: options.initialQuestions
      ? { questions: options.initialQuestions, total: options.initialQuestions.length }
      : undefined,
  })

  // ⭐ Quyết định questions từ đâu
  const questions = activeSet
    ? activeSet.questions               // 1. Ưu tiên import set
    : data?.questions ?? []              // 2. Server / seed

  return {
    questions,
    isLoading: activeSet ? false : isLoading,
  }
}
```

**Tại sao tách riêng?**

| Nếu gộp vào `useQuizQuestions` | Nếu tách `useQuestionSource` |
|-------------------------------|------------------------------|
| `useQuizQuestions` biết savedSets | `useQuizQuestions` chỉ nhận `questions` |
| Khi thêm nguồn AI → sửa `useQuizQuestions` | Khi thêm nguồn AI → sửa `useQuestionSource` |
| `useQuizQuestions` phải quản lý priority | `useQuestionSource` quản lý priority |
| Engine biết quá nhiều về data source | Engine không biết data source |

**Sau Stage 3, `useQuizQuestions` không đổi** — nó vẫn nhận `questions` như cũ, không biết gì về savedSets.

---

### Stage 4 — Sửa `useQuizEngine`

**File:** `src/features/quiz/engine/useQuizEngine.ts`

**Mục đích:** Tích hợp `useQuestionSource` + `useSavedQuestionSets` + `useQuizAttempt` + `useQuizImport`.

```ts
export function useQuizEngine(options) {
  const savedSetsHook = useSavedQuestionSets()

  // ⭐ Thay vì useQuizQuestions trực tiếp, qua useQuestionSource
  const sourceHook = useQuestionSource({
    type: options.type,
    difficulty: options.difficulty,
    initialQuestions: options.initialQuestions,
    savedSets: savedSetsHook.savedSets,
    activeSetId: savedSetsHook.activeSetId,
  })

  const questionsHook = useQuizQuestions({
    questions: sourceHook.questions,       // ← chỉ nhận questions, không biết nguồn
  })

  const attemptHook = useQuizAttempt({
    currentQuestion: questionsHook.currentQuestion,
    currentIdx: questionsHook.currentIdx,
    onStatsUpdate: options.onStatsUpdate,
  })

  // Import → lưu vào savedSets thay vì cache
  const importHook = useQuizImport({
    type: options.type,
    onImportQuestions: (questions) => {
      const setId = savedSetsHook.addSet(
        `Bộ đề ${options.type} - ${new Date().toLocaleDateString()}`,
        questions,
        options.type ?? 'unknown',
      )
      savedSetsHook.setActiveSetId(setId)
      questionsHook.resetIdx()
      attemptHook.clearAnswer()
      options.onStatsUpdate?.(0, 0)
    },
  })

  return {
    questions: sourceHook.questions,
    currentQuestion: questionsHook.currentQuestion,
    currentIdx: questionsHook.currentIdx,
    totalQuestions: questionsHook.totalQuestions,
    isLoading: sourceHook.isLoading,             // ← từ source
    isEmpty: questionsHook.isEmpty,
    isComplete: questionsHook.isComplete,
    // Quiz attempt
    selectedOptionId: attemptHook.selectedOptionId,
    submitting: attemptHook.submitting,
    result: attemptHook.result,
    correctCount: attemptHook.correctCount,
    handleSelect: attemptHook.handleSelect,
    handleNext,
    // Import
    showImport: importHook.showImport,
    openImport: importHook.openImport,
    submitImport: importHook.submitImport,
    closeImport: importHook.closeImport,
    importJson: importHook.importJson,
    setImportJson: importHook.setImportJson,
    importError: importHook.importError,
    promptText: importHook.promptText,
    // Saved sets
    savedSets: savedSetsHook.savedSets,
    activeSetId: savedSetsHook.activeSetId,
    setActiveSetId: savedSetsHook.setActiveSetId,
    deleteSet: savedSetsHook.deleteSet,
    renameSet: savedSetsHook.renameSet,
    duplicateSet: savedSetsHook.duplicateSet,    // ⭐ tính năng copy
    // Reset
    reset,
  }
}
```

**Thay đổi so với thiết kế cũ:**
- `useQuizQuestions` **không còn** biết `savedSets` / `activeSetId`
- `useQuestionSource` là tầng trung gian quyết định nguồn questions
- `onImportQuestions` lưu vào `savedSetsHook.addSet()` thay vì `setQueryData`

---

### Stage 5 — UI: Saved Set Selector

**File:** `src/features/quiz/components/SavedSetSelector.tsx`

**Mục đích:** Dropdown chọn bộ đề.

```tsx
interface SavedSetSelectorProps {
  savedSets: SavedSet[]
  activeSetId: string | null
  onSelect: (id: string | null) => void
  onOpenManage: () => void
}
```

**UI:**
```
┌──────────────────────────────────────┐
│  📚 Bộ đề: [Default (server)    ▼] │
│           ├─ Default (server)         │
│           ├─ 📄 Part 5 #1 (12 câu)    │
│           ├─ 📄 Verb tense (8 câu)    │
│           └─── Quản lý bộ đề...       │
└──────────────────────────────────────┘
```

**Vị trí:** Đặt trên cùng màn hình quiz, bên cạnh nút Import.

---

### Stage 6 — UI: Manage Sets Modal

**File:** `src/features/quiz/components/ManageSetsModal.tsx`

**Mục đích:** Xem, đổi tên, duplicate, xoá bộ đề.

```
┌─── Quản lý bộ đề ─────────────────────────┐
│                                            │
│  📄 Part 5 #1 (12 câu)  [✏️] [📋] [🗑️]  │
│  📄 Verb tense (8 câu)  [✏️] [📋] [🗑️]  │
│                                            │
│  [Đóng]                                    │
└────────────────────────────────────────────┘
```

**Tính năng:**
- `[✏️]` — rename (inline edit)
- `[📋]` — duplicate (copy questions + tên mới: "Part 5 #1 (copy)")
- `[🗑️]` — delete (confirm trước khi xoá)

---

### Stage 7 — UI: Import Name Modal

**File:** `src/features/quiz/import/ImportNameModal.tsx`

**Mục đích:** Khi import JSON, hiện modal đặt tên + chọn type thay vì `prompt()`.

```
┌─── Lưu bộ đề mới ─────────────────┐
│                                     │
│  Tên: [Part 5 - Collocation    ]   │
│  Loại: [word-form           ▼]    │
│                                     │
│  Số câu: 15                         │
│                                     │
│       [Lưu] [Huỷ]                   │
└─────────────────────────────────────┘
```

---

## Flow tổng thể

```
User vào Quiz
  │
  ├─ useSavedQuestionSets()
  │   └─ load savedSets từ localStorage
  │   └─ activeSetId = null
  │
  ├─ useQuestionSource({ savedSets, activeSetId: null })
  │   └─ enabled = true → fetch server / seed
  │   └─ questions = data?.questions ?? []
  │
  ├─ useQuizQuestions({ questions })
  │   └─ currentIdx, advanceQuestion, ...
  │
  └─ UI hiển thị default questions
```

```
User chọn "Part 5 #1" từ dropdown
  │
  ├─ setActiveSetId('uuid-1')
  │
  ├─ useQuestionSource re-render
  │   └─ activeSet = savedSets['uuid-1']
  │   └─ questions = activeSet.questions
  │   └─ isLoading = false (không fetch)
  │
  └─ UI hiển thị questions từ import
```

```
User import JSON mới
  │
  ├─ ImportNameModal: user đặt tên + chọn type
  │
  ├─ addSet(name, parsedQuestions, type)
  │   └─ lưu vào localStorage
  │   └─ setActiveSetId(newId)
  │
  ├─ useQuestionSource re-render
  │   └─ questions = vừa import
  │
  └─ UI hiển thị questions mới
```

```
User refresh trang
  │
  ├─ useSavedQuestionSets()
  │   └─ savedSets = load từ localStorage (còn)
  │   └─ activeSetId = null (mất do refresh)
  │
  ├─ useQuestionSource
  │   └─ activeSetId = null → fetch server
  │   └─ hiển thị default questions
  │
  └─ User mở dropdown → chọn lại bộ đề cũ
```

---

## Tổng kết files

| Stage | File | Hành động |
|-------|------|-----------|
| 1 | `src/features/quiz/sources/storage.client.ts` | **Tạo mới** |
| 2 | `src/features/quiz/sources/useSavedQuestionSets.ts` | **Tạo mới** |
| 3 | `src/features/quiz/sources/useQuestionSource.ts` | **Tạo mới** ⭐ |
| 4 | `src/features/quiz/engine/useQuizEngine.ts` | **Sửa** — tích hợp source |
| 4 | `src/features/quiz/engine/useQuizQuestions.ts` | **Sửa** — nhận `questions` prop, không biết nguồn |
| 5 | `src/features/quiz/components/SavedSetSelector.tsx` | **Tạo mới** |
| 6 | `src/features/quiz/components/ManageSetsModal.tsx` | **Tạo mới** |
| 7 | `src/features/quiz/import/ImportNameModal.tsx` | **Tạo mới** |
