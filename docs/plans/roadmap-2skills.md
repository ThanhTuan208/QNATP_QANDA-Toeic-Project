# Lộ trình mở rộng: TOEIC Reading → Reading + Listening

> Mục tiêu: biến project từ luyện thi TOEIC Reading (Part 5, 6) thành nền tảng đầy đủ 2 kỹ năng Reading và Listening.

---

## Giai đoạn 1 — Nền tảng Listening (Core)

### 1.1 Database & Schema

**File:** `prisma/schema.prisma`

- [ ] Thêm enum values cho `QuestionType`:
  - `LISTENING_PART_1` (Photographs)
  - `LISTENING_PART_2` (Question-Response)
  - `LISTENING_PART_3` (Conversations)
  - `LISTENING_PART_4` (Talks)
- [ ] `Question` model: thêm `audioUrl` (String?), `imageUrl` (String?), `transcript` (String?)
- [ ] Model mới `QuestionGroup`: gom nhiều question chung 1 audio/passage (Part 3, 4)
  - `id`, `audioUrl`, `transcript`, `type` (LISTENING_PART_3 | LISTENING_PART_4)
  - relation 1-n tới `Question`

### 1.2 Constants & Navigation

**File:** `src/constants/sidebar.constants.ts`
- [ ] Tạo `listeningTopics`: 4 topics (part-1 → part-4), mỗi topic icon `Headphones`
- [ ] Thêm module `listening` vào `practiceModules`

**File:** `src/constants/header.constants.ts`
- [ ] Thêm mục Listening vào dropdown "Luyện tập"

**File:** `src/constants/index.constants.ts`
- [ ] Thêm `TYPE_LABEL_MAP` cho listening parts
- [ ] Thêm `TYPE_SLUG_MAP_ENG`
- [ ] Thêm `TYPE_LABEL_MAP_VIETNAM`

**File:** `src/features/quiz/constants.ts`
- [ ] Thêm `TYPE_CONTEXT` cho 4 parts
- [ ] Thêm 4 part slugs vào `VALID_QUIZ_TYPES`

### 1.3 Types

**File:** `src/features/quiz/types.ts`
- [ ] `Question`: thêm optional `audioUrl`, `imageUrl`, `transcript`
- [ ] Thêm type `QuestionGroup`
- [ ] `FetchQuestionsParams`: thêm optional `skill`

---

## Giai đoạn 2 — Components & Data

### 2.1 Audio Component

**File mới:** `src/features/listening/components/AudioPlayer/AudioPlayer.tsx`
- [ ] Play / Pause
- [ ] Progress bar (seekable)
- [ ] Speed control (0.75x, 1x, 1.25x, 1.5x)
- [ ] Hiển thị thời gian

### 2.2 Listening Question Components

- [ ] `ListeningQuestionCard` — kế thừa `QuestionCard`, render:
  - Part 1: image + audio + options
  - Part 2: audio + options
  - Part 3/4: audio + passage + 3 questions
- [ ] `ImageDisplay` — full-width image cho Part 1
- [ ] `PassageDisplay` — transcript/passage text cho Part 3/4

### 2.3 Quiz Engine mở rộng

**File:** `src/features/quiz/components/QuizEngine/QuizEngine.tsx`
- [ ] Kiểm tra `type` prefix: nếu là `listening-*` → render `ListeningQuestionCard` thay vì `QuestionCard`
- [ ] Xử lý group questions (Part 3/4): hiển thị nhiều câu hỏi cùng lúc cho 1 audio

### 2.4 Data

- [ ] File mới `data/listening.json` — cấu trúc:
  - Part 1: `{ "type": "listening-part-1", "imageUrl": "...", "audioUrl": "...", "question": "...", "options": [...], "code": "L1_001" }`
  - Part 2: `{ "type": "listening-part-2", "audioUrl": "...", "question": "...", "options": [...], "code": "L2_001" }`
  - Part 3/4: `{ "type": "listening-part-3", "audioUrl": "...", "passage": "...", "questions": [{ "question": "...", "options": [...], "code": "L3_001" }, ...], "code": "L3_GROUP_001" }`
- [ ] Cập nhật `load-questions.utils.ts` hỗ trợ load từ listening.json

---

## Giai đoạn 3 — Lý thuyết & Dashboard

### 3.1 Theory Content

**File:** `src/features/quiz/utils/theory.utils.tsx`
- [ ] Thêm theory cho 4 listening parts:
  - Part 1: phân tích ảnh, từ vựng mô tả, bẫy thường gặp
  - Part 2: Wh-questions, Yes/No questions, câu đề nghị/lịch sự
  - Part 3: xác định speaker, ngữ cảnh, ý chính, chi tiết
  - Part 4: thông tin tổng quát, chi tiết, suy luận, giọng nói

### 3.2 Dashboard

- [ ] `StatsData`: thêm field `skill` (`reading` | `listening`)
- [ ] API stats endpoint: phân loại thống kê theo skill
- [ ] Dashboard: tab riêng Reading / Listening hoặc chart chia 2 cột

---

## Giai đoạn 4 — Hoàn thiện

### 4.1 API

- [ ] `GET /api/questions/random`: thêm param `skill` filter
- [ ] `GET /api/stats`: trả về stats phân theo skill
- [ ] Endpoint mới `GET /api/listening/audio/[id]`: serve audio files

### 4.2 UX

- [ ] Auto-play audio khi vào câu hỏi
- [ ] Shortcut keys (Space để play/pause, 1-4 để chọn đáp án)
- [ ] Timer cho Listening section (tương tự thi thật)

### 4.3 Admin

- [ ] Admin page: import listening questions + upload audio

---

## Tiến độ

| Giai đoạn | Việc | Trạng thái |
|-----------|------|------------|
| 1 | Schema, constants, types | ⏳ Chưa bắt đầu |
| 2 | AudioPlayer, components, data | ⏳ Chưa bắt đầu |
| 3 | Theory, Dashboard | ⏳ Chưa bắt đầu |
| 4 | API, UX, Admin | ⏳ Chưa bắt đầu |
