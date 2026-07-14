# Mixed Practice v2 — Kế hoạch phát triển

## 1. Tổng quan

### 1.1. Vấn đề hiện tại

Mixed Practice hiện tại bị giới hạn:
- Chỉ hỗ trợ Part 5 (Incomplete Sentences)
- Không có khái niệm "session" — chỉ là random câu hỏi + làm bài
- Import JSON chỉ là client-side tạm, không có persistence
- Không có preview trước khi làm
- Sidebar chứa preset modes thay vì resources

### 1.2. Hướng đi mới

Mixed Practice trở thành **Session Builder** — nơi user **thiết kế phiên luyện tập**:

```
Mixed Practice
│
├── Create Session      ← Wizard: Scope → Config → Source → Preview → Practice
├── My Sessions         ← Lịch sử session (temp, auto-expire)
├── My Library          ← Bộ đề JSON đã lưu (UI placeholder, future feature)
└── Saved Templates     ← Cấu hình session đã lưu
```

### 1.3. Nguyên tắc thiết kế

1. **Practice Preset đầu tiên**: User chọn mục tiêu (Quick/Balanced/Smart/Exam/Custom) trước khi config chi tiết
2. **System Bank vs Import**: Hai luồng riêng biệt, Import chỉ có "Practice Now" (temp)
3. **Preview trước khi Start**: User biết rõ bộ đề trước khi làm
4. **Temporary Session**: Lưu session trong IndexedDB, auto-expire (configurable, default 24h)
5. **Aggregated Stats**: Chỉ gửi thống kê tổng hợp lên server (không gửi raw questions)
6. **Reuse existing code**: QuizEngine, hooks, components giữ nguyên

### 1.4. Phân tầng tài liệu

| Tầng | Mô tả | Ví dụ |
|------|-------|-------|
| **Business Requirement** | User cần làm được gì | "User có thể lưu bộ đề đã import để dùng lại" |
| **Technical Design** | Hệ thống đáp ứng thế nào | "Session config lưu metadata trong DB, question raw lưu trong Blob Storage" |
| **Infrastructure** | Công nghệ triển khai | "Azure Blob Storage, PostgreSQL, Redis" |

Tài liệu này tập trung vào **Business Requirement + Technical Design**.

---

## 2. User Flow

### 2.1. Tổng thể

```
User → Mixed Practice → Sidebar: [Create Session | My Sessions | My Library | Saved Templates]
                                              |
                                              v
                                     Create Session (Wizard)
                                              |
                                    Step 1: Scope (Parts)
                                              |
                                    Step 2: Config (Preset + Knowledge Groups)
                                              |
                                    Step 3: Question Source
                                              |
                                    Step 4: Preview
                                              |
                                    Step 5: Practice (QuizEngine)
                                              |
                                    Complete → Summary + Stats
```

### 2.2. Chi tiết từng step

#### Step 1: Scope Selection

User chọn part(s) muốn luyện:

```
Reading                            Listening
☐ Part 5: Incomplete Sentences     ☐ Part 1: Photographs
☐ Part 6: Text Completion          ☐ Part 2: Question-Response
☐ Part 7: Reading Comprehension    ☐ Part 3: Conversations
                                    ☐ Part 4: Talks

[Next]
```

Mặc định: chọn tất cả part trong Reading.

#### Step 2: Config (Preset + Knowledge Groups)

User chọn Practice Preset trước, hệ thống tự fill config. User có thể chỉnh nếu chọn Custom.

```
How do you want to practice today?

┌──────────────────────┐  ┌──────────────────────┐
│ ⚡ Quick Practice    │  │ ⚖ Balanced Practice  │
│ 20 câu, Medium       │  │ Đều các Part         │
└──────────────────────┘  └──────────────────────┘
┌──────────────────────┐  ┌──────────────────────┐
│ 🎯 Smart Practice    │  │ 📝 Exam Practice     │
│ Theo điểm yếu        │  │ Đúng tỉ lệ ETS        │
└──────────────────────┘  └──────────────────────┘
┌─────────────────────────────────────────────────┐
│ ⚙ Build My Own                                  │
│ Full control over every configuration            │
└─────────────────────────────────────────────────┘

[Quick selected → tự động fill 20 câu, Medium, Balanced, focus Part 5]
[Balanced selected → tự chia đều số câu giữa các Part đã chọn]
[Smart selected → đọc analytics, ưu tiên Knowledge Group yếu]
[Exam selected → fill đúng số câu theo cấu trúc ETS]
[Build My Own → mở toàn bộ form config bên dưới]
```

Khi chọn **Build My Own** (Custom), form config chi tiết hiện ra:

```
Part 5: Incomplete Sentences
  ┌─────────────────────────────────────────────┐
  │ Knowledge Groups:                           │
  │ ☑ Word Form         5 câu  [▲] [▼]         │
  │ ☑ Comparison        5 câu  [▲] [▼]         │
  │ ☐ Vocabulary                                │
  │ ☑ Verb Tense        5 câu  [▲] [▼]         │
  │ ☐ Preposition                              │
  │ ☐ Conjunction                              │
  │ ☐ Participle                               │
  │ ☐ Voice                                    │
  │ ☐ Relative Clause                          │
  │ ☐ Agreement                                │
  │                                             │
  │ Difficulty: [Easy] [Medium] [Hard]          │
  │                                             │
  │ Total Part 5: 15 câu                        │
  └─────────────────────────────────────────────┘

[Add Part 6] [Back] [Next]
```

**Lưu ý**: Knowledge Group là tên gọi chung cho tất cả Part.
- Part 5 → grammar types (Word Form, Comparison, Verb Tense...)
- Part 6 → sentence insertion, grammar, vocabulary
- Part 7 → single passage, double passage, triple passage
- Part 1-4 → (sau này mở rộng)

#### Step 3: Question Source

```
Question Source
  ● System Bank (câu hỏi từ DB của hệ thống)
  ○ Practice Now (Import JSON, dùng một lần)
  ○ My Library (bộ đề đã lưu — sắp ra mắt)

[System Bank selected]
  → Dùng DB, không cần config thêm

[Practice Now selected]
  → Hiển thị textarea + format mẫu
  → User paste JSON
  → Hệ thống validate:
    - Check schema
    - Check số câu theo Knowledge Group
    - So sánh với config ở Step 2
    - Cảnh báo nếu không khớp
  → Lưu vào IndexedDB (cache tạm, TTL 24h)
  → Cho phép proceed (lấy first N câu nếu thừa)

[My Library selected]
  → UI placeholder: "Tính năng đang phát triển"
  → Chưa có logic

[Back] [Next]
```

**Import JSON format**:
```json
{
  "questions": [
    {
      "part": 5,
      "type": "word-form",
      "difficulty": "medium",
      "questionText": "The company is looking for a candidate...",
      "options": [
        { "id": "A", "text": "rely", "order": 1, "isCorrect": false },
        { "id": "B", "text": "reliable", "order": 2, "isCorrect": true },
        { "id": "C", "text": "reliability", "order": 3, "isCorrect": false },
        { "id": "D", "text": "reliably", "order": 4, "isCorrect": false }
      ],
      "correctOptionId": "B",
      "rationale": "Cần tính từ bổ nghĩa cho danh từ 'candidate'..."
    }
  ]
}
```

#### Step 4: Preview

```
Session Preview
  ┌─────────────────────────────────────────────┐
  │ Summary                                     │
  │   Practice Preset: Build My Own             │
  │   Parts: Part 5, Part 6                     │
  │   Knowledge Groups: Word Form (5),          │
  │     Comparison (5), Sentence Insertion (5)  │
  │   Total: 15 câu                             │
  │   Difficulty: Medium                        │
  │   Source: Practice Now (Import)             │
  │   Estimated time: 10 phút                   │
  │                                             │
  │ Question List (collapsible):                │
  │   ▶ Question 1: Word Form (Part 5)          │
  │   ▶ Question 2: Comparison (Part 5)         │
  │   ▶ Question 3: Sentence Insertion (Part 6) │
  │   ...                                       │
  │                                             │
  │ [Back] [Start Practice]                     │
  └─────────────────────────────────────────────┘
```

User click vào từng question để xem:
- Question text + options
- Đáp án đúng + rationale (disabled, chỉ xem)
- Không cho phép swap/edit ở MVP

#### Step 5: Practice

Dùng `QuizEngine` hiện tại, feed `initialQuestions` từ session.

Khác biệt:
- Nếu source = Practice Now (Import JSON) → dùng `useTempSession` load từ IndexedDB
- Nếu source = System Bank → dùng `loadQuestions` load từ DB

#### Complete Screen

```
Practice Complete
  Score: 12/15 (80%)
  Estimated TOEIC: 320

  Breakdown:
    Part 5: Word Form:    4/5  (80%)
    Part 5: Comparison:   3/5  (60%)  ← Weak
    Part 6: Insertion:    5/5  (100%)

  [Review Mistakes]
  [Retry Incorrect]
  [Start New Session]
```

---

## 3. Kiến trúc

### 3.1. Routing

```
/practice/mixed-practice/
  └── page.tsx
        ├── Sidebar
        │     ├── Create Session (default route: /practice/mixed-practice)
        │     ├── My Sessions (route: /practice/mixed-practice/sessions)
        │     ├── My Library (route: /practice/mixed-practice/library)
        │     └── Saved Templates (route: /practice/mixed-practice/templates)
        │
        └── Main Content
              ├── [default] → SessionBuilder
              │     ├── Step1Scope
              │     ├── Step2Config (Preset + Knowledge Groups)
              │     ├── Step3Source (System Bank / Practice Now / My Library placeholder)
              │     ├── Step4Preview
              │     └── Step5Practice (QuizEngine)
              │
              ├── [sessions] → SessionList
              │     └── SessionCard[]
              │
              ├── [library] → MyLibrary
              │     └── Placeholder: "Tính năng đang phát triển"
              │
              └── [templates] → SavedTemplateList
                    └── TemplateCard[]
```

### 3.2. Temporary Session (Business)

- **Mục đích**: Lưu session tạm để chống mất dữ liệu khi refresh/đóng tab
- **Thời gian sống**: Tự động hết hạn sau thời gian không hoạt động (configurable)
- **Phạm vi**: Chỉ trên thiết bị hiện tại, không đồng bộ

### 3.3. Temporary Session (Technical Design)

```typescript
// Lưu trong IndexedDB: `mixed_session_{sessionId}`
// TTL: cache chỉ tồn tại trong thời gian ngắn, configurable (default 24h)
// Dung lượng tối đa: 200 questions

interface PracticeSession {
  id: string
  userId: string
  createdAt: number
  expiresAt: number
  config: SessionConfig
  questions: SessionQuestion[]
  attempts: SessionAttempt[]
  currentIndex: number
  status: 'preview' | 'active' | 'paused' | 'completed'
}

interface SessionConfig {
  preset: 'quick' | 'balanced' | 'smart' | 'exam' | 'custom'
  parts: number[]
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  difficulty: string[]
  source: 'system' | 'imported'
  importJson?: string
  totalQuestions: number
}

interface KnowledgeGroupConfig {
  type: string
  count: number
}

interface SessionQuestion {
  tempId: string
  part: number
  type: string
  difficulty: string
  questionText: string
  options: { id: string; text: string; order: number; isCorrect?: boolean }[]
  correctOptionId: string
  rationale: string
  // System Bank questions keep originalId
  originalId?: string
}

interface SessionAttempt {
  tempQuestionId: string
  selectedOptionId: string
  isCorrect: boolean
  timeSpentMs: number
  createdAt: number
}
```

### 3.4. Data Flow

```
[System Bank]
  SessionBuilder
    → Step 2: user chọn preset (hoặc custom config)
    → generateSession() (server)
      → quiz.service.getRandomQuestions() với counts per Knowledge Group
      → Trả về questions
    → Preview: hiển thị questions
    → Start: QuizEngine

[Practice Now (Import JSON)]
  SessionBuilder
    → Step 2: user config Knowledge Groups + counts (dùng để validate)
    → Step 3: user paste JSON
    → validateJson(json, config)
      → Check schema
      → Check số câu mỗi Knowledge Group có đủ không
    → parseJsonToSessionQuestions(json)
      → Gán tempId, part, type từ JSON
      → Snapshot toàn bộ (denormalized)
    → Save to IndexedDB (useTempSession)
    → Preview: hiển thị questions (load từ IndexedDB)
    → Start: QuizEngine (load từ IndexedDB)
```

### 3.5. useTempSession Hook

```typescript
function useTempSession(sessionId: string) {
  STORAGE_KEY = `mixed_session_${sessionId}`
  TTL_HOURS = 24  // configurable

  save(session: PracticeSession): void
  load(): PracticeSession | null
  clear(): void
  updateAttempt(attempt: SessionAttempt): void
  updateIndex(index: number): void
}
```

### 3.6. Existing Components Reuse

| Component | Reuse? | Ghi chú |
|-----------|--------|---------|
| `QuizEngine` | ✅ | Giữ nguyên, nhận `initialQuestions` |
| `QuestionCard` | ✅ | Giữ nguyên, hiển thị text-based question |
| `RationaleBox` | ✅ | Giữ nguyên |
| `ReviewPanel` | ✅ | Giữ nguyên |
| `ResultBreakdown` | ✅ | Giữ nguyên |
| `SaveButton` | ✅ | Giữ nguyên |
| `useQuizEngine` | ✅ | Giữ nguyên |
| `useQuizAttempt` | ✅ | Giữ nguyên |
| `useQuizQuestions` | ✅ | Giữ nguyên (chỉ dùng cho System Bank) |
| `ImportDialog` | ⚠️ | Merge vào Step 3 của Session Builder |
| `CustomQuizForm` | ❌ | Thay thế bằng Session Builder wizard |
| `ChallengeModeEngine` | ❌ | Bỏ qua, không còn là mixed mode |
| `PracticeTopicView` | ❌ | Thay thế bằng routing mới |
| `loadQuestions` | ⚠️ | Giữ cho System Bank server-side |

---

## 4. API Endpoints

### 4.1. Generate Session (System Bank)

```
POST /api/sessions/generate
{
  config: {
    preset: "custom",
    parts: [5, 6],
    knowledgeGroups: {
      "5": [{ type: "word-form", count: 5 }, { type: "comparison", count: 5 }],
      "6": [{ type: "sentence-insertion", count: 5 }]
    },
    difficulty: ["medium"],
    limit: 15
  }
}

→ Response:
{
  sessionId: "uuid",
  questions: SessionQuestion[]
}
```

### 4.2. Sync Aggregated Stats

```
POST /api/stats/sync
{
  stats: {
    "5:word-form": { total: 5, correct: 4 },
    "5:comparison": { total: 5, correct: 2 }
  },
  totalQuestions: 10,
  correctCount: 6,
  durationMs: 300000
}
```

---

## 5. Sidebar Navigation

```
Mixed Practice
├── ● Create Session    ← mặc định
├──   My Sessions       ← lịch sử session
├──   My Library        ← bộ đề đã lưu (UI placeholder)
└──   Saved Templates   ← cấu hình đã lưu
```

### My Library (UI placeholder)

Khi user click vào "My Library" ở sidebar, main content hiển thị:

```
My Library
  ┌─────────────────────────────────────┐
  │                                     │
  │   📚 My Library                     │
  │                                     │
  │   Tính năng đang phát triển.        │
  │   Sắp ra mắt: Lưu bộ đề import      │
  │   để sử dụng nhiều lần.             │
  │                                     │
  │   [Quay lại Create Session]         │
  │                                     │
  └─────────────────────────────────────┘
```

Chỉ là UI, chưa có logic. Tính năng này sẽ thực hiện ở các phiên bản sau.

---

## 6. File map (mới)

```
src/
├── features/
│   ├── session-builder/              ← NEW
│   │   ├── components/
│   │   │   ├── SessionBuilder.tsx     ← Wizard container
│   │   │   ├── Step1Scope.tsx         ← Part selection
│   │   │   ├── Step2Config.tsx        ← Preset + Knowledge Groups
│   │   │   ├── Step3Source.tsx        ← System Bank / Practice Now
│   │   │   ├── Step4Preview.tsx       ← Preview questions
│   │   │   └── StepNavigation.tsx     ← Back/Next buttons
│   │   ├── hooks/
│   │   │   └── useSessionBuilder.ts  ← Wizard state machine
│   │   └── types.ts                  ← SessionBuilderStep, ScopeConfig, PresetType
│   │
│   ├── temp-session/                 ← NEW
│   │   ├── hooks/
│   │   │   └── useTempSession.ts     ← IndexedDB save/load/clear
│   │   └── types.ts                  ← PracticeSession, SessionQuestion
│   │
│   ├── my-library/                   ← NEW (UI only)
│   │   └── components/
│   │       └── MyLibraryPage.tsx     ← Placeholder component
│   │
│   └── quiz/                         ← EXISTING, giữ nguyên
│       ├── client/
│       ├── components/
│       │   ├── QuizEngine/
│       │   ├── QuestionCard/
│       │   ├── RationaleBox/
│       │   ├── ResultBreakdown/
│       │   ├── ReviewPanel/
│       │   ├── SaveButton/
│       │   └── ImportDialog/         ← Có thể merge vào Step3Source
│       ├── hooks/
│       │   ├── useQuizEngine.ts
│       │   ├── useQuizAttempt.ts
│       │   └── useQuizQuestions.ts
│       └── utils/
│
├── api/
│   ├── sessions/                     ← NEW
│   │   └── generate/route.ts         ← POST /api/sessions/generate
│   └── quiz/                         ← EXISTING
│
├── app/practice/mixed-practice/      ← MODIFIED
│   ├── page.tsx                      ← Sidebar + Create Session (default)
│   ├── sessions/page.tsx             ← Session list
│   ├── library/page.tsx              ← My Library (UI placeholder)
│   └── templates/page.tsx            ← Saved templates
│
├── constants/
│   ├── sidebar.constants.ts          ← MODIFIED
│   └── index.constants.ts            ← MODIFIED
│
└── docs/
    └── mixed-practice-v2-plan.md     ← THIS DOC
```

---

## 7. Xử lý code cũ

### 7.1. Giữ nguyên

- `src/features/quiz/` — **Không xoá**. QuizEngine, hooks, components được tái sử dụng.
- `src/features/quiz/components/ImportDialog/` — Có thể tái sử dụng trong Step3Source.
- `src/features/quiz/utils/quiz.utils.ts` — `generateTemplate`, `parseImportedJSON` vẫn dùng.

### 7.2. Sửa đổi

| File hiện tại | Xử lý |
|---------------|-------|
| `sidebar.constants.ts` | Thay `mixedPracticeTopics` (quick-practice, full-test, custom, challenge) bằng sidebar resources (Create, Sessions, Library, Templates) |
| `index.constants.ts` | Cập nhật label maps cho sidebar mới |
| `PracticeTopicView.tsx` | Giữ cho Grammar module, nhưng mixed-practice route sẽ dùng Session Builder thay thế |
| `CustomQuizForm.tsx` | Không dùng nữa (thay bằng Session Builder), có thể xoá sau khi confirm |
| `ChallengeModeEngine.tsx` | Tạm giữ, có thể dùng lại cho Part 7 Challenge sau này |

### 7.3. Xoá (sau khi migrate)

- `CustomQuizForm/` — Thay bằng Session Builder
- `ChallengeModeEngine/` — Feature tạm thời không dùng
- `getWeightedQuestions` trong `quiz.service.ts` — Phase 5 Smart Random, cần thiết kế lại

### 7.4. Migration Steps

1. Tạo `features/session-builder/` + `features/temp-session/` (code mới, không ảnh hưởng cũ)
2. Tạo `features/my-library/` với placeholder UI
3. Tạo `app/practice/mixed-practice/library/page.tsx`
4. Tạo `api/sessions/generate/` (API mới)
5. Sửa `sidebar.constants.ts` (thay đổi sidebar)
6. Sửa route `practice/mixed-practice/page.tsx` (routing mới)
7. Confirm các tính năng cũ (Grammar module) vẫn chạy
8. Xoá code cũ không dùng

---

## 8. Roadmap

| Phase | Nội dung | Effort |
|-------|----------|--------|
| **1** | `useTempSession` + Types | 1 day |
| **2** | `POST /api/sessions/generate` | 1 day |
| **3** | Session Builder: Step1Scope + Step2Config (Preset) | 2 days |
| **4** | Session Builder: Step3Source (Practice Now) | 1 day |
| **5** | Session Builder: Step4Preview | 1 day |
| **6** | Sidebar mới + routing + My Library placeholder | 1 day |
| **7** | End-to-end test + xoá code cũ | 1 day |
| **8** | My Sessions UI + Saved Templates UI | 2 days (optional) |

**Total**: ~7-10 days
