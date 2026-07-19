# Data Model Redesign — TOEIC Reading Schema

> Phân tích các vấn đề của data model hiện tại và đề xuất kiến trúc mới
> có khả năng mở rộng cho toàn bộ bài thi TOEIC (Parts 1-7).

---

## Mục lục

1. [Hiện trạng](#1-hiện-trạng)
2. [Vấn đề 1: Prisma Schema chỉ support Part 5](#2-vấn-đề-1-prisma-schema-chỉ-support-part-5)
3. [Vấn đề 2: `questionText` bị nhồi quá nhiều trách nhiệm](#3-vấn-đề-2-questiontext-bị-nhồi-quá-nhiều-trách-nhiệm)
4. [Vấn đề 3: KNOWLEDGE_GROUPS Part 7 sai bản chất](#4-vấn-đề-3-knowledge_groups-part-7-sai-bản-chất)
5. [Vấn đề 4: Part 5 còn thiếu nhóm ngữ pháp](#5-vấn-đề-4-part-5-còn-thiếu-nhóm-ngữ-pháp)
6. [Vấn đề 5: Part 6 thiếu nhóm Transition/Cohesion](#6-vấn-đề-5-part-6-thiếu-nhóm-transitioncohesion)
7. [Vấn đề 6: Frontend không phân biệt render Part 5/6/7](#7-vấn-đề-6-frontend-không-phân-biệt-render-part-567)
8. [Vấn đề 7: Import JSON format thiếu cấu trúc passage](#8-vấn-đề-7-import-json-format-thiếu-cấu-trúc-passage)
9. [Vấn đề 8: AI Prompt chưa tối ưu cho Part 6/7](#9-vấn-đề-8-ai-prompt-chưa-tối-ưu-cho-part-67)
10. [Đề xuất kiến trúc tổng thể](#10-đề-xuất-kiến-trúc-tổng-thể)
11. [Lộ trình triển khai](#11-lộ-trình-triển-khai)

---

## 1. Hiện trạng

### 1.1 Prisma Schema hiện tại

```prisma
enum QuestionType {
  WORD_FORM
  VOCABULARY
  VERB_TENSE
  PREPOSITION
  CONJUNCTION
  PARTICIPLE
  VOICE
  RELATIVE_CLAUSE
  COMPARISON
  AGREEMENT
}

model Question {
  id           String         @id
  questionText String          // chứa tất cả: passage + blank + question
  type         QuestionType    // Chỉ có Part 5 types
  part         Int?            // ❌ Không có
  passageText  String?         // ❌ Không có
  ...
}
```

### 1.2 Import JSON hiện tại

```json
// Part 6
{ "part": 6, "type": "sentence-insertion",
  "questionText": "The conference... ______ Attendees are... What word best fits?",
  "options": [] }

// Part 7
{ "part": 7, "type": "single-passage",
  "questionText": "Memo from HR:\n...\n\nWhat is the main purpose?",
  "options": [] }
```

### 1.3 Frontend render

```tsx
// QuestionCard.tsx — tất cả Part đều render giống nhau
<p>{question.questionText}</p>
```

---

## 2. Vấn đề 1: Prisma Schema chỉ support Part 5

### Thiếu gì

| Field | Lý do cần |
|-------|-----------|
| `part` field | Không thể query/filter theo part nếu không có. Hiện tại suy luận part từ type ở tầng application — dễ sai. |
| `QuestionType` enum values cho Part 6/7 | Không thể lưu Part 6/7 question vào DB. Block toàn bộ việc mở rộng question bank. |
| `passageText` / `passages` field | Phải lưu passage riêng, không thể nhét vào `questionText` được nữa. |

### Hậu quả

- `data/questions.json` chỉ chứa được Part 5 (1665 câu)
- AI-generated questions Part 6/7 chỉ tồn tại trong temp-session (localStorage), không lưu DB được
- `getRandomQuestions()` chỉ query được Part 5
- Presets Part 6/7 trong `session-builder/presets/` không thể lấy data từ DB

### Cần thêm vào QuestionType enum

```
Part 5 (hiện tại 10 → cần 16):
  WORD_FORM              (giữ)
  VOCABULARY             (giữ)
  VERB_TENSE             (giữ)
  PREPOSITION            (giữ)
  CONJUNCTION            (giữ)
  PARTICIPLE             (giữ)
  VOICE                  (giữ)
  RELATIVE_CLAUSE        (giữ)
  COMPARISON             (giữ)
  AGREEMENT              (giữ)
  MODAL_VERBS            (thêm)
  CONDITIONALS           (thêm)
  INFINITIVE_GERUND      (thêm)
  PARALLEL_STRUCTURE     (thêm)
  PRONOUN                (thêm)
  DETERMINER_QUANTIFIER  (thêm)

Part 6 (thêm mới → 4 types):
  SENTENCE_INSERTION
  GRAMMAR
  VOCABULARY
  TRANSITION

Part 7 (thêm mới → 7 types — đây là question skill):
  MAIN_IDEA
  DETAIL
  INFERENCE
  VOCABULARY_IN_CONTEXT
  REFERENCE
  INTENTION
  NOT_QUESTION
```

---

## 3. Vấn đề 2: `questionText` bị nhồi quá nhiều trách nhiệm

| Part | `questionText` đang chứa | Vấn đề |
|------|--------------------------|--------|
| 5 | `"The management ______ a new strategy."` | ✅ OK |
| 6 | Passage + blank + question instruction | ❌ |
| 7 | Passage + question text | ❌ |

### Vấn đề cụ thể

1. **Frontend phải parse string thủ công** — `split("______")`, `split("\n\n")`
2. **Không thể render split-panel** cho Part 7
3. **Double/Triple passage không thể phân tách** — không biết đâu là Passage A/B
4. **1 passage → nhiều câu hỏi là bất khả thi** — trùng lặp dữ liệu

---

## 4. Vấn đề 3: KNOWLEDGE_GROUPS Part 7 sai bản chất

### Phân tích

```
KNOWLEDGE_GROUPS[7] = [
  { type: 'single-passage', label: 'Single Passage' },
  { type: 'double-passage', label: 'Double Passage' },
  { type: 'triple-passage', label: 'Triple Passage' },
]
```

`single/double/triple-passage` là **passage type** (hình thức đoạn đọc). Không phải **knowledge group**.

ETS Part 7 kiểm tra các kỹ năng: Main Idea, Detail, Inference, Reference, Vocabulary in Context...

### Hậu quả

| Scenario | Hiện tại | Đúng |
|----------|----------|------|
| Học viên sai 10 câu | Biết yếu `single-passage` (vô nghĩa) | Biết yếu `inference` + `reference` (có actionable insight) |
| Sinh đề | "Tạo 10 câu single-passage" | "Tạo 7 câu: 3 detail, 2 inference, 2 main-idea" |
| Thống kê | Tỉ lệ đúng theo passage type | Tỉ lệ đúng theo skill → phát hiện điểm yếu |

### Giải pháp: Tách thành 2 trục hoàn toàn độc lập

```json
{
  "part": 7,
  "passageType": "single",
  "questionType": "inference",
  ...
}
```

**Passage type** — số lượng đoạn văn, không phải kỹ năng:

```
single | double | triple
```

**Question type (question skill)** — kỹ năng đọc mà câu hỏi kiểm tra:

```
main-idea | detail | inference | vocabulary-in-context |
reference | intention | not-question
```

---

## 5. Vấn đề 4: Part 5 còn thiếu nhóm ngữ pháp

### Phân tích

ETS Part 5 không chỉ có 10 dạng như hiện tại. Còn thiếu các nhóm:

| Nhóm thiếu | Ví dụ | Tại sao không gộp được |
|------------|-------|------------------------|
| Modal Verbs | `The report ______ be submitted by Friday.` (must/should/can/will) | Không phải verb-tense, không phải word-form |
| Conditionals | `If the team ______ earlier, we would have met the deadline.` (had started/started) | Cấu trúc riêng (if clause + main clause) |
| Infinitive & Gerund | `We decided ______ the contract.` (to sign/signing/sign) | Verb patterns riêng |
| Parallel Structure | `The training focuses on communication, leadership, ______.` (and problem-solving/or problem-solving) | Cấu trúc song song — không thuộc conjunction thuần túy |
| Pronoun | `Each department must submit ______ report by Friday.` (its/their/his) | Không phải agreement (each + singular verb khác với each + pronoun) |
| Determiner / Quantifier | `There are ______ applicants than positions available.` (fewer/less/more) | Lượng từ — không thuộc comparison hay vocabulary |

### Cần thêm

```typescript
P5_GROUP.MODAL_VERBS = 'modal-verbs'
P5_GROUP.CONDITIONALS = 'conditionals'
P5_GROUP.INFINITIVE_GERUND = 'infinitive-gerund'
P5_GROUP.PARALLEL_STRUCTURE = 'parallel-structure'
P5_GROUP.PRONOUN = 'pronoun'
P5_GROUP.DETERMINER_QUANTIFIER = 'determiner-quantifier'
```

---

## 6. Vấn đề 5: Part 6 thiếu nhóm Transition/Cohesion

### ETS Part 6 thực tế có 4 dạng

| Dạng | Ví dụ | Codebase hiện tại |
|------|-------|-------------------|
| Grammar | `The report ______ yesterday.` | ✅ SENTENCE_INSERTION + GRAMMAR (gộp chung) |
| Vocabulary | `The company decided to ______ the policy.` | ✅ VOCABULARY |
| Sentence Insertion | Chọn câu điền vào blank trong đoạn | ✅ SENTENCE_INSERTION |
| **Transition / Cohesion** | `______, sales increased. However, costs rose.` | ❌ **Thiếu** |

### Tại sao Transition không thể gộp vào Vocabulary?

```
However = từ vựng → học viên biết nghĩa
Therefore = từ vựng → học viên biết nghĩa

Học viên biết cả 2 từ nhưng vẫn chọn sai.

→ Câu hỏi không kiểm tra từ vựng.
→ Nó kiểm tra quan hệ logic giữa 2 câu.
→ Đây là kỹ năng riêng: Transition / Discourse Marker / Cohesion.
```

### Cần thêm

```typescript
P6_GROUP.TRANSITION = 'transition'
```

---

## 7. Vấn đề 6: Frontend không phân biệt render Part 5/6/7

### Code hiện tại

```tsx
// QuestionCard.tsx — 1 đường render duy nhất cho tất cả Part
<p className="font-serif ...">{question.questionText}</p>
```

### Vấn đề

| Part | Cần render | Hiện tại |
|------|-----------|----------|
| 5 | 1 câu + `______` highlight | ✅ Tạm ổn |
| 6 | Passage từng câu + blank highlight + question riêng | ❌ Dính 1 `<p>` |
| 7 | Passage (split-panel) + question riêng | ❌ Dính 1 `<p>` |

### Cần implement

**Part 6** — `Part6QuestionCard`:

```
┌──────────────────────────────┐
│ [Type Badge] [Passage Badge] │
│                              │
│  The conference will be      │
│  held in March.              │
│  [________]  ← blank render  │
│  Attendees are encouraged    │  riêng
│  to register early.          │
│                              │
│  "Which sentence best fits?" │
│                              │
│  [A] Therefore,              │
│  [B] In addition,  ← options │
│  [C] However,                │
│  [D] Otherwise,              │
└──────────────────────────────┘
```

**Part 7** — `Part7QuestionCard` với split-panel:

```
┌──────────────────┬─────────────────────┐
│  PASSAGE         │  QUESTION           │
│                  │                     │
│  Memo from HR:   │  What is the main   │
│  All employees   │  purpose of this    │
│  are reminded    │  memo?              │
│  that the health │                     │
│  insurance       │  [A] To announce    │
│  enrollment      │  [B] To inform...   │
│  ends Nov 30.    │  [C] To introduce   │
│                  │  [D] To schedule    │
│  [[P1]] [[P2]]   │                     │
└──────────────────┴─────────────────────┘
```

---

## 8. Vấn đề 7: Import JSON format thiếu cấu trúc passage

### Phân tích

```typescript
// validation.ts — chỉ check questionText là string
if (!isValidString(item.questionText)) {
  errors.push({ message: `thiếu "questionText".` })
}
```

Không có `passageText`, `passages`, `passageType` → không thể validate hay lưu passage riêng.

### Import JSON format mới

**Part 6** — passage là array of sections, blank là object:

```json
{
  "part": 6,
  "passageType": "email",
  "questionType": "sentence-insertion",
  "difficulty": "MEDIUM",
  "passages": [
    {
      "id": "P1",
      "title": "Email to Staff",
      "content": [
        { "type": "text", "value": "The conference will be held in March." },
        { "type": "blank" },
        { "type": "text", "value": "Attendees are encouraged to register early." },
        { "type": "text", "value": "The early bird discount ends on February 15." }
      ]
    }
  ],
  "questionText": "Which sentence best fits the blank?",
  "options": [
    { "id": "A", "text": "Therefore,", "order": 1, "rationale": "..." },
    { "id": "B", "text": "In addition,", "order": 2, "rationale": "..." },
    { "id": "C", "text": "However,", "order": 3, "rationale": "..." },
    { "id": "D", "text": "Otherwise,", "order": 4, "rationale": "..." }
  ],
  "correctOptionId": "B",
  "rationale": "'In addition,' correctly introduces registration as additional detail.",
  "metadata": {
    "topic": "business",
    "source": "AI",
    "estimatedTime": 30
  }
}
```

**Part 7 Single Passage**:

```json
{
  "part": 7,
  "passageType": "single",
  "questionType": "main-idea",
  "difficulty": "MEDIUM",
  "passages": [
    {
      "id": "P1",
      "title": "Memo from HR",
      "content": [
        { "type": "text", "value": "All employees are reminded that the annual health insurance enrollment period ends on November 30." }
      ]
    }
  ],
  "questionText": "What is the main purpose of this memo?",
  "options": [
    { "id": "A", "text": "To announce a new product launch", "order": 1, "rationale": "..." },
    { "id": "B", "text": "To inform employees about policy changes", "order": 2, "rationale": "..." },
    { "id": "C", "text": "To introduce a new team member", "order": 3, "rationale": "..." },
    { "id": "D", "text": "To schedule a company meeting", "order": 4, "rationale": "..." }
  ],
  "correctOptionId": "B",
  "rationale": "The passage discusses updated workplace policies.",
  "metadata": {
    "topic": "HR",
    "source": "ETS",
    "estimatedTime": 75
  }
}
```

**Part 7 Double Passage** — `passages` array có 2 phần tử:

```json
{
  "part": 7,
  "passageType": "double",
  "questionType": "inference",
  "difficulty": "HARD",
  "passages": [
    {
      "id": "A",
      "title": "Email from Ms. Chen",
      "content": [
        { "type": "text", "value": "Dear Mr. Park, I am writing to confirm our meeting on Friday..." }
      ]
    },
    {
      "id": "B",
      "title": "Mr. Park's Reply",
      "content": [
        { "type": "text", "value": "Dear Ms. Chen, Thank you for your email. I have reviewed the proposal..." }
      ]
    }
  ],
  "questionText": "What can be inferred about Mr. Park?",
  "options": [ ... ],
  "correctOptionId": "C",
  "rationale": "...",
  "metadata": { "topic": "business", "source": "AI", "estimatedTime": 90 }
}
```

### Giải thích field

| Field | Bắt buộc | Mô tả |
|-------|----------|-------|
| `part` | ✅ | 5, 6, hoặc 7 |
| `passageType` | ✅ Part 6/7, ❌ Part 5 | `single`, `double`, `triple` (Part 7) / `email`, `memo`, `notice`, `announcement`, `article` (Part 6 optional) |
| `questionType` | ✅ | Loại kỹ năng (xem KNOWLEDGE_GROUPS) |
| `difficulty` | ✅ | EASY, MEDIUM, HARD (UPPERCASE) |
| `passages` | ✅ Part 6/7, ❌ Part 5 | Array of passage objects |
| `passages[].id` | khuyến khích | Định danh passage (P1, A, B...) |
| `passages[].title` | optional | Tiêu đề passage (e.g., "Email from HR") |
| `passages[].content` | ✅ | Array of content blocks |
| `passages[].content[].type` | ✅ | `text`, `blank`, `image`, `table` (về sau) |
| `passages[].content[].value` | nếu type=text | Nội dung text |
| `questionText` | ✅ | CHỈ câu hỏi, không chứa passage |
| `options` | ✅ | Array 4 options |
| `options[].id` | ✅ | A, B, C, D |
| `options[].text` | ✅ | Nội dung lựa chọn |
| `options[].isCorrect` | optional | Dùng khi import để validate, có thể bỏ nếu dùng `correctOptionId` |
| `options[].rationale` | khuyến khích | Giải thích tiếng Việt |
| `correctOptionId` | ✅ | Single source of truth cho đáp án đúng |
| `rationale` | optional | Giải thích tổng thể cho câu hỏi |
| `metadata` | optional | `{ topic, source, estimatedTime }` |

### Về `isCorrect` vs `correctOptionId`

**Giữ cả 2** vì chúng có mục đích khác nhau:

| Field | Mục đích |
|-------|----------|
| `isCorrect` | Dùng trong **import validation**: kiểm tra import có đúng 1 đáp án đúng không, và để hệ thống tự suy ra `correctOptionId` nếu người dùng không cung cấp |
| `correctOptionId` | **Single source of truth** trong runtime: frontend dùng `option.id === correctOptionId` để xác định đáp án đúng. Không cần loop tìm option.isCorrect |

**Validator sẽ ưu tiên `correctOptionId`** khi có cả 2. Nếu conflict (`correctOptionId: "B"` nhưng `A.isCorrect = true`) → báo lỗi import.

---

## 9. Vấn đề 8: AI Prompt chưa tối ưu cho Part 6/7

### Hiện tại

Prompt yêu cầu AI nhồi passage + question vào `questionText`:

```
"questionText": "Memo from HR:\nAll employees...\n\nWhat is the main purpose..."
```

### Hậu quả

- Format không consistent giữa các lần sinh
- Frontend không biết đâu là passage, đâu là question
- Double/triple passage không thể tách

### Giải pháp

Prompt cần yêu cầu AI xuất cấu trúc rõ ràng:

```
"passages": [{ "content": [...], "title": "..." }],
"questionText": "What is the main purpose?"
```

---

## 10. Đề xuất kiến trúc tổng thể

### 10.1 Prisma Schema

```prisma
enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum PassageFormat {
  SINGLE
  DOUBLE
  TRIPLE
}

enum QuestionType {
  // Part 5 — Grammar & Vocabulary
  WORD_FORM
  VOCABULARY
  VERB_TENSE
  PREPOSITION
  CONJUNCTION
  PARTICIPLE
  VOICE
  RELATIVE_CLAUSE
  COMPARISON
  AGREEMENT
  MODAL_VERBS
  CONDITIONALS
  INFINITIVE_GERUND
  PARALLEL_STRUCTURE
  PRONOUN
  DETERMINER_QUANTIFIER

  // Part 6 — Text Completion
  SENTENCE_INSERTION
  GRAMMAR
  TRANSITION

  // Part 7 — Reading Skills
  MAIN_IDEA
  DETAIL
  INFERENCE
  VOCABULARY_IN_CONTEXT
  REFERENCE
  INTENTION
  NOT_QUESTION
}

model Passage {
  id             String         @id
  passageGroupId String?        // gom double/triple passages thành 1 nhóm
  order          Int            @default(0)  // thứ tự trong group (A=0, B=1, C=2)
  title          String?
  part           Int            // 6 hoặc 7
  passageFormat  PassageFormat  @default(SINGLE)
  metadata       Json?          // { topic, source, estimatedTime }

  questions      Question[]
}

model Question {
  id           String         @id
  part         Int            // 5, 6, 7
  questionType QuestionType
  passageId    String?
  passage      Passage?       @relation
  questionText String          // CHỈ chứa câu hỏi thật
  difficulty   Difficulty
  source       QuestionSource @default(MANUAL)
  hint         String?
  note         String?
  isActive     Boolean        @default(true)
  timesUsed    Int            @default(0)

  options       Option[]
  attempts      Attempt[]
  tags          QuestionTag[]

  @@map("questions")
}

model Option {
  id         String  @id
  text       String
  isCorrect  Boolean
  rationale  String
  order      Int     @default(0)
  questionId String

  question Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@index([questionId])
  @@map("options")
}
```

### 10.2 KNOWLEDGE_GROUPS

```typescript
KNOWLEDGE_GROUPS: Record<number, { type: string; label: string }[]> = {
  5: [
    { type: P5_GROUP.WORD_FORM, label: 'Word Form' },
    { type: P5_GROUP.VOCABULARY, label: 'Vocabulary' },
    { type: P5_GROUP.VERB_TENSE, label: 'Verb Tense' },
    { type: P5_GROUP.PREPOSITION, label: 'Preposition' },
    { type: P5_GROUP.CONJUNCTION, label: 'Conjunction' },
    { type: P5_GROUP.PARTICIPLE, label: 'Participle' },
    { type: P5_GROUP.VOICE, label: 'Voice' },
    { type: P5_GROUP.RELATIVE_CLAUSE, label: 'Relative Clause' },
    { type: P5_GROUP.COMPARISON, label: 'Comparison' },
    { type: P5_GROUP.AGREEMENT, label: 'Agreement' },
    { type: P5_GROUP.MODAL_VERBS, label: 'Modal Verbs' },
    { type: P5_GROUP.CONDITIONALS, label: 'Conditionals' },
    { type: P5_GROUP.INFINITIVE_GERUND, label: 'Infinitive & Gerund' },
    { type: P5_GROUP.PARALLEL_STRUCTURE, label: 'Parallel Structure' },
    { type: P5_GROUP.PRONOUN, label: 'Pronoun' },
    { type: P5_GROUP.DETERMINER_QUANTIFIER, label: 'Determiner / Quantifier' },
  ],
  6: [
    { type: P6_GROUP.SENTENCE_INSERTION, label: 'Sentence Insertion' },
    { type: P6_GROUP.GRAMMAR, label: 'Grammar' },
    { type: P6_GROUP.VOCABULARY, label: 'Vocabulary' },
    { type: P6_GROUP.TRANSITION, label: 'Transition / Cohesion' },
  ],
  7: [
    { type: P7_GROUP.MAIN_IDEA, label: 'Main Idea / Purpose' },
    { type: P7_GROUP.DETAIL, label: 'Detail' },
    { type: P7_GROUP.INFERENCE, label: 'Inference' },
    { type: P7_GROUP.VOCABULARY, label: 'Vocabulary in Context' },
    { type: P7_GROUP.REFERENCE, label: 'Reference' },
    { type: P7_GROUP.INTENTION, label: 'Intention / Next Step' },
    { type: P7_GROUP.NOT_QUESTION, label: 'NOT / Exception' },
  ],
}
```

### 10.3 Mối quan hệ giữa các khái niệm

```
Question
├── part (5 | 6 | 7)
├── questionType (kỹ năng: inference, detail, word-form...)
├── passageId (FK → Passage, null với Part 5)
│
Passage
├── passageFormat (single | double | triple)  ← Part 7
├── passageType (email | memo | notice...)     ← Part 6 optional
├── passageGroupId (gom A+B+C cho double/triple)
│
Metadata (optional)
├── topic (business, HR, travel, finance...)
├── source (ETS, AI, ADMIN_IMPORT...)
├── estimatedTime (giây)

Không phải là quan hệ:
  part 7 + single-passage  → ❌ đây là passageFormat, không phải questionType
  part 6 + sentence-insertion → ✅ đây là questionType
```

### 10.4 File cần thay đổi

| File | Thay đổi |
|------|----------|
| `prisma/schema.prisma` | Thêm Part field, mở rộng QuestionType enum, thêm Passage model |
| `src/features/session-builder/constants/knowledge-groups.ts` | Thêm P5 types mới, TRANSITION, P7 skill types, thêm passageFormat constants |
| `src/features/session-builder/constants/import-template.ts` | Format mới với passages[], content blocks, metadata |
| `src/features/session-builder/utils/validation.ts` | Validate passages, passageType, content blocks |
| `src/features/session-builder/utils/prompt-suggest.ts` | Prompt AI xuất cấu trúc mới |
| `src/features/session-builder/presets/part5.presets.ts` | Thêm distribution cho 6 nhóm mới |
| `src/features/session-builder/presets/part6.presets.ts` | Thêm transition distribution |
| `src/features/session-builder/presets/part7.presets.ts` | Đổi thành skill-based distribution |
| `src/features/quiz/components/QuestionCard.tsx` | Tách render theo part |
| `src/features/quiz/types.ts` | Thêm passage fields |
| `prisma/seed.ts` | Seed Part 6/7 mẫu |

---

## 11. Lộ trình triển khai

### Phase 1 — Unblock DB (critical)

| Task | File | Ghi chú |
|------|------|---------|
| Thêm 6 Part 5 question types vào enum | `schema.prisma` | MODAL_VERBS, CONDITIONALS, INFINITIVE_GERUND, PARALLEL_STRUCTURE, PRONOUN, DETERMINER_QUANTIFIER |
| Thêm Part 6/7 types vào enum | `schema.prisma` | SENTENCE_INSERTION, GRAMMAR, TRANSITION, MAIN_IDEA... |
| Thêm `part` field vào Question model | `schema.prisma` | Int, required |
| Thêm `passageText` optional field | `schema.prisma` | String?, để migrate dần |
| Chạy migration | `pnpm db:migrate` | |
| Cập nhật `typeToPart` map | constants | Part 5 types mới + Part 6/7 types |
| Cập nhật seed script | `prisma/seed.ts` | Thêm Part 6/7 seed data mẫu |

### Phase 2 — Sửa semantic (important)

| Task | File |
|------|------|
| Thêm 6 P5_GROUP constants mới | `knowledge-groups.ts` |
| Thêm P6_GROUP.TRANSITION | `knowledge-groups.ts` |
| Đổi P7_GROUP thành skill types (main-idea, detail...) | `knowledge-groups.ts` |
| Thêm `PassageFormat` enum + `Passage` model | `schema.prisma` |
| Thêm `metadata` Json field vào Passage | `schema.prisma` |
| Cập nhật Part 5 presets thêm 6 nhóm mới | `part5.presets.ts` |
| Cập nhật Part 6 presets thêm transition | `part6.presets.ts` |
| Cập nhật Part 7 presets dùng skill type | `part7.presets.ts` |

### Phase 3 — Tách passage ra khỏi questionText (breaking change)

| Task | File |
|------|------|
| Viết import template mới với passages[] + content blocks | `import-template.ts` |
| Cập nhật `parseImportedSessionJSON()` validate passages | `validation.ts` |
| Cập nhật `SessionQuestion` type thêm passages field | `temp-session/types/session.ts` |
| Tạo `Part5QuestionCard` (giữ nguyên + highlight `______`) | `quiz/components/` |
| Tạo `Part6QuestionCard` (passage sections + blank) | `quiz/components/` |
| Tạo `Part7QuestionCard` (split-panel) | `quiz/components/` |
| Cập nhật `QuestionCard` routing theo part | `QuestionCard.tsx` |
| Cập nhật AI prompt format | `prompt-suggest.ts` |

### Phase 4 — Nâng cao (nice to have)

| Task | File | Ghi chú |
|------|------|---------|
| Tạo Passage model riêng + relation | `schema.prisma` | Passage → Question 1-n |
| Group passages (double/triple) | `schema.prisma` | `passageGroupId` |
| Support 1 passage → nhiều questions | `quiz.service.ts` | Query questions by passageId |
| Split-panel layout cho Part 7 | `Part7QuestionCard.tsx` | CSS grid / flexbox |
| Double/triple passage tabs | `Part7QuestionCard.tsx` | Tab switching or side-by-side |
| Passage render cho `content` blocks: image, table | `Part6QuestionCard.tsx` | Expand content block types |

### Rủi ro

| Rủi ro | Mức độ | Giảm thiểu |
|--------|--------|------------|
| Breaking change khi đổi import JSON format | Cao | Giữ backward compat: nếu không có `passages`, fallback về parse `questionText` |
| Migration data Part 5 cũ sang part field mới | Trung bình | Script update một lần |
| Frontend components Part 6/7 chưa từng có | Thấp | Phát triển từ từ, Phase 3 mới làm |
| Prisma migration có thể conflict với data cũ | Trung bình | Test trên staging trước |

---

## Tóm tắt: Trước và Sau

| Khía cạnh | Trước | Sau |
|-----------|-------|-----|
| Part 5 question types | 10 | 16 (+6) |
| Part 6 question types | 3 (thiếu Transition) | 4 (đủ) |
| Part 7 question types | single/double/triple (sai) | main-idea/detail/inference/... (đúng) |
| `passageType` | gộp vào `type` | field riêng (single/double/triple) |
| `questionText` chứa | passage + blank + question | CHỈ câu hỏi |
| Lưu passage | Không có | `passages[]` trong JSON + Passage model trong DB |
| Passage content | String thô | Array of content blocks (text, blank, image...) |
| Metadata | Không có | `{ topic, source, estimatedTime }` |
| Frontend Part 7 render | 1 `<p>` dính nhau | Split-panel passage + question |
| DB lưu được Part 6/7 | ❌ Không | ✅ Có |
| Thống kê kỹ năng đọc | ❌ Không | ✅ Theo từng skill |
| Difficulty | "medium" / "MEDIUM" lẫn | ✅ EASY / MEDIUM / HARD (UPPERCASE) |
| `isCorrect` + `correctOptionId` | Cả 2, không rõ vai trò | Cả 2, có mục đích riêng, validator check consistency |
