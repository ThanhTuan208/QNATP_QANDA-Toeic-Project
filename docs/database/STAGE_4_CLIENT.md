# Stage 4: Client — Kết nối Prisma trong code

> File: `src/lib/prisma.ts`

---

## 1. Singleton Pattern

PrismaClient phải là **singleton** — 1 instance duy nhất cho toàn bộ app.

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Tại sao?** Next.js hot reload trong development sẽ tạo lại module mỗi khi code thay đổi. Không có singleton → mỗi lần reload là 1 connection pool mới → database quá tải.

## 2. Các query cơ bản

```typescript
// === READ ===
// Lấy tất cả câu hỏi (kèm options)
const questions = await prisma.question.findMany({
  include: { options: { orderBy: { order: 'asc' } } },
})

// Lấy 1 câu hỏi theo id
const question = await prisma.question.findUnique({
  where: { id: 'abc123' },
  include: { options: true },
})

// Lọc theo type + difficulty
const filtered = await prisma.question.findMany({
  where: {
    type: 'WORD_FORM',
    difficulty: 'MEDIUM',
    isActive: true,
  },
  take: 10,
})

// Random: dùng raw query
const random = await prisma.$queryRaw`SELECT * FROM "Question" ORDER BY RANDOM() LIMIT 10`

// === CREATE ===
// Tạo question + 4 options cùng lúc
await prisma.question.create({
  data: {
    questionText: '...',
    type: 'WORD_FORM',
    options: {
      create: [
        { text: 'A', isCorrect: true, rationale: '...', order: 0 },
        { text: 'B', isCorrect: false, rationale: '...', order: 1 },
      ],
    },
  },
})

// === UPDATE ===
await prisma.question.update({
  where: { id: 'abc123' },
  data: { isActive: false },
})

// === DELETE ===
await prisma.question.delete({ where: { id: 'abc123' } })
```

## 3. Query phức tạp — Aggregation

```typescript
// Đếm số câu đúng/sai theo user
const stats = await prisma.attempt.groupBy({
  by: ['isCorrect'],
  where: { userId: 'user123' },
  _count: { id: true },
})

// Tính accuracy
const total = await prisma.attempt.count({ where: { userId: 'user123' } })
const correct = await prisma.attempt.count({
  where: { userId: 'user123', isCorrect: true },
})
const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
```

## 4. So sánh EF Core LINQ

| Prisma | EF Core LINQ |
|--------|-------------|
| `prisma.question.findMany()` | `context.Questions.ToListAsync()` |
| `prisma.question.findUnique({ where: { id } })` | `context.Questions.FirstOrDefaultAsync(x => x.Id == id)` |
| `prisma.question.findFirst({ where: { type } })` | `context.Questions.Where(x => x.Type == type).FirstOrDefaultAsync()` |
| `include: { options: true }` | `.Include(x => x.Options)` |
| `orderBy: { createdAt: 'desc' }` | `.OrderByDescending(x => x.CreatedAt)` |
| `where: { AND: [ ... ] }` | `.Where(x => x.A > 0 && x.B < 10)` |
| `take: 20, skip: 40` | `.Skip(40).Take(20)` |
| `prisma.$transaction([ ... ])` | `context.Database.BeginTransactionAsync()` |
