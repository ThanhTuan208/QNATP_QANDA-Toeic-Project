# Stage 3: Seed — Import dữ liệu

> File: `prisma/seed.ts`

---

## 1. Seed là gì?

Seed = đổ dữ liệu ban đầu vào database. Trong dự án này:
- Nguồn: `data/questions.json` (33 câu hỏi)
- Đích: PostgreSQL (Question + Option tables)

## 2. Cấu trúc seed

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import questions from '../data/questions.json'

const prisma = new PrismaClient()

async function main() {
  // Xóa dữ liệu cũ
  await prisma.question.deleteMany()

  // Duyệt từng câu hỏi trong JSON
  for (const q of questions) {
    await prisma.question.create({
      data: {
        questionText: q.question,
        type: q.type,        // MAP: 'word-form' → 'WORD_FORM'
        difficulty: q.difficulty,
        hint: q.hint,
        source: 'ADMIN_IMPORT',
        options: {
          create: q.options.map((opt, idx) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            rationale: opt.rationale,
            order: idx,
          })),
        },
      },
    })
  }
}

main()
```

## 3. Chạy seed

```bash
# Cấu hình package.json
# Thêm: "db:seed": "tsx prisma/seed.ts"

pnpm db:seed
```

## 4. Dữ liệu đầu vào

File `data/questions.json` hiện có **33 câu** gồm:

| Dạng | Số câu |
|------|:------:|
| Word Form | 4 |
| Vocabulary | 5 |
| Verb Tense | 3 |
| Preposition | 5 |
| Conjunction | 3 |
| Participle | 3 |
| Voice | 2 |
| Relative Clause | 2 |
| Comparison | 5 |
| Agreement | 2 |

## 5. Mở rộng: thêm câu hỏi mới

```bash
# Cách 1: Sửa data/questions.json + chạy lại seed
pnpm db:seed

# Cách 2: Import qua admin UI (sau này)
# POST /api/questions/bulk-import
```
