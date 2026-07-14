# Mixed Practice Module — Tài liệu nghiệp vụ

## 1. Giới thiệu

**Mixed Practice** là module luyện tập tổng hợp TOEIC Part 5 (Incomplete Sentences), kết hợp ngẫu nhiên nhiều chủ điểm ngữ pháp trong một phiên làm bài. Route: `/practice/mixed-practice/*`.

Khác với **Grammar module** (luyện từng chủ điểm riêng lẻ: chỉ Comparison, chỉ Verb Tense...), Mixed Practice mô phỏng bài thi thật — nơi các câu hỏi thuộc nhiều chủ điểm khác nhau xuất hiện ngẫu nhiên.

---

## Kiến trúc tổng thể

```
/practice/mixed-practice/
  ├── quick-practice   (10 câu, luyện nhanh)
  ├── full-test        (30 câu, mô phỏng Part 5)
  ├── custom           (user config: số câu, độ khó, topic, balance)
  └── challenge        (30 câu, 15 phút, timer)
```

```
Mixed Practice Module
│
├── Practice Modes
│   ├── Quick Practice:   10 câu, practice section, rationale ngay
│   ├── Full Test:        30 câu, practice + quiz section
│   ├── Custom Practice:  user config (số câu, độ khó, topic, balance)
│   └── Challenge Mode:   30 câu, 15 phút, timer, TOEIC score
│
└── In-Quiz Features
    ├── Random Question Engine:     random từ nhiều topic
    ├── Result Analytics:          breakdown kết quả theo type
    ├── Review Mistakes:           xem lại câu sai
    ├── Save Question:             bookmark câu hỏi
    ├── Retry Incorrect:          làm lại câu sai
    ├── Smart Random:             ưu tiên topic yếu
    ├── Import Dialog:            import JSON từ AI
    └── Challenge Mode:          timer, không back, không instant feedback
```

### Component tree

```
PracticeTopicView (server component)
  ├── PracticeHeaderSection
  ├── [slug === 'custom'] → CustomQuizForm (client)
  │     └── QuizEngine
  ├── [slug === 'challenge'] → ChallengeModeEngine (client)
  │     └── useQuizEngine + useTimer
  └── [default] → sections
        ├── TheorySection
        └── QuizSection → QuizEngine
```

### Kế thừa với Grammar module

Mixed Practice dùng chung các component với Grammar module:

| Component | Grammar | Mixed Practice |
|-----------|---------|----------------|
| `QuizEngine` | ✅ | ✅ |
| `QuestionCard` | ✅ | ✅ |
| `OptionButton` | ✅ | ✅ |
| `RationaleBox` | ✅ | ✅ |
| `ImportDialog` | ✅ | ✅ |
| Data source | `questions.json` + DB | `questions.json` + DB |
| API check đáp án | `/api/attempts` (DB) | `/api/attempts` (DB) |

**Khác biệt duy nhất**: Grammar filter `WHERE type = :topicSlug`, Mixed Practice không filter (lấy từ tất cả type) hoặc filter theo config.

---

## Luồng dữ liệu

### Server-side (initial load)
```
[User chọn mode] → PracticeTopicView (server)
  → loadQuestions(type?)
    ├── Grammar:     filter q.type === topic.slug
    └── Mixed:       trả về tất cả câu hỏi
  → initialQuestions → QuizEngine / ChallengeModeEngine
```

### Client-side (answer checking)
```
[User chọn option] → POST /api/attempts
  → quiz.service.submitAttempt()
  → quiz.repository.findQuestionById(id) (Prisma → PostgreSQL)
  → check selectedOption.isCorrect
  → return { isCorrect, correctOptionId, rationale }
```

### Lưu lịch sử (DB)
Mỗi attempt được lưu vào bảng `Attempt` với `isCorrect`, từ đó thống kê accuracy theo type.

---

## Component tree

```
PracticeTopicView (server)
  ├── PracticeHeaderSection
  ├── [slug === 'custom'] → CustomQuizForm (client)
  │     └── QuizEngine
  ├── [slug === 'challenge'] → ChallengeModeEngine (client)
  │     └── useQuizEngine + useTimer
  └── [default] → sections
        ├── TheorySection
        └── QuizSection → QuizEngine
```

### Shared components (dùng chung với Grammar module)

| Component | Vai trò |
|-----------|---------|
| `QuizEngine` | Orchestrator chính: questions + attempts + import |
| `QuestionCard` | Hiển thị câu hỏi + options |
| `RationaleBox` | Giải thích đáp án sau mỗi câu |
| `ResultBreakdown` | Bảng breakdown kết quả theo type |
| `ReviewPanel` | Xem lại câu sai sau complete |
| `SaveButton` | Bookmark câu hỏi |
| `ImportDialog` | Import JSON từ AI |
| `CustomQuizForm` | Form config custom quiz |
| `ChallengeModeEngine` | Thi thử có timer |

---

## Các mode

### 1. Quick Practice (10 câu)

- **Mục đích**: Luyện nhanh hàng ngày, 10 câu Part 5 tổng hợp tất cả chủ điểm
- **Thời gian**: ~7 phút
- **Luồng**: User chọn → server load 10 câu random → QuizEngine render → user trả lời → rationale hiện ngay → complete screen
- **Đặc điểm**: Chỉ có practice section, không timer, rationale hiện sau mỗi câu

### 2. Full Test (30 câu)

- **Mục đích**: Mô phỏng Part 5 trong đề thi thật
- **Thời gian**: ~20 phút
- **Luồng**: User chọn → server load 30 câu → QuizEngine render → user trả lời → rationale hiện ngay → complete screen
- **Đặc điểm**: Có practice + quiz section (UI chia 2 tab)

### 3. Custom Practice (5-30 câu)

- **Mục đích**: User tự config bài luyện theo nhu cầu
- **Luồng**: User chọn → CustomQuizForm render → user config (số câu, độ khó, topic, balance) → bấm "Bắt đầu" → fetchQuestions với params → QuizEngine render
- **Config options**:
  - Số câu: 5, 10, 15, 20, 25, 30
  - Độ khó: Dễ, Trung bình, Khó (chọn nhiều)
  - Chủ điểm: 9 loại ngữ pháp (chọn nhiều)
  - Chế độ phân bổ: Cân bằng (chia đều) / Ngẫu nhiên
- **Balance algorithm**: Chia đều số câu cho mỗi type được chọn. Nếu không chia hết, phân bố phần dư cho các type ngẫu nhiên.

### 4. Challenge Mode (30 câu, 15 phút)

- **Mục đích**: Mô phỏng bài thi TOEIC Part 5 thật
- **Luồng**: User chọn → server load 30 câu → ChallengeModeEngine render → timer 15 phút chạy → user trả lời (không rationale) → auto-advance sau 600ms → hết giờ tự submit → complete screen + TOEIC score
- **Đặc điểm**:
  - Timer 15 phút, auto-submit khi hết giờ
  - Không hiện rationale sau mỗi câu
  - Không back navigation
  - TOEIC score ước tính (150-495) dựa trên số câu đúng

---

## In-Quiz Features

### 1. Random Question Engine

- **Vị trí**: Tất cả mode
- **Cách hoạt động**: `useQuizQuestions` fetch từ `GET /api/questions/random` với params (type, difficulty, types, difficulties, limit, balance)
- **Server**: `getRandomQuestions()` trong `quiz.service.ts` — xây dựng Prisma where clause, shuffle, slice theo limit
- **Balance mode**: Chia đều số câu cho mỗi type được chọn

### 2. Result Analytics (Phase 2)

- **Vị trí**: Màn hình complete của QuizEngine và ChallengeModeEngine
- **Cách hoạt động**: `typeStats` được tính từ `attemptHistory` — mỗi attempt record có `questionType`, `isCorrect`. `ResultBreakdown` component render bảng: mỗi type có progress bar + accuracy %
- **Dữ liệu**: `Record<string, { total: number; correct: number }>`

### 3. Review Mistakes (Phase 3)

- **Vị trí**: Màn hình complete
- **Cách hoạt động**: `ReviewPanel` nhận `questions` + `attemptHistory`, filter ra câu sai, hiển thị list. User click vào từng câu để xem question + đáp án đúng + rationale
- **Dữ liệu**: `attemptHistory` (AttemptRecord[]) — lưu trong state client, không cần API

### 4. Save Question (Phase 3)

- **Vị trí**: QuestionCard (trong lúc làm bài)
- **Cách hoạt động**: `SaveButton` gọi `POST /api/saved-questions` để toggle bookmark
- **DB**: Bảng `SavedQuestion` (userId, questionId) — unique constraint

### 5. Retry Incorrect (Phase 3)

- **Vị trí**: Màn hình complete
- **Cách hoạt động**: Filter `attemptHistory` lấy câu sai → `setQuestions(incorrectQuestions)` → `resetIdx()` → QuizEngine restart với subset
- **Không cần API**: Filter client-side từ questions đã có

### 6. Smart Random (Phase 5)

- **Vị trí**: Quick Practice, Full Test (khi bật weighted mode)
- **Cách hoạt động**:
  1. `GET /api/questions/weighted` → server gọi `getWeightedQuestions(userId, params)`
  2. Server lấy attempt history từ DB → tính typeStats
  3. Tính weight mỗi type: `weight = 1 - correct/total` (hoặc 0.5 nếu chưa có data)
  4. Normalize weights → quy đổi thành số lượng câu cố định cho mỗi type
  5. Phần dư (do làm tròn) phân bổ cho type có weight cao nhất
  6. Random câu trong từng type → shuffle toàn bộ
- **Đặc điểm**: Deterministic allocation — đảm bảo mỗi lần đều đúng distribution, không phụ thuộc may rủi

### 7. Import Dialog

- **Vị trí**: QuizEngine (trong lúc làm bài hoặc màn hình complete)
- **Cách hoạt động**: User copy JSON từ AI (ChatGPT/Claude/Gemini) → paste vào textarea → bấm "Use these questions" → parse JSON → replace question list
- **Đặc điểm**: Client-side, không lưu DB

### 8. Challenge Mode

- **Vị trí**: Route riêng `/practice/mixed-practice/challenge`
- **Cách hoạt động**:
  - `useTimer` đếm ngược 15 phút
  - User chọn option → auto-advance sau 600ms (không rationale)
  - Hết giờ → auto-submit
  - Complete screen: score + TOEIC score ước tính (150-495) + score band
- **Công thức TOEIC score**: `150 + (correct / total) * 345`

---

## API Endpoints

| Endpoint | Method | Mục đích | Params |
|----------|--------|----------|--------|
| `/api/questions/random` | GET | Random câu hỏi | `type`, `types[]`, `difficulty`, `difficulties[]`, `limit`, `balance` |
| `/api/questions/weighted` | GET | Random có trọng số | `types[]`, `difficulties[]`, `limit` |
| `/api/attempts` | POST | Ghi nhận câu trả lời | `questionId`, `selectedOptionId`, `timeSpentSeconds` |
| `/api/saved-questions` | POST | Bookmark câu hỏi | `questionId` |
| `/api/saved-questions` | DELETE | Bỏ bookmark | `questionId` (query) |
| `/api/stats` | GET | Thống kê user | — |

---

## File map

```
src/
├── api/quiz/
│   ├── quiz.service.ts          # submitAttempt, getRandomQuestions, getWeightedQuestions, getUserStats
│   └── quiz.repository.ts       # Prisma queries
├── app/api/questions/
│   ├── random/route.ts          # GET /api/questions/random
│   └── weighted/route.ts        # GET /api/questions/weighted
├── features/quiz/
│   ├── client/quiz.client.ts    # fetchQuestions, fetchWeightedQuestions, submitAttempt
│   ├── components/
│   │   ├── ChallengeModeEngine/  # Challenge Mode (timer, no feedback, TOEIC score)
│   │   ├── CustomQuizForm/       # Form config custom quiz
│   │   ├── ImportDialog/         # Import JSON từ AI
│   │   ├── PracticeTopicView/    # Server component, routing theo slug
│   │   ├── QuestionCard/         # Hiển thị câu hỏi + options
│   │   ├── QuizEngine/           # Orchestrator chính
│   │   ├── RationaleBox/        # Giải thích đáp án
│   │   ├── ResultBreakdown/     # Bảng breakdown theo type
│   │   ├── ReviewPanel/         # Xem lại câu sai
│   │   └── SaveButton/          # Bookmark câu hỏi
│   ├── hooks/
│   │   ├── useQuizEngine.ts     # Orchestrator hook
│   │   ├── useQuizQuestions.ts  # Fetch + state questions
│   │   ├── useQuizAttempt.ts    # Submit + history
│   │   ├── useQuizImport.ts     # Import JSON
│   │   └── useTimer.ts          # Countdown timer
│   └── utils/
│       ├── load-questions.utils.ts  # Server-side load
│       └── quiz.utils.ts            # Parse import, generate template
├── constants/
│   ├── sidebar.constants.ts     # Topic definitions
│   └── index.constants.ts       # Label maps
└── api/quiz/
    ├── quiz.service.ts          # Business logic
    └── quiz.repository.ts       # Prisma queries
```

---

## Lưu ý kỹ thuật

### Balance mode
Khi user chọn Balanced, engine chia đều số câu cho mỗi type được chọn. Nếu số câu không chia hết, phân bố phần dư cho các type ngẫu nhiên.

### Question distribution
Khi user start quiz, một bộ câu hỏi được chọn và cố định cho đến khi hoàn thành hoặc reset. Không thay đổi giữa chừng.

### Smart Random algorithm
- **Deterministic allocation**: Tính số câu cố định cho mỗi type dựa trên weight, không random từng câu
- **Weight**: `1 - correct/total` (hoặc `0.5` nếu chưa có data)
- **Phân bố phần dư**: Type có weight cao nhất được ưu tiên nhận phần dư

### Retry Incorrect
Tạo subset của question list hiện tại (chỉ câu sai). QuizEngine restart với subset này. Không cần API.

### Import Dialog
Import hoạt động client-side. Parse JSON từ AI → render ngay. Không lưu vào DB.

---

## Tổng kết Phase

| Phase | Nội dung | Files thay đổi | Phụ thuộc |
|-------|----------|----------------|-----------|
| **1** | Core Modes (Quick/Full Test) | 5-6 files | Không |
| **2** | Result Analytics (breakdown theo type) | 2-3 files | Phase 1 |
| **3** | Review + Retry + Save Question | 4-5 files + DB schema | Phase 1, 2 |
| **4** | Custom Quiz (config form) | 5-6 files | Phase 1 |
| **5** | Smart Random (weight algorithm) | 3-4 files | Phase 2, data history |
| **6** | Challenge Mode (timed test) | 3-4 files | Phase 1 |
