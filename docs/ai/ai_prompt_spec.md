# AI Prompt Spec — TOEIC Part 5 Question Generator

> Tài liệu này định nghĩa format chuẩn để AI sinh câu hỏi TOEIC Part 5.
> Dùng làm prompt template khi gọi OpenAI / Claude / Gemini.

---

## 1. Prompt Template

```text
You are a TOEIC Part 5 question generator. Generate exactly 1 question about [CHỦ_ĐIỂM].

### Constraints
- Difficulty: [easy | medium | hard]
- Context: business/corporate/office environment (TOEIC-style)
- Output: ONLY valid JSON, no markdown, no explanation

### JSON Format
{
  "question": "... (câu hỏi tiếng Anh, có chỗ trống cần điền)",
  "type": "[word-form | vocabulary | verb-tense | preposition | conjunction | participle | voice | relative-clause | comparison | agreement]",
  "difficulty": "[easy | medium | hard]",
  "options": [
    {
      "text": "đáp án A",
      "isCorrect": false,
      "rationale": "Giải thích bằng tiếng Việt, ngắn gọn, chỉ rõ lỗi sai"
    },
    {
      "text": "đáp án B",
      "isCorrect": true,
      "rationale": "Giải thích bằng tiếng Việt, ngắn gọn, chỉ rõ tại sao đúng"
    },
    {
      "text": "đáp án C",
      "isCorrect": false,
      "rationale": "Giải thích bằng tiếng Việt, ngắn gọn, chỉ rõ lỗi sai"
    },
    {
      "text": "đáp án D",
      "isCorrect": false,
      "rationale": "Giải thích bằng tiếng Việt, ngắn gọn, chỉ rõ lỗi sai"
    }
  ],
  "hint": "Gợi ý ngắn (1 câu) bằng tiếng Việt về cách xác định đáp án"
}

### Rules
1. Exactly 1 correct answer.
2. All 4 options must be plausible (TOEIC-style distractors).
3. Rationale must be in Vietnamese, educational, 1-2 sentences.
4. Use formal business English for the question.
5. Question must be self-contained, no external context needed.
```

---

## 2. Field Specifications

| Field | Kiểu | Bắt buộc | Mô tả |
|-------|------|:--------:|-------|
| `question` | `string` | ✅ | Câu hỏi tiếng Anh, có `___` hoặc chỗ trống in đậm |
| `type` | `enum` | ✅ | Một trong 10 loại: `word-form`, `vocabulary`, `verb-tense`, `preposition`, `conjunction`, `participle`, `voice`, `relative-clause`, `comparison`, `agreement` |
| `difficulty` | `enum` | ✅ | `easy`, `medium`, `hard` |
| `options` | `array[4]` | ✅ | Mảng 4 đối tượng, mỗi đối tượng có `text`, `isCorrect`, `rationale` |
| `options[].text` | `string` | ✅ | Nội dung đáp án |
| `options[].isCorrect` | `boolean` | ✅ | `true` cho 1 đáp án duy nhất |
| `options[].rationale` | `string` | ✅ | Giải thích bằng tiếng Việt |
| `hint` | `string` | ✅ | Gợi ý bằng tiếng Việt, tối đa 1 câu |

---

## 3. Prompt theo từng dạng (Type-specific prompts)

### 3.1 Word Form
```
Generate a TOEIC Part 5 question about WORD FORM.
All 4 options share the same root word but different forms (noun/verb/adj/adv).
The question must test knowing which word class fits the blank.
```
**Ví dụ:** `improve → improvement / improved / improving / improve`

### 3.2 Vocabulary & Collocation
```
Generate a TOEIC Part 5 question about VOCABULARY / COLLOCATION.
All 4 options are different words (different roots).
The question must test natural word combinations in business English.
```
**Collocation mẫu:** `reach a consensus`, `meet a deadline`, `conduct a survey`

### 3.3 Verb Tense
```
Generate a TOEIC Part 5 question about VERB TENSE.
All 4 options are the same verb in different tenses.
Include time markers (since, last year, currently, by next month...).
```
**Thì chính:** Present Perfect, Past Simple, Present Simple, Future, Present Continuous

### 3.4 Prepositions
```
Generate a TOEIC Part 5 question about PREPOSITIONS.
All 4 options are different prepositions (in/on/at/for/to/by/with...).
Test fixed preposition combinations with verbs/nouns/adjectives.
```

### 3.5 Conjunctions & Connectors
```
Generate a TOEIC Part 5 question about CONJUNCTIONS.
Test contrast (although/while/whereas), cause (because/since/due to), 
result (therefore/as a result), or condition (unless/provided that).
```

### 3.6 Participles
```
Generate a TOEIC Part 5 question about PARTICIPLES (V-ing vs V3/ed).
Test active vs passive meaning: V-ing (chủ động) vs V3/ed (bị động).
```

### 3.7 Passive Voice & Causative
```
Generate a TOEIC Part 5 question about PASSIVE VOICE or CAUSATIVE.
Test: be + V3/ed, have/get + O + V3/ed, or linking verb + adj.
```

### 3.8 Relative Clauses
```
Generate a TOEIC Part 5 question about RELATIVE PRONOUNS.
Test: who/whom/which/that/whose/where.
```

### 3.9 Comparisons
```
Generate a TOEIC Part 5 question about COMPARATIVES.
Test: adj-er/more + adj + than, as...as, the...the..., intensifiers (much/far/slightly).
```

### 3.10 Subject-Verb Agreement
```
Generate a TOEIC Part 5 question about SUBJECT-VERB AGREEMENT.
Test: singular vs plural verb with tricky subjects (The number of / Each / Neither...).
```

---

## 4. Ví dụ output hoàn chỉnh

```json
{
  "question": "The marketing team presented a ______ analysis of the campaign results.",
  "type": "word-form",
  "difficulty": "medium",
  "options": [
    {
      "text": "comprehensiveness",
      "isCorrect": false,
      "rationale": "Đây là danh từ. Sau mạo từ 'a' cần một tính từ bổ nghĩa cho 'analysis'."
    },
    {
      "text": "comprehensive",
      "isCorrect": true,
      "rationale": "Chính xác. 'Comprehensive' là tính từ bổ nghĩa cho danh từ 'analysis'."
    },
    {
      "text": "comprehensively",
      "isCorrect": false,
      "rationale": "Đây là trạng từ, không thể bổ nghĩa trực tiếp cho danh từ 'analysis'."
    },
    {
      "text": "comprehend",
      "isCorrect": false,
      "rationale": "Đây là động từ, không phù hợp vị trí sau mạo từ 'a'."
    }
  ],
  "hint": "Xác định loại từ cần điền dựa vào vị trí: mạo từ + ___ + danh từ."
}
```

---

## 5. Batch Generation (tạo nhiều câu cùng lúc)

### Prompt mẫu cho batch 5 câu
```text
You are a TOEIC Part 5 question generator. 
Generate exactly 5 questions about [CHỦ_ĐIỂM].
Output as a JSON array (not wrapped in any object).
Use the format defined above.
```

### Output
```json
[
  { "...question 1..." },
  { "...question 2..." },
  { "...question 3..." },
  { "...question 4..." },
  { "...question 5..." }
]
```

---

## 6. Lưu ý khi review AI output

| Vấn đề | Cách fix |
|--------|---------|
| Rationale quá ngắn / chung chung | Yêu cầu AI giải thích cụ thể lỗi ngữ pháp |
| Câu hỏi không có "than" nhưng dùng so sánh | Kiểm tra logic câu |
| Đáp án đúng không phải duy nhất | Sửa options để chỉ 1 đáp án đúng |
| Tiếng Anh không tự nhiên | Rewrite lại question cho giống ETS thật |
| Thiếu context business | Thêm "Context: business/office/corporate" vào prompt |

---

## 7. Kiến trúc tích hợp (dành cho dev sau này)

```
[UI: Generate Button]
    ↓ click
[Chọn chủ điểm từ dropdown]  
    ↓
[Gọi AI API với prompt template + chủ điểm]
    ↓
[Nhận JSON → Parse → Validate]
    ↓
[Render preview question]
    ↓
[User: "Add to Quiz" hoặc "Regenerate"]
    ↓
[Lưu vào localStorage / Export JSON]
```

> **Ghi chú:** Phần tích hợp AI chưa được implement trong codebase hiện tại.
> Tài liệu này là spec để phát triển sau.
