# Mixed Practice v2 — Implementation Plan

> Dựa trên: `docs/mixed-practice-v2-plan.md`
> Tổng effort: ~7-10 ngày (theo plan gốc), chia làm **8 Phase**

---

## Phase 1: Nền tảng — Types + Hooks + DB

### Mục tiêu
Xây dựng layer dữ liệu nền tảng trước: types, IndexedDB utility, useTempSession hook.

### Tasks

#### 1.1. Tạo `src/features/temp-session/types.ts`
- Copy/Paste các interfaces từ plan:
  - `PracticeSession`, `SessionConfig`, `KnowledgeGroupConfig`, `SessionQuestion`, `SessionAttempt`
- Export tất cả

#### 1.2. Tạo `src/features/session-builder/types.ts`
- `SessionBuilderStep` enum: `scope → config → source → preview → practice`
- `PresetType`: `'quick' | 'balanced' | 'smart' | 'exam' | 'custom'`
- `ScopeConfig`: `{ parts: number[] }`
- `SessionBuilderState`: lưu toàn bộ state của wizard

#### 1.3. Tạo `src/lib/idb.ts` — IndexedDB wrapper
- Dùng `idb` library (kiểm tra package.json trước, nếu chưa có thì dùng vanilla IndexedDB)
- Mở database: `mixed-practice-db`, version 1
- Object store: `sessions` (keyPath: `id`)
- Index: `userId`, `expiresAt`
- CRUD operations:
  - `openDb()`: mở kết nối, tạo store/index nếu chưa có
  - `saveSession(session)`: put vào store
  - `loadSession(id)`: get theo key
  - `deleteSession(id)`: delete theo key
  - `getAllSessions(userId)`: getAll từ index `userId`
  - `clearExpiredSessions()`: dùng index `expiresAt` để xoá expired sessions
- TTL check ở application layer (useTempSession), không phải DB layer

#### 1.4. Tạo `useTempSession` hook
**File**: `src/features/temp-session/hooks/useTempSession.ts`

- Dùng `useEffect` + state để async load/save từ IndexedDB
- TTL_HOURS: 24 (configurable)
- Methods:
  - `save(session)`: gọi `saveSession()` từ idb wrapper
  - `load()`: gọi `loadSession()`, kiểm tra TTL, trả về null nếu expired
  - `clear()`: gọi `deleteSession()`
  - `updateAttempt(attempt)`: load → append attempt → save
  - `updateIndex(index)`: load → update currentIndex → save
  - `getAll()`: gọi `getAllSessions()`
- Wrap trong custom hook để quản lý loading state (IndexedDB là async API)

#### 1.5. Tạo `src/features/temp-session/index.ts`
- Re-export từ barrel

### Kiểm tra
- `npm run lint` không lỗi
- `npm run typecheck` không lỗi

---

## Phase 2: Session Builder Wizard — Step1 + Step2

### Mục tiêu
Xây dựng wizard container, Step 1 (Scope - chọn Part) và Step 2 (Config - chọn Preset + Knowledge Groups).

### Tasks

#### 2.1. Tạo `useSessionBuilder` hook
**File**: `src/features/session-builder/hooks/useSessionBuilder.ts`

- State machine dùng `useReducer`:
  ```ts
  type State = {
    step: SessionBuilderStep
    scope: ScopeConfig // parts selected
    preset: PresetType
    config: SessionConfig  // knowledgeGroups, difficulty, totalQuestions
    source: 'system' | 'imported'
    importJson: string | null
    validationErrors: string[]
  }
  ```
- Actions:
  - `SET_SCOPE`, `SET_PRESET`, `SET_CONFIG`
  - `SET_SOURCE`, `SET_IMPORT_JSON`
  - `NEXT_STEP`, `PREV_STEP`

#### 2.2. Tạo `Step1Scope` component
**File**: `src/features/session-builder/components/Step1Scope.tsx`

- UI: Checkbox grid cho Parts 5, 6, 7 (Reading) + Parts 1, 2, 3, 4 (Listening - disabled cho MVP)
- Mặc định: Part 5, 6, 7
- Props: `scope, onScopeChange, onNext`
- Validation: phải chọn ít nhất 1 part
- Next → chuyển Step 2

#### 2.3. Tạo `Step2Config` component
**File**: `src/features/session-builder/components/Step2Config.tsx`

- Hiển thị 5 preset cards: Quick, Balanced, Smart, Exam, Build My Own
- Khi chọn preset ≠ custom → tự động fill config (dùng `getPresetConfig(parts, preset)`)
- Khi chọn "Build My Own" → mở form chi tiết:
  - Chọn Knowledge Group + count cho mỗi Part (dùng `getKnowledgeGroupsForPart(part)`)
  - Chọn Difficulty
  - Hiển thị tổng số câu
- Props: `preset, config, onPresetChange, onConfigChange, onBack, onNext`
- Back → Step 1, Next → Step 3

#### 2.4. Tạo `StepNavigation` component
**File**: `src/features/session-builder/components/StepNavigation.tsx`

- Props: `currentStep, totalSteps, onBack, onNext, canGoBack, canGoNext`
- Hiển thị: `[Back] [Next]`
- Dots indicator showing current step

#### 2.5. Tạo utility: `getKnowledgeGroupsForPart()`
**File**: `src/features/session-builder/utils/knowledge-groups.ts`

```ts
const KNOWLEDGE_GROUPS: Record<number, { type: string; label: string }[]> = {
  5: [
    { type: 'word-form', label: 'Word Form' },
    { type: 'comparison', label: 'Comparison' },
    { type: 'vocabulary', label: 'Vocabulary' },
    { type: 'verb-tense', label: 'Verb Tense' },
    { type: 'preposition', label: 'Preposition' },
    { type: 'conjunction', label: 'Conjunction' },
    { type: 'participle', label: 'Participle' },
    { type: 'voice', label: 'Voice' },
    { type: 'relative-clause', label: 'Relative Clause' },
    { type: 'agreement', label: 'Agreement' },
  ],
  6: [
    { type: 'sentence-insertion', label: 'Sentence Insertion' },
    { type: 'grammar', label: 'Grammar' },
    { type: 'vocabulary', label: 'Vocabulary' },
  ],
  7: [
    { type: 'single-passage', label: 'Single Passage' },
    { type: 'double-passage', label: 'Double Passage' },
    { type: 'triple-passage', label: 'Triple Passage' },
  ],
}
```

#### 2.6. Tạo utility: `getPresetConfig()`
**File**: `src/features/session-builder/utils/presets.ts`

```ts
getPresetConfig(parts: number[], preset: PresetType): Partial<SessionConfig>
```

- `quick`: 20 câu, Medium, focus Part 5
- `balanced`: chia đều các Part
- `smart`: cần analytics (placeholder, fill default)
- `exam`: đúng tỉ lệ ETS

### Kiểm tra
- Render wizard với mock data
- Chuyển step được
- Preset auto-fill đúng

---

## Phase 3: Session Builder Wizard — Step3Source (Import JSON)

### Mục tiêu
Xử lý nguồn câu hỏi: System Bank (chỉ UI) và Practice Now (Import JSON).

### Tasks

#### 3.1. Tạo `Step3Source` component
**File**: `src/features/session-builder/components/Step3Source.tsx`

- Radio group: System Bank / Practice Now / My Library (disabled)
- System Bank: text "Sử dụng ngân hàng câu hỏi của hệ thống"
- Practice Now: textarea + format mẫu (dùng `generateTemplate` từ quiz.utils.ts)
- Nút "Validate & Preview"
- Validation:
  - Parse JSON → gọi `parseImportedJSON`
  - Check schema: mỗi question phải có `part`, `type`, `questionText`, `options`, `correctOptionId`
  - Check số câu theo Knowledge Group có đủ không (so với config ở Step 2)
  - Hiển thị lỗi/warning

#### 3.2. Tạo utility: `validateImportedQuestions()`
**File**: `src/features/session-builder/utils/validation.ts`

```ts
validateImportedQuestions(
  questions: any[],
  config: SessionConfig
): { valid: boolean; errors: string[]; warnings: string[] }
```

- Schema validation
- Count validation (so với knowledgeGroups config)
- Warning nếu thừa câu (sẽ lấy first N)

#### 3.3. Tạo utility: `parseSessionQuestion()`
**File**: `src/features/session-builder/utils/validation.ts`

```ts
parseImportedToSessionQuestions(json: string): SessionQuestion[]
```

- Parse JSON string
- Gán `tempId` (uuid or crypto.randomUUID())
- Map to `SessionQuestion` format
- Trả về mảng

### Kiểm tra
- Import valid JSON → parse thành công
- Import invalid JSON → hiển thị lỗi
- Import với số câu không đủ → cảnh báo

---

## Phase 4: Session Builder Wizard — Step4Preview + Step5Practice

### Mục tiêu
Preview câu hỏi trước khi làm, và tích hợp QuizEngine.

### Tasks

#### 4.1. Tạo `Step4Preview` component
**File**: `src/features/session-builder/components/Step4Preview.tsx`

- Summary section: Preset, Parts, Knowledge Groups, Total, Difficulty, Source
- Question list (collapsible): mỗi item hiển thị `Question {n}: {type} (Part {part})`
- Click vào question → expand hiển thị:
  - Question text + options
  - Đáp án đúng + rationale (disabled - chỉ xem, không chọn)
- Props: `session: PracticeSession, onBack, onStart`

#### 4.2. Tạo `Step5Practice` component
**File**: `src/features/session-builder/components/Step5Practice.tsx`

- Wrap `QuizEngine` component hiện tại
- Feed `initialQuestions` từ session.questions
- Nếu source = `imported`:
  - Load từ `useTempSession` (đã lưu ở Step 3)
  - Khi complete → `updateAttempt` vào temp session
- Nếu source = `system`:
  - Dùng `useQuizQuestions` với questions từ API
- Khi complete → chuyển sang Summary

#### 4.3. Tạo `SessionBuilder` container
**File**: `src/features/session-builder/components/SessionBuilder.tsx`

- Sử dụng `useSessionBuilder` hook
- Render các step dựa vào `state.step`
- Step 1 → `<Step1Scope>`
- Step 2 → `<Step2Config>`
- Step 3 → `<Step3Source>`
- Step 4 → `<Step4Preview>`
- Step 5 → `<Step5Practice>`
- Khi complete → `<SessionComplete>` (inline component)

#### 4.4. Tạo `SessionBuilderIndex` barrel
**File**: `src/features/session-builder/index.ts`

- Re-export `SessionBuilder`

### Kiểm tra
- Preview hiển thị đúng summary + questions
- Expand/collapse hoạt động
- Start practice → QuizEngine chạy với questions
- Complete → summary hiển thị

---

## Phase 5: API — `POST /api/sessions/generate`

### Mục tiêu
Tạo API endpoint để generate session từ System Bank.

### Tasks

#### 5.1. Tạo `src/api/sessions/generate/route.ts`
```ts
// POST /api/sessions/generate
// Body: { config: SessionConfig }
// Response: { sessionId: string, questions: SessionQuestion[] }
```

- Đọc body → parse config
- Gọi `quiz.service.getRandomQuestions()` với:
  - `types`: từ knowledgeGroups (map type string → query)
  - `difficulties`: từ config.difficulty
  - `limit`: config.totalQuestions
  - `countsPerType`: nếu cần balance theo knowledge group
- Map kết quả → `SessionQuestion[]`
- Gán `tempId` cho mỗi question
- Trả về response

#### 5.2. Cập nhật `quiz.service.ts` (nếu cần)
- `getRandomQuestions` đã hỗ trợ `types[]` và `difficulties[]`
- Có thể cần thêm `countsPerType` để lấy đúng số câu mỗi knowledge group

### Kiểm tra
- Gọi API với Postman/cURL → trả về questions
- Đúng số câu mỗi type
- Error handling khi không đủ questions

---

## Phase 6: Sidebar mới + Routing + My Library Placeholder

### Mục tiêu
Thay đổi sidebar của Mixed Practice, tạo routing mới, và My Library placeholder.

### Tasks

#### 6.1. Sửa `sidebar.constants.ts`
- Thay `mixedPracticeTopics` bằng sidebar resources mới:

```ts
mixedPracticeTopics: [
  { id: 'create-session', label: 'Create Session', path: '/practice/mixed-practice' },
  { id: 'sessions', label: 'My Sessions', path: '/practice/mixed-practice/sessions' },
  { id: 'library', label: 'My Library', path: '/practice/mixed-practice/library' },
  { id: 'templates', label: 'Saved Templates', path: '/practice/mixed-practice/templates' },
]
```

#### 6.2. Sửa `index.constants.ts`
- Cập nhật label maps nếu cần

#### 6.3. Tạo routing structure
```
src/app/(main)/practice/mixed-practice/
  ├── page.tsx                      ← SessionBuilder (default)
  ├── sessions/page.tsx             ← SessionList (UI)
  ├── library/page.tsx              ← MyLibrary (placeholder)
  └── templates/page.tsx            ← SavedTemplates (UI)
```

**File**: `src/app/(main)/practice/mixed-practice/page.tsx`
- Hiển thị Sidebar (có thể dùng lại `PracticeHeaderSection` hoặc custom)
- Main content: `<SessionBuilder>`
- Cần xử lý để route này override dynamic `[module]/[topic]` routing

**File**: `src/app/(main)/practice/mixed-practice/library/page.tsx`
- MyLibrary placeholder: "Tính năng đang phát triển"

**File**: `src/app/(main)/practice/mixed-practice/sessions/page.tsx`
- SessionList: danh sách session từ `useTempSession` (tất cả keys matching `mixed_session_*`)
- Mỗi session card: preset, parts, totalQuestions, status, createdAt
- Click → tiếp tục session (nếu `active`/`paused`) hoặc xem lại (nếu `completed`)

**File**: `src/app/(main)/practice/mixed-practice/templates/page.tsx`
- SavedTemplates: UI placeholder (feature sau)

#### 6.4. Tạo `MyLibraryPage` component
**File**: `src/features/my-library/components/MyLibraryPage.tsx`
- Placeholder UI: icon + text "Tính năng đang phát triển" + button "Quay lại Create Session"

#### 6.5. Cập nhật routing logic (nếu cần)
- Dynamic `[module]/[topic]` route cần skip `mixed-practice` (vì đã có dedicated routes)
- Thêm điều kiện kiểm tra trong `[module]/[topic]/page.tsx`: nếu module === 'mixed-practice' → redirect to `/practice/mixed-practice`

### Kiểm tra
- Sidebar hiển thị 4 items mới
- Click Create Session → SessionBuilder
- Click My Library → placeholder
- Click My Sessions → danh sách (có thể empty)

---

## Phase 7: SessionList UI + SavedTemplates UI

### Mục tiêu
Hoàn thiện My Sessions (load từ localStorage) và Saved Templates (placeholder).

### Tasks

#### 7.1. Tạo `SessionList` component
**File**: `src/features/temp-session/components/SessionList.tsx`

- Load tất cả sessions từ IndexedDB bằng `getAllSessions()`
- Parse createdAt, expiresAt, status
- Group: Active (preview/active/paused) và Completed
- Mỗi session card:
  - Preset label + icon
  - Parts list
  - Total questions
  - Created time (relative: "2 giờ trước")
  - Status badge
  - Actions: Continue (nếu chưa complete), View Result (nếu complete), Delete

#### 7.2. Tạo `SavedTemplates` placeholder
**File**: `src/features/session-builder/components/SavedTemplates.tsx`

- Giống MyLibrary: placeholder "Tính năng đang phát triển"

### Kiểm tra
- Session list hiển thị sessions đã tạo
- Continue → quay lại practice
- Delete → xoá khỏi localStorage

---

## Phase 8: Tổng kết — E2E Test + Cleanup

### Mục tiêu
End-to-end test, cleanup code cũ, migration confirm.

### Tasks

#### 8.1. E2E Test Flow
1. Vào Mixed Practice → Create Session
2. Step 1: Chọn Parts → Next
3. Step 2: Chọn Quick Preset → Next (auto fill config)
4. Step 3: Chọn "Practice Now" → Paste valid JSON → Validate → Next
5. Step 4: Preview questions → Start Practice
6. Step 5: Làm bài → Complete → Summary
7. Quay lại → My Sessions → thấy session vừa làm
8. Click My Library → placeholder

#### 8.2. Xoá code cũ (sau khi confirm)
- `CustomQuizForm/` component (nếu không còn dùng)
- `ChallengeModeEngine/` (tạm giữ nếu cần cho Part 7 sau này)
- `getWeightedQuestions` trong `quiz.service.ts` (cân nhắc)

#### 8.3. Kiểm tra tính năng cũ
- Grammar module vẫn chạy
- Vocabulary module vẫn chạy
- Dynamic `[module]/[topic]` routing vẫn hoạt động cho grammar/vocabulary

### Kiểm tra
- `npm run lint`
- `npm run typecheck`
- `npm run build`

---

## Tổng quan timeline

| Phase | Nội dung | Dependencies | Effort |
|-------|----------|-------------|--------|
| **1** | Types + useTempSession | None | 0.5 ngày |
| **2** | Session Builder Step1 + Step2 | Phase 1 | 1.5 ngày |
| **3** | Step3Source (Import JSON) | Phase 2 | 1 ngày |
| **4** | Step4Preview + Step5Practice | Phase 2, Phase 3 | 1.5 ngày |
| **5** | API generate session | Phase 1 | 1 ngày |
| **6** | Sidebar + Routing + My Library | Phase 2, Phase 4 | 1 ngày |
| **7** | SessionList + SavedTemplates | Phase 1, Phase 4 | 1 ngày |
| **8** | E2E Test + Cleanup | Tất cả | 1 ngày |
| | **Tổng** | | **~8.5 ngày** |

## File map tổng thể (sau khi implement)

```
src/
├── api/
│   ├── quiz/                         ← EXISTING
│   └── sessions/
│       └── generate/
│           └── route.ts              ← NEW
├── app/(main)/practice/mixed-practice/
│   ├── page.tsx                      ← NEW (SessionBuilder)
│   ├── sessions/page.tsx             ← NEW (SessionList)
│   ├── library/page.tsx              ← NEW (MyLibrary placeholder)
│   └── templates/page.tsx            ← NEW (SavedTemplates placeholder)
├── constants/
│   ├── sidebar.constants.ts          ← MODIFIED
│   └── index.constants.ts            ← MODIFIED (if needed)
├── features/
│   ├── quiz/                         ← EXISTING (giữ nguyên)
│   ├── session-builder/              ← NEW
│   │   ├── components/
│   │   │   ├── SessionBuilder.tsx
│   │   │   ├── Step1Scope.tsx
│   │   │   ├── Step2Config.tsx
│   │   │   ├── Step3Source.tsx
│   │   │   ├── Step4Preview.tsx
│   │   │   ├── Step5Practice.tsx
│   │   │   ├── SessionComplete.tsx
│   │   │   ├── StepNavigation.tsx
│   │   │   └── SavedTemplates.tsx
│   │   ├── hooks/
│   │   │   └── useSessionBuilder.ts
│   │   ├── types.ts
│   │   └── utils/
│   │       ├── knowledge-groups.ts
│   │       ├── presets.ts
│   │       └── validation.ts
│   ├── temp-session/                 ← NEW
│   │   ├── hooks/
│   │   │   └── useTempSession.ts
│   │   ├── components/
│   │   │   └── SessionList.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   └── my-library/                   ← NEW
│       └── components/
│           └── MyLibraryPage.tsx
├── ...
```
