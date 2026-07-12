# Mixed Practice Module — Kế hoạch phát triển

## 1. Giới thiệu

**Mixed Practice** là module luyện tập tổng hợp TOEIC Part 5 (Incomplete Sentences), kết hợp ngẫu nhiên nhiều chủ điểm ngữ phá trong một phiên làm bài. Module này nằm tại route `/practice/mixed-practice/*`.

Khác với **Grammar module** (luyện từng chủ điểm riêng lẻ: chỉ Comparison, chỉ Verb Tense...), Mixed Practice mô phỏng bài thi thật — nơi các câu hỏi thuộc nhiều chủ điểm khác nhau xuất hiện ngẫu nhiên.

---

## 2. Kiến trúc tổng thể

```
/practice/mixed-practice/
  ├── quick-practice   (10 câu)
  ├── full-test        (30 câu)
  └── custom           (user config: số câu, độ khó, topic, balance mode)
```

```
Mixed Practice Module
│
├── Practice Modes (cách bắt đầu bài học)
│   ├── Quick Practice:    10 câu, practice section, không timer
│   ├── Full Test:         30 câu, practice + quiz section, mô phỏng Part 5
│   └── Custom Practice:   user tuỳ chỉnh (số câu, độ khó, topic, balance mode). 20 câu (Standard) là một preset trong Custom.
│
└── In-Quiz Features (tính năng trong/sau khi học)
    ├── Random Question Engine:     engine random từ nhiều topic
    ├── Result Analytics:          breakdown kết quả theo từng topic
    ├── Weak Topic Detection:     phát hiện topic yếu
    ├── Review Mistakes:         xem lại câu sai
    ├── Save Question:           bookmark câu hỏi
    ├── Retry Incorrect:        làm lại câu sai
    ├── Smart Random:            ưu tiên topic yếu
    └── Challenge Mode:          timer, không back, không hiện đáp án ngay
```

### Kế thừa

Mixed Practice **dùng chung** với Grammar module:

| Component | Grammar | Mixed Practice |
|-----------|---------|----------------|
| `QuizEngine` | ✅ | ✅ (giống hệt) |
| `QuestionCard` | ✅ | ✅ (giống hệt) |
| `OptionButton` | ✅ | ✅ (giống hệt) |
| `RationaleBox` | ✅ | ✅ (giống hệt) |
| `ImportDialog` | ✅ | ✅ (giống hệt) |
| Data source | `questions.json` + DB | `questions.json` + DB |
| API check đáp án | `/api/attempts` (DB) | `/api/attempts` (DB) |

**Khác biệt duy nhất**: Grammar filter `WHERE type = :topicSlug`, Mixed Practice **không filter** (lấy từ tất cả type) hoặc filter theo config.

---

## 3. Luồng dữ liệu

### Phase 1: Hiển thị câu hỏi (server-side)

```
[User chọn mode] → PracticeTopicView (server component)
  → loadQuestions(type?) 
    ├── Grammar:     filter q.type === topic.slug
    └── Mixed:       trả về tất cả câu hỏi
  → initialQuestions
  → QuizClient (client component)
  → QuizEngine
```

### Phase 2: Check đáp án (API)

```
[User chọn option] → POST /api/attempts
  → quiz.service.submitAttempt()
  → quiz.repository.findQuestionById(id) (Prisma → PostgreSQL)
  → check selectedOption.isCorrect
  → return { isCorrect, correctOptionId, rationale }
```

### Phase 3: Lưu lịch sử (DB)

Mỗi attempt được lưu vào bảng `Attempt` với `isCorrect`, từ đó thống kê accuracy theo type.

---

## 4. Roadmap — 6 Phase

---

### Phase 1: Core Modes — Quick, Full Test

**Mục tiêu**: Đưa Mixed Practice vào hoạt động với 2 mode nhanh (Quick 10 câu + Full Test 30 câu), random câu hỏi từ tất cả chủ điểm. Kết quả hiển thị đúng/sai cơ bản.

**Tại sao làm trước**: Đây là nền tảng để các tính năng khác xây dựng lên. Không có core modes thì không có analytics, review hay smart random.

**Ghi chú**: Standard (20 câu) không phải fixed mode — nó là một preset số câu trong Custom Quiz (Phase 4).

| File | Thay đổi | Chi tiết |
|------|----------|----------|
| `src/constants/sidebar.constants.ts` | Thêm 2 topics vào `mixedPracticeTopics` | quick-practice, full-test với `sections` khác nhau (quick-practice: chỉ practice, full-test: practice+quiz) |
| `src/constants/index.constants.ts` | Thêm label maps | `TYPE_LABEL_MAP`, `TYPE_SLUG_MAP_ENG`, `TYPE_LABEL_MAP_VIETNAM` cho 2 slug mới |
| `src/features/quiz/constants.ts` | Thêm `typeContext` | Mô tả cho từng mode (khác với grammar type context) |
| `src/features/quiz/utils/load-questions.utils.ts` | Sửa `loadQuestions` | `type` optional → nếu null/undefined/'all' thì trả về tất cả câu hỏi |
| `src/features/quiz/components/Sections/PracticeTopicView.tsx` | Thêm logic detect mixed | Nếu `practiceModule.id === 'mixed-practice'` thì gọi `loadQuestions(null)` thay vì `loadQuestions(topic.slug)` |
| `src/features/quiz/utils/quiz.utils.ts` | Thêm mixed prompt | `SAMPLE_QUESTIONS['quick-practice']`, `'full-test'` cho Import Dialog |

**Feature hoàn thành**: 2 Practice Modes hoạt động, user có thể chọn mode, làm bài, xem đúng/sai từng câu, xem tổng kết khi hoàn thành.

---

### Phase 2: Result Analytics — Breakdown theo topic

**Mục tiêu**: Sau khi hoàn thành bài, hiển thị breakdown kết quả theo từng chủ điểm (Comparison 4/5, Word Form 2/5...) thay vì chỉ "Đúng 24/30".

**Tại sao làm sau Phase 1**: Phase 1 đã lưu attempt vào DB, Phase 2 chỉ việc query và hiển thị. Nếu làm Phase 2 trước Phase 1 thì không có data.

**Chi tiết thực hiện**:

| File | Thay đổi | Chi tiết |
|------|----------|----------|
| `src/features/quiz/components/QuizEngine/QuizEngine.tsx` | Sửa màn hình `isComplete` | Thay vì chỉ "Hoàn thành! Bạn đã trả lời X câu", hiển thị bảng breakdown: mỗi type có progress bar + accuracy % |
| `src/features/quiz/hooks/useQuizEngine.ts` | Truyền thêm `typeStats` | Tính stats từ `useQuizAttempt.correctCount` nhưng phân loại theo type của từng question |
| Có thể cần component mới | `ResultBreakdown` | Component hiển thị breakdown (reusable cho các bài quiz khác) |

**Logic tính breakdown**:
```
const typeStats = useMemo(() => {
  const stats: Record<string, { total: number; correct: number }> = {}
  questions.forEach((q, i) => {
    if (!stats[q.type]) stats[q.type] = { total: 0, correct: 0 }
    stats[q.type].total++
    if (i < correctCount) stats[q.type].correct++  // cần tracking correct theo index
  })
  return stats
}, [questions, attemptHistory])
```

**Feature hoàn thành**: User biết chính xác mình yếu topic nào sau mỗi bài test.

---

### Phase 3: Review Mistakes + Retry Incorrect + Save Question

**Mục tiêu**: Cho phép user xem lại câu sai, làm lại câu sai, và bookmark câu hỏi yêu thích.

**Tại sao làm sau Phase 2**: Phase 2 đã show breakdown (VD: Verb Tense 2/5), Phase 3 cho user hành động "Vậy tôi muốn xem lại 3 câu Verb Tense sai đó". Đây là bước chuyển từ **biết mình yếu** → **cải thiện điểm yếu**.

**Chi tiết thực hiện**:

| Tính năng | UI | DB |
|-----------|----|-----|
| **Review Mistakes** | Sau complete, list tất cả câu sai → click để xem lại question + đáp án đúng + rationale | Dùng `useQuizQuestions` questions đã có + `attemptHook` result history |
| **Retry Incorrect** | Nút "Làm lại câu sai" → filter questions chỉ lấy câu sai → restart QuizEngine với subset đó | API mới `GET /api/questions/by-ids?ids=...` hoặc filter client-side |
| **Save Question** | Icon ⭐ trên QuestionCard → toggle save | Bảng `SavedQuestion` (userId, questionId, createdAt) trong Prisma |

**Prisma schema mới (Save Question)**:
```prisma
model SavedQuestion {
  id         String   @id @default(cuid())
  userId     String
  questionId String
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
  question   Question @relation(fields: [questionId], references: [id])

  @@unique([userId, questionId])
}
```

**Feature hoàn thành**: User không chỉ biết mình sai ở đâu mà còn có thể xem lại, làm lại, lưu lại.

---

### Phase 4: Custom Quiz — User tự config

**Mục tiêu**: Cho user tự chọn số câu, độ khó, topic, balance mode để tạo quiz theo nhu cầu. **Standard (20 câu)** là một preset trong Custom này.

**Tại sao làm sau Phase 3**: Custom Quiz cần UI phức tạp (form config) + API filter linh hoạt. Các Phase trước đã xây dựng QuizEngine + API + analytic, Phase 4 chỉ thêm UI config + filter parameters vào API.

**Chi tiết thực hiện**:

| File | Thay đổi |
|------|----------|
| New component: `CustomQuizForm.tsx` | Form chọn số câu (5/10/15/20/30), difficulty (Easy/Medium/Hard), topics (checkbox list), balance mode (Random/Balanced). Mặc định là 20 câu (Standard). |
| `src/features/quiz/client/quiz.client.ts` | Sửa `fetchQuestions` hỗ trợ array type + limit + balance flag |
| `src/app/api/questions/random/route.ts` | Sửa params nhận `types[]`, `limit`, `balance` |
| `src/api/quiz/quiz.service.ts` | Implement Balanced Random: chia đều số câu cho mỗi type |
| `sidebar.constants.ts` | Thêm `custom` topic với sections chỉ gồm `practice` (custom không cần theory) |

**Balance algorithm (service)**:
```
Input: types = [comparison, word-form, verb-tense...], limit = 30
Output: 30 câu chia đều cho các type (5 câu/type nếu 6 type được chọn)
```

**Feature hoàn thành**: User tự tạo quiz theo nhu cầu — đây là tính năng được dùng nhiều nhất.

---

### Phase 5: Smart Random — Ưu tiên điểm yếu

**Mục tiêu**: Dựa trên lịch sử làm bài, engine tự động ưu tiên ra nhiều câu hỏi thuộc topic user yếu hơn.

**Tại sao làm sau Phase 4**: Smart Random cần:
1. Attempt History (Phase 1 đã có)
2. Statistics API (đã có từ đầu)
3. Weak Topic Detection (Phase 2 đã có UI)
4. Weight algorithm (Phase 5 implement)

Nếu chưa có data history thì Smart Random không có ý nghĩa.

**Chi tiết thực hiện**:

```
GET /api/users/stats → { typeStats: { comparison: { total: 10, correct: 9 }, ... } }
  → Tính weight mỗi type: weight = 1 - (correct / total)
  → Normalize weights thành probability distribution
  → Generate câu hỏi theo distribution đó
```

| File | Thay đổi |
|------|----------|
| `src/api/quiz/quiz.service.ts` | Hàm `getWeightedQuestions(userId, params)` — lấy stats → tính weight → filter questions |
| `src/app/api/questions/weighted/route.ts` | API endpoint mới `GET /api/questions/weighted?limit=30` |
| `src/features/quiz/client/quiz.client.ts` | Thêm `fetchWeightedQuestions()` |
| `src/features/quiz/hooks/useQuizQuestions.ts` | Thêm option `weighted: boolean` → dùng API weighted thay vì random |

**Feature hoàn thành**: Hệ thống tự thích ứng với trình độ user — càng làm nhiều, quiz càng thông minh.

---

### Phase 6: Challenge Mode — Timed Test

**Mục tiêu**: Mô phỏng bài thi TOEIC Part 5 thật: giới hạn thời gian, không xem lại, không quay lại câu trước.

**Tại sao làm cuối**: Đây là tính năng cao cấp, cần core QuizEngine đã ổn định + có đủ dữ liệu. Nếu làm sớm, các bug ở QuizEngine sẽ ảnh hưởng đến challenge mode.

**Chi tiết thực hiện**:

| Tính năng | Mô tả |
|-----------|-------|
| **Timer** | 15 phút cho 30 câu (30s/câu), hiển thị countdown, hết giờ tự submit |
| **No Back** | Không cho phép quay lại câu trước |
| **No Instant Feedback** | Không hiện rationale sau mỗi câu, chỉ hiện kết quả sau khi hoàn thành |
| **Scoring** | TOEIC score estimation (dựa trên số câu đúng) |

**UI changes**:
```
ChallengeModeEngine (extends QuizEngine)
  ├── Timer bar (top)
  ├── Question (giống QuizEngine, nhưng disable back navigation)
  ├── No RationaleBox sau mỗi câu
  └── Complete screen: score breakdown + estimated TOEIC score
```

**Feature hoàn thành**: Bài thi thử Part 5 đầy đủ, chuẩn bị cho kỳ thi thật.

---

## 5. Tổng quan Phase và timeline ước tính

| Phase | Nội dung | Files thay đổi | Phụ thuộc | Giá trị |
|-------|----------|----------------|-----------|---------|
| **1** | Core Modes (Quick/Full Test) | 5-6 files | Không | ⭐⭐⭐⭐⭐ |
| **2** | Result Analytics (breakdown theo type) | 2-3 files | Phase 1 | ⭐⭐⭐⭐⭐ |
| **3** | Review + Retry + Save Question | 4-5 files + DB schema | Phase 1, 2 | ⭐⭐⭐⭐☆ |
| **4** | Custom Quiz (config form) | 5-6 files | Phase 1 | ⭐⭐⭐⭐⭐ |
| **5** | Smart Random (weight algorithm) | 3-4 files | Phase 2, data history | ⭐⭐⭐⭐☆ |
| **6** | Challenge Mode (timed test) | 3-4 files | Phase 1 | ⭐⭐⭐⭐☆ |

## 6. Lưu ý kỹ thuật

### 6.1. Balance mode

Khi user chọn Balanced, engine chia đều số câu cho mỗi type được chọn. Nếu số câu không chia hết, phân bố phần dư cho các type ngẫu nhiên.

```
Ví dụ: 30 câu, 4 types → 7-8 câu/type (random dư)
```

### 6.2. Question distribution trong bài làm

Khi user start quiz, một bộ câu hỏi được chọn và cố định cho đến khi hoàn thành hoặc reset. Không thay đổi giữa chừng.

### 6.3. Retry Incorrect + Save Question

- **Retry Incorrect**: Tạo một subset của question list hiện tại (chỉ các câu sai). QuizEngine restart với subset này. Không cần API gì thêm.
- **Save Question**: Cần DB, cần API CRUD, và cần module Saved Questions trong sidebar để hiển thị.

### 6.4. Import Dialog

Import hoạt động client-side. Parse JSON từ AI → render ngay. Không lưu vào DB. Phù hợp Phase 1-4, nhưng đến Phase 3 (Save Question) cần mở rộng để lưu được.

---

## 7. Câu hỏi mở

1. **Timer có nên là optional setting** trong các mode thường (không chỉ Challenge) không?
2. **Save Question** có nên cho phép user tự nhập câu hỏi và lưu vào DB không (từ ImportDialog)?
3. **Balanced random** có nên áp dụng mặc định cho Full Test không?

---

*Document này được tạo ngày 12/07/2026, dựa trên phân tích codebase và thảo luận với product owner.*
