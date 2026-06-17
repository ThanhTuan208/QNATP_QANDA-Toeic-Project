# Stage 1: Schema — Định nghĩa Database

> File: `prisma/schema.prisma`

---

## 1. Tổng quan

Schema là **bản thiết kế database**. Mỗi `model` = 1 table. Mỗi field = 1 column.

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │     │ Question │     │   Tag    │
├──────────┤     ├──────────┤     ├──────────┤
│ id       │     │ id       │     │ id       │
│ email    │     │ text     │     │ name     │
│ name     │     │ type     │     └──────────┘
│ role     │     │ difficulty│         │
└────┬─────┘     │ source   │         │
     │           └────┬─────┘         │
     │                │               │
     ▼                ▼               ▼
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Attempt  │     │ Option   │     │ QuestionTag  │
├──────────┤     ├──────────┤     ├──────────────┤
│*userId   │     │*questionId│    │*questionId   │
│*questionId│    │ text     │     │*tagId        │
│ isCorrect│     │ isCorrect│     └──────────────┘
│ timeSpent│     │ rationale│
└──────────┘     └──────────┘
```

## 2. Các model chính

| Model | Mục đích | Quan hệ |
|-------|----------|---------|
| `User` | Người dùng (học viên + admin) | 1-N với Attempt, TestSession |
| `Question` | Câu hỏi TOEIC | 1-N với Option, Attempt |
| `Option` | 4 đáp án + rationale | N-1 với Question |
| `Attempt` | Lịch sử làm bài | N-1 với User, Question |
| `TestSession` | Gom attempts thành bài thi | 1-N với Attempt |
| `Tag` | Phân loại câu hỏi | N-N với Question (qua QuestionTag) |

## 3. Enums

| Enum | Giá trị | Dùng cho |
|------|---------|----------|
| `QuestionType` | 10 dạng Part 5 (WORD_FORM, VOCABULARY...) | Question.type |
| `Difficulty` | EASY, MEDIUM, HARD | Question.difficulty |
| `QuestionSource` | ETS, AI, ADMIN_IMPORT, MANUAL | Question.source |
| `SessionType` | PRACTICE, TIMED_TEST | TestSession.type |
| `SessionStatus` | IN_PROGRESS, COMPLETED, ABANDONED | TestSession.status |

## 4. Code mẫu

```prisma
model Question {
  id            String           @id @default(cuid())
  questionText  String
  type          QuestionType
  difficulty    Difficulty
  source        QuestionSource   @default(MANUAL)
  hint          String?
  isActive      Boolean          @default(true)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  options       Option[]
  attempts      Attempt[]
}

model Option {
  id          String   @id @default(cuid())
  text        String
  isCorrect   Boolean
  rationale   String
  order       Int      @default(0)
  questionId  String

  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@index([questionId])
}
```

## 5. Mapped sang SQL Server (tham khảo)

| Prisma | SQL Server |
|--------|-----------|
| `String @id @default(cuid())` | `NVARCHAR(25) PK DEFAULT NEWID()` |
| `String` | `NVARCHAR(MAX)` |
| `Boolean` | `BIT` |
| `Int` | `INT` |
| `DateTime` | `DATETIME2` |
| `QuestionType` (enum) | `NVARCHAR(20)` với CHECK constraint |
| `@relation(onDelete: Cascade)` | `ON DELETE CASCADE` |
| `@@index([field])` | `CREATE INDEX` |
