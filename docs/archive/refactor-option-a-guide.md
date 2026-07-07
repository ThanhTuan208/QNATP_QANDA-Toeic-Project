# Refactor Guide — Option A: Thêm Service + Repository Layer

> Hướng dẫn step-by-step để tự tay refactor API routes hiện tại sang kiến trúc 3 layer.

---

## Mục lục

1. [Tổng quan kiến trúc & Data Flow](#1-tổng-quan-kiến-trúc--data-flow)
2. [Contracts — Kiểu dữ liệu giữa các layer](#2-contracts--kiểu-dữ-liệu-giữa-các-layer)
3. [Import Map — File nào import file nào](#3-import-map--file-nào-import-file-nào)
4. [Danh sách file cần tạo/sửa (thứ tự thực hiện)](#4-danh-sách-file-cần-tạosửa-thứ-tự-thực-hiện)
5. [Chi tiết từng file](#5-chi-tiết-từng-file)
6. [So sánh Trước/Sau cho route hiện tại](#6-so-sánh-trướcsau-cho-route-hiện-tại)
7. [Kiểm tra sau refactor](#7-kiểm-tra-sau-refactor)

---

## 1. Tổng quan kiến trúc & Data Flow

### Mô hình target (3 layer)

```
┌──────────────────────────────────────────────────────┐
│                   ROUTE LAYER                         │
│  src/app/api/attempts/route.ts                        │
│                                                       │
│  NHIỆM VỤ: Parse HTTP request, gọi service, trả      │
│  response. Không có business logic, không gọi DB.    │
│  Biết về: HTTP (NextRequest), Response helper         │
├──────────────────────────────────────────────────────┤
│                  SERVICE LAYER                         │
│  src/api/quiz/quiz.service.ts                         │
│                                                       │
│  NHIỆM VỤ: Business logic, validation, orchestrate.  │
│  Không biết HTTP, không gọi Prisma trực tiếp.         │
│  Biết về: AppError, Repository                        │
├──────────────────────────────────────────────────────┤
│                REPOSITORY LAYER                        │
│  src/api/quiz/quiz.repository.ts                      │
│                                                       │
│  NHIỆM VỤ: Prisma queries thuần túy.                 │
│  Không có if/else business logic.                     │
│  Biết về: Prisma Client, types từ @prisma/client      │
├──────────────────────────────────────────────────────┤
│                    DATABASE                            │
│  PostgreSQL (Neon)                                     │
└──────────────────────────────────────────────────────┘
```

### Data Flow — Browser đến DB và ngược lại

```
BROWSER
  │  fetch('POST /api/attempts', { questionId, selectedOptionId })
  ▼
┌──────────────────────────────────────────────────────────────────────┐
│  ROUTE: app/api/attempts/route.ts                                    │
│                                                                      │
│  1. Nhận HTTP request                                                │
│  2. Parse body: request.json() → { questionId, selectedOptionId }    │
│  3. Gọi service.submitAttempt(body, userId)                          │
│  4. Nhận kết quả từ service                                          │
│  5. Trả HTTP response: success(result) hoặc error(message)           │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ gọi
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  SERVICE: api/quiz/quiz.service.ts                                   │
│  submitAttempt(input, userId)                                        │
│                                                                      │
│  1. Gọi repository.findQuestionById(input.questionId)                │
│  2. Kiểm tra question có tồn tại không? → throw AppError nếu không   │
│  3. Tìm option đã chọn trong question.options                        │
│  4. Kiểm tra option có hợp lệ không? → throw AppError nếu không     │
│  5. selectedOption.isCorrect → true/false                            │
│  6. Gọi repository.createAttempt({...})                              │
│  7. Trả về { attempt, correctOptionId, rationale }                   │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ gọi
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  REPOSITORY: api/quiz/quiz.repository.ts                             │
│  findQuestionById(id) / createAttempt(data)                          │
│                                                                      │
│  1. prisma.question.findUnique({ where: { id }, include: {options}}) │
│  2. prisma.attempt.create({ data })                                  │
│  3. prisma.question.update({ timesUsed: { increment: 1 } })          │
│  4. Trả về data từ Prisma (JS object)                                │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ query
                           ▼
                    POSTGRESQL (Neon)
```

---

## 2. Contracts — Kiểu dữ liệu giữa các layer

> Dữ liệu đi qua các layer như thế nào — đọc từ dưới lên (từ DB lên Browser)

### 2a. DB Models (Prisma schema)

```prisma
// prisma/schema.prisma
model Question {
  id           String   @id @default(cuid())   // "cm8abc123..."
  code         String   @unique                // "P5_001"
  questionText String                          // "The new system is ______..."
  type         QuestionType                    // "COMPARISON"
  difficulty   Difficulty                      // "EASY"
  hint         String?
  isActive     Boolean   @default(true)
  timesUsed    Int       @default(0)
  options      Option[]                        // 1 Question → N Options
}

model Option {
  id          String   @id @default(cuid())   // "opt_cm8def..."
  text        String                          // "more effective"
  isCorrect   Boolean                         // true/false
  rationale   String                          // "Giải thích tại sao đúng/sai"
  order       Int                             // 0, 1, 2, 3
  questionId  String                          // FK → Question.id
}

model Attempt {
  id                String   @id @default(cuid())
  userId            String                     // FK → User.id
  questionId        String                     // FK → Question.id
  selectedOptionId  String?                    // FK → Option.id (có thể null)
  isCorrect         Boolean                    // true/false
  timeSpentSeconds  Int       @default(0)
  createdAt         DateTime  @default(now())
}
```

### 2b. Input/Output từng layer

```
LAYER               INPUT                              OUTPUT
─────               ─────                              ──────

REPOSITORY:
  findQuestionById  id: string                         Question | null
  createAttempt     CreateAttemptInput                 Attempt
  findQuestions     Prisma.QuestionWhereInput          Question[]
  countAttempts     userId: string                     number
  findAllAttempts   userId: string                     { isCorrect, question.type }[]
  findRecentAttempts userId: string                    Attempt[]

SERVICE:
  submitAttempt     { questionId, selectedOptionId }   { attempt, correctOptionId, rationale }
  listQuestions     { type?, difficulty?, limit? }     { questions[], total }
  getRandomQuestions { type?, difficulty?, limit? }    { questions[], total }
  getUserStats      userId: string                     { totalAttempts, correctAttempts, accuracy, typeStats, recentAttempts }

ROUTE:
  POST /attempts    HTTP body → service input          HTTP JSON → browser
  GET /questions    URL params → service input         HTTP JSON → browser
  GET /stats        (auth) → service input             HTTP JSON → browser
```

### 2c. TypeScript interfaces — DTO đi qua các layer

```typescript
// === LAYER REPOSITORY → Database ===

// Input cho createAttempt (repository nhận)
interface CreateAttemptInput {
  userId: string
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  timeSpentSeconds: number
}

// Output từ findQuestionById (repository trả về)
// Là Prisma Question + options[] (raw từ DB)


// === LAYER SERVICE → Repository ===

// Input cho submitAttempt (service nhận từ route)
interface SubmitAttemptInput {
  questionId: string
  selectedOptionId: string
  timeSpentSeconds?: number
}

// Output từ submitAttempt (service trả về route)
interface SubmitAttemptOutput {
  attempt: { id: string; isCorrect: boolean }
  correctOptionId: string | undefined
  rationale: string
}

// Output từ listQuestions (service trả về)
interface ListQuestionsOutput {
  questions: Question[]
  total: number
}

// Output từ getUserStats (service trả về)
interface UserStatsOutput {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  typeStats: Record<string, { total: number; correct: number }>
  recentAttempts: Attempt[]
}


// === LAYER ROUTE → HTTP Response ===

// Response format chuẩn (qua response helper)
interface SuccessResponse<T> {
  success: true
  data: T
  message: string
}

interface ErrorResponse {
  success: false
  message: string
  code?: string
}

interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

---

### 2d. Luồng đi chi tiết của từng API (Browser → Route → Service → Repository → DB)

#### `POST /api/attempts` — Submit đáp án

```
BROWSER                           ROUTE                          SERVICE                          REPOSITORY                     DB
  │                                │                               │                                │
  │  POST /api/attempts            │                               │                                │
  │  body: JSON                    │                               │                                │
  │  { questionId,                 │                               │                                │
  │    selectedOptionId,           │                               │                                │
  │    timeSpentSeconds? }         │                               │                                │
  │ ─────────────────────────────> │                               │                                │
  │                                │                               │                                │
  │                                │  const userId = await getUserId()
  │                                │  const body = request.json()
  │                                │                               │                                │
  │                                │  submitAttempt(               │                                │
  │                                │    body,        ────────────> │                                │
  │                                │    userId)                    │                                │
  │                                │                               │                                │
  │                                │                 Input: SubmitAttemptInput                    │
  │                                │                 { questionId, selectedOptionId,               │
  │                                │                   timeSpentSeconds? }                        │
  │                                │                               │                                │
  │                                │                               │  findQuestionById(id) ────────> │
  │                                │                               │  Input: id: string              │  SELECT * FROM questions
  │                                │                               │                                │  WHERE id = ?  (+ options)
  │                                │                               │  <──────────────────────────── │
  │                                │                               │  Output: Question | null        │
  │                                │                               │                                │
  │                                │                               │  // Business logic:             │
  │                                │                               │  // • if !question → 404        │
  │                                │                               │  // • if !selectedOption → 400  │
  │                                │                               │  // • selectedOption.isCorrect  │
  │                                │                               │  //   → isCorrect              │
  │                                │                               │                                │
  │                                │                               │  createAttempt({                │
  │                                │                               │    userId,          ────────>  │  BEGIN TRANSACTION
  │                                │                               │    questionId,                  │  INSERT INTO attempts
  │                                │                               │    selectedOptionId,            │  UPDATE questions SET
  │                                │                               │    isCorrect,                   │    timesUsed++
  │                                │                               │    timeSpentSeconds             │  COMMIT
  │                                │                               │  })                            │
  │                                │                               │  Input: CreateAttemptInput     │
  │                                │                               │  <────────────────────────────  │
  │                                │                               │  Output: Attempt                │
  │                                │                               │                                │
  │                                │                               │  Return DTO:                   │
  │                                │                               │  SubmitAttemptOutput           │
  │                                │  <──────────────────────────── │  {                            │
  │                                │                               │    attempt: { id, isCorrect }  │
  │                                │                               │    correctOptionId,            │
  │                                │                               │    rationale                   │
  │                                │                               │  }                            │
  │                                │                               │                                │
  │                                │  success(result)              │                                │
  │                                │  → { success: true,          │                                │
  │  <─────────────────────────────│      data: { attempt,         │                                │
  │  HTTP 200                      │        correctOptionId,      │                                │
  │  { success, data, message }    │        rationale },           │                                │
  │                                │      message: "Success" }    │                                │
```

#### `GET /api/questions` — Danh sách câu hỏi (phân trang)

```
BROWSER                           ROUTE                          SERVICE                          REPOSITORY                     DB
  │                                │                               │                                │
  │  GET /api/questions?           │                               │                                │
  │  type=comparison&             │                               │                                │
  │  limit=10&offset=0            │                               │                                │
  │ ─────────────────────────────> │                               │                                │
  │                                │  searchParams từ URL          │                                │
  │                                │  → { type, difficulty,       │                                │
  │                                │      limit, offset }          │                                │
  │                                │                               │                                │
  │                                │  listQuestions(params) ─────> │                               │
  │                                │                               │  where = { isActive: true }    │
  │                                │                               │  if (type) where.type = type   │
  │                                │                               │                                │
  │                                │                               │  findQuestionsPaginated(       │
  │                                │                               │    where, take, skip) ────────> │
  │                                │                               │                                │  SELECT * FROM questions
  │                                │                               │  <────────────────────────────  │  WHERE isActive=true
  │                                │                               │  Output:                       │  LIMIT ? OFFSET ?
  │                                │                               │  { questions[], total }        │  + SELECT COUNT(*)
  │                                │                               │                                │
  │                                │  <──────────────────────────── │                                │
  │                                │  Output: ListQuestionsOutput  │                                │
  │                                │  { questions[], total }       │                                │
  │                                │                               │                                │
  │                                │  paginated(                   │                                │
  │                                │    questions, total,          │                                │
  │                                │    page, limit)               │                                │
  │                                │  → { success: true,          │                                │
  │  <─────────────────────────────│      data: questions[],       │                                │
  │  HTTP 200                      │      pagination: {            │                                │
  │  { success, data,             │        total, page,           │                                │
  │    pagination }               │        limit, totalPages } }   │                                │
```

#### `GET /api/questions/random` — Câu hỏi ngẫu nhiên

```
BROWSER                           ROUTE                          SERVICE                          REPOSITORY                     DB
  │                                │                               │                                │
  │  GET /api/questions/random?   │                               │                                │
  │  type=vocabulary&limit=5     │                               │                                │
  │ ─────────────────────────────> │                               │                                │
  │                                │  searchParams → params        │                                │
  │                                │                               │                                │
  │                                │  getRandomQuestions(params) ->│                               │
  │                                │                               │  where = { isActive: true }    │
  │                                │                               │  findQuestions(where) ────────> │
  │                                │                               │                                │  SELECT * FROM questions
  │                                │                               │  <────────────────────────────  │  WHERE isActive=?
  │                                │                               │  Output: Question[]             │
  │                                │                               │                                │
  │                                │                               │  // Fisher-Yates shuffle        │
  │                                │                               │  // slice(0, limit)             │
  │                                │                               │                                │
  │                                │  <──────────────────────────── │                                │
  │                                │  Output:                      │                                │
  │                                │  { questions[], total }       │                                │
  │                                │                               │                                │
  │                                │  success(result)              │                                │
  │  <─────────────────────────────│  → { success: true,          │                                │
  │  HTTP 200                      │      data: { questions,      │                                │
  │  { success, data, message }   │        total },               │                                │
  │                                │      message: "Success" }    │                                │
```

#### `GET /api/stats` — Thống kê user

```
BROWSER                           ROUTE                          SERVICE                          REPOSITORY                     DB
  │                                │                               │                                │
  │  GET /api/stats               │                               │                                │
  │ ─────────────────────────────> │                               │                                │
  │                                │  const userId = getUserId()   │                               │
  │                                │                               │                                │
  │                                │  getUserStats(userId) ──────> │                               │
  │                                │                               │                                │
  │                                │                               │  Promise.all([                  │
  │                                │                               │    countAttempts(userId) ────> │  SELECT COUNT(*) FROM attempts
  │                                │                               │    <─────────────────────────── │  WHERE userId = ?
  │                                │                               │    number                      │
  │                                │                               │                                │
  │                                │                               │    countCorrectAttempts(u) ────>│  SELECT COUNT(*) FROM attempts
  │                                │                               │    <─────────────────────────── │  WHERE userId=? AND isCorrect=true
  │                                │                               │    number                      │
  │                                │                               │                                │
  │                                │                               │    findAllAttempts(userId) ────>│  SELECT isCorrect, question.type
  │                                │                               │    <─────────────────────────── │  FROM attempts JOIN questions
  │                                │                               │    { isCorrect, question.type } │
  │                                │                               │                                │
  │                                │                               │    findRecentAttempts(userId) ->│  SELECT * FROM attempts
  │                                │                               │    <─────────────────────────── │  WHERE userId=?
  │                                │                               │    Attempt[] + question info   │  ORDER BY createdAt DESC LIMIT 10
  │                                │                               │  ])                            │
  │                                │                               │                                │
  │                                │                               │  // Tính accuracy:              │
  │                                │                               │  // Math.round(correct/total   │
  │                                │                               │  //   * 100)                    │
  │                                │                               │  // Tính typeStats:             │
  │                                │                               │  // for each attempt            │
  │                                │                               │  //   typeMap[key]++            │
  │                                │                               │                                │
  │                                │  <──────────────────────────── │                               │
  │                                │  Output: UserStatsOutput      │                               │
  │                                │  { totalAttempts,              │                               │
  │                                │    correctAttempts,           │                               │
  │                                │    accuracy,                  │                               │
  │                                │    typeStats,                 │                               │
  │                                │    recentAttempts }           │                               │
  │                                │                               │                                │
  │                                │  success(stats)               │                               │
  │  <─────────────────────────────│  → { success: true,          │                               │
  │  HTTP 200                      │      data: { ...stats },      │                               │
  │  { success, data, message }   │      message: "Success" }    │                               │
```

#### Tổng kết luồng dữ liệu

```
Browser HTTP JSON
  → Route parse (URL params / request body)
  → Service nhận Input DTO, xử lý business logic
    → Repository nhận Input DTO, query DB
      → Database trả raw data
    ← Repository trả Prisma data
  ← Service trả Output DTO (đã định hình)
  ← Route đóng gói vào SuccessResponse / PaginatedResponse / ErrorResponse
→ Browser nhận HTTP JSON chuẩn
```

**Vai trò từng layer:**
- **Route** — chỉ parse HTTP + gọi service + wrap response. Không `if/else` business logic, không Prisma.
- **Service** — nơi duy nhất có `if/else` (kiểm tra tồn tại, hợp lệ, tính toán). Throw `AppError` nếu sai.
- **Repository** — chỉ có Prisma queries thuần. Không business logic, không try/catch.

---

## 3. Import Map — File nào import file nào

> Khi Ctrl+click vào import trong VS Code, nó sẽ đi đến file tương ứng. Dưới đây là map các import.

### `import` của mỗi file mới

```
src/lib/response.ts
  → import { NextResponse } from 'next/server'

src/lib/errors/AppError.ts
  → (không import gì — chỉ extends Error)

src/lib/auth-utils.ts
  → import { auth } from '@/lib/auth'
  → import { prisma } from '@/lib/prisma'

src/api/quiz/quiz.repository.ts
  → import { prisma } from '@/lib/prisma'
  → import type { Prisma } from '@prisma/client'

src/api/quiz/quiz.service.ts
  → import * as quizRepo from './quiz.repository'
  → import { AppError } from '@/lib/errors/AppError'
```

### `import` mới trong route (sau khi sửa)

```
app/api/attempts/route.ts
  → import { getUserId } from '@/lib/auth-utils'
  → import { submitAttempt } from '@/api/quiz/quiz.service'
  → import { success, error } from '@/lib/response'
  → import { AppError } from '@/lib/errors/AppError'

app/api/questions/route.ts
  → import { listQuestions } from '@/api/quiz/quiz.service'
  → import { paginated, error } from '@/lib/response'

app/api/questions/random/route.ts
  → import { getRandomQuestions } from '@/api/quiz/quiz.service'
  → import { success, error } from '@/lib/response'

app/api/stats/route.ts
  → import { getUserId } from '@/lib/auth-utils'
  → import { getUserStats } from '@/api/quiz/quiz.service'
  → import { success, error } from '@/lib/response'
```

---

## 4. Danh sách file cần tạo/sửa (thứ tự thực hiện)

> Thứ tự quan trọng: file không phụ thuộc gì làm trước, file phụ thuộc làm sau.

| Thứ tự | Hành động | File | Phụ thuộc vào |
|:------:|:---------:|------|:-------------:|
| 1 | **Tạo mới** | `src/lib/response.ts` | — (không phụ thuộc) |
| 2 | **Tạo mới** | `src/lib/errors/AppError.ts` | — (không phụ thuộc) |
| 3 | **Tạo mới** | `src/lib/auth-utils.ts` | `auth.ts`, `prisma.ts` |
| 4 | **Tạo mới** | `src/api/quiz/quiz.repository.ts` | `prisma.ts` |
| 5 | **Tạo mới** | `src/api/quiz/quiz.service.ts` | `quiz.repository.ts`, `AppError.ts` |
| 6 | **Sửa** | `src/app/api/attempts/route.ts` | `quiz.service.ts`, `response.ts`, `auth-utils.ts` |
| 7 | **Sửa** | `src/app/api/questions/route.ts` | `quiz.service.ts`, `response.ts` |
| 8 | **Sửa** | `src/app/api/questions/random/route.ts` | `quiz.service.ts`, `response.ts` |
| 9 | **Sửa** | `src/app/api/stats/route.ts` | `quiz.service.ts`, `response.ts`, `auth-utils.ts` |

---

## 5. Chi tiết từng file

### File 1: `src/lib/response.ts` — Response helpers

**Mục đích:** Format HTTP response chuẩn, thay thế `NextResponse.json()` viết tay ở mọi route.

**Vấn đề hiện tại:** Mỗi route tự gọi `NextResponse.json({...})` với format khác nhau:
- `attempts` trả `{ attempt, correctOptionId, rationale }`
- `questions` trả `{ questions, total, limit, offset }`
- `stats` trả `{ totalAttempts, correctAttempts, accuracy, typeStats, recentAttempts }`

Client không có format chuẩn để xử lý.

**Cách hoạt động:**

```typescript
import { NextResponse } from 'next/server'

// success() — dùng cho response có 1 data object
// Ví dụ: POST /attempts → success({ attempt, correctOptionId, rationale })
// Output JSON:
//   { "success": true, "data": { ... }, "message": "Success" }

export function success<T>(data: T, message = 'Success') {
  return NextResponse.json({
    success: true,
    data,
    message,
  })
}

// paginated() — dùng cho response có list + pagination
// Ví dụ: GET /questions?page=1&limit=10
// Output JSON:
//   {
//     "success": true,
//     "data": [ ... ],
//     "pagination": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
//   }

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}

// error() — dùng cho response lỗi
// Output JSON:
//   { "success": false, "message": "...", "code": "NOT_FOUND" }

export function error(message: string, status = 400, code?: string) {
  return NextResponse.json(
    { success: false, message, code },
    { status },
  )
}
```

**Ai gọi file này?** Tất cả route files sau khi sửa.
**File này gọi ai?** Chỉ `NextResponse` từ `next/server`.

---

### File 2: `src/lib/errors/AppError.ts` — Error class

**Mục đích:** Cho phép service layer throw lỗi có kèm HTTP status code, route layer bắt và trả response tương ứng.

**Vấn đề hiện tại:** Service không có cách nào báo lỗi cho route. Hoặc phải return `{ error: true, message }`, hoặc throw Error không có status → route không biết trả 400 hay 500.

**Cách hoạt động:**

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,   // HTTP status: 400, 401, 404, 500...
    message: string,              // Message cho client
    public code?: string,         // Mã lỗi: 'NOT_FOUND', 'VALIDATION_ERROR'...
  ) {
    super(message)
    this.name = 'AppError'
  }

  // Static factory methods — tạo AppError với preset

  // Dùng khi: repository trả về null → question/user không tồn tại
  // Ví dụ: throw AppError.notFound('Question')
  // → { statusCode: 404, message: "Question not found", code: "NOT_FOUND" }
  static notFound(entity: string) {
    return new AppError(404, `${entity} not found`, 'NOT_FOUND')
  }

  // Dùng khi: input không hợp lệ (option sai, missing field)
  // Ví dụ: throw AppError.validation('Invalid option')
  // → { statusCode: 400, message: "Invalid option", code: "VALIDATION_ERROR" }
  static validation(message: string) {
    return new AppError(400, message, 'VALIDATION_ERROR')
  }

  // Dùng khi: chưa đăng nhập
  // Ví dụ: throw AppError.unauthorized()
  // → { statusCode: 401, message: "Unauthorized", code: "UNAUTHORIZED" }
  static unauthorized(message = 'Unauthorized') {
    return new AppError(401, message, 'UNAUTHORIZED')
  }
}
```

**Logic quan trọng:**
- `extends Error` — kế thừa JS Error, có thể `throw` và `instanceof` kiểm tra
- `statusCode` — route dùng statusCode này để set HTTP status
- Static methods — gọi nhanh, tránh viết `new AppError(404, '...')` nhiều lần

**Ai gọi file này?** `quiz.service.ts` — throw AppError khi có lỗi business logic.

---

### File 3: `src/lib/auth-utils.ts` — Auth utility

**Mục đích:** Gom `getUserId()` — hiện tại duplicate ở `attempts/route.ts` và `stats/route.ts` — vào 1 chỗ.

**Vấn đề hiện tại:**
- `attempts/route.ts` có `getUserId()` — 11 dòng
- `stats/route.ts` có `getUserId()` — 11 dòng (giống hệt)
- Sửa 1 chỗ phải nhớ sửa cả 2 → dễ quên

**Cách hoạt động:**

```typescript
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Hàm này được gọi ở đầu mỗi request cần auth
// Flow:
// 1. auth() → gọi NextAuth lấy session từ cookie/header
// 2. Nếu có session.user.id → return luôn
// 3. Nếu không (dev local) → upsert user "dev@toeic.local" → return id

export async function getUserId(): Promise<string> {
  const session = await auth()
  if (session?.user?.id) return session.user.id

  // Dev fallback: nếu chưa login, tự tạo user mặc định
  const dev = await prisma.user.upsert({
    where: { email: 'dev@toeic.local' },
    update: {},
    create: { email: 'dev@toeic.local', name: 'Dev User' },
  })
  return dev.id
}
```

**Ai gọi file này?** `attempts/route.ts`, `stats/route.ts` (route gọi `getUserId()` trước khi gọi service).

---

### File 4: `src/api/quiz/quiz.repository.ts` — DB queries

**Mục đích:** Gom tất cả Prisma queries vào 1 file. Route hiện tại có Prisma queries nằm rải rác trong các route handler — cần dời hết về đây.

**Nguyên tắc:**
- Mỗi function = 1 query Prisma (có thể kết hợp 2-3 query trong `$transaction`)
- Không có `if/else` business logic
- Không có try/catch — để service layer xử lý
- Input là data thuần, output là data từ Prisma

**Cách hoạt động:**

```typescript
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// ──────────────────────────────────────────────
// QUESTION QUERIES
// ──────────────────────────────────────────────

// findQuestionById
// Input:  id (string) — Question.id (cuid: "cm8abc...")
// Output: Question | null — nếu không tìm thấy trả null
// Logic: findUnique + include options (cần options để kiểm tra đáp án)
// Dùng trong: quiz.service.submitAttempt()
// Ctrl+click: Prisma.Question — prisma/schema.prisma

export async function findQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      options: true,   // include tất cả field của options (cần rationale, isCorrect)
    },
  })
}

// findQuestions
// Input:  where (Prisma.QuestionWhereInput) — filter: { isActive, type, difficulty }
// Output: Question[] (kèm options, chỉ select id/text/order — ẩn isCorrect/rationale)
// Logic: findMany với include có select để ẩn đáp án khỏi client
// Dùng trong: quiz.service.getRandomQuestions(), quiz.service.listQuestions()

export async function findQuestions(where: Prisma.QuestionWhereInput) {
  return prisma.question.findMany({
    where,
    include: {
      options: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          text: true,
          order: true,
          // KHÔNG select isCorrect — client không được biết đáp án đúng trước khi submit
        },
      },
    },
  })
}

// findQuestionsPaginated
// Giống findQuestions nhưng thêm pagination (take/skip) + count
// Input:  where + take (limit) + skip (offset)
// Output: { questions: Question[], total: number }
// Dùng trong: quiz.service.listQuestions() khi cần phân trang

export async function findQuestionsPaginated(
  where: Prisma.QuestionWhereInput,
  take: number,
  skip: number,
) {
  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: {
        options: {
          orderBy: { order: 'asc' },
          select: { id: true, text: true, order: true },
        },
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.question.count({ where }),
  ])
  return { questions, total }
}

// ──────────────────────────────────────────────
// ATTEMPT QUERIES
// ──────────────────────────────────────────────

// createAttempt
// Input:  CreateAttemptInput (userId, questionId, selectedOptionId, isCorrect, timeSpentSeconds)
// Output: Attempt (vừa được tạo)
// Logic: $transaction — tạo attempt + update timesUsed cùng lúc, nếu 1 trong 2 fail → rollback
// Dùng trong: quiz.service.submitAttempt()

interface CreateAttemptInput {
  userId: string
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  timeSpentSeconds: number
}

export async function createAttempt(data: CreateAttemptInput) {
  const [attempt] = await prisma.$transaction([
    prisma.attempt.create({
      data: {
        userId: data.userId,
        questionId: data.questionId,
        selectedOptionId: data.selectedOptionId,
        isCorrect: data.isCorrect,
        timeSpentSeconds: data.timeSpentSeconds,
      },
    }),
    // Đồng thời tăng biến đếm timesUsed của question
    prisma.question.update({
      where: { id: data.questionId },
      data: { timesUsed: { increment: 1 } },
    }),
  ])
  return attempt
}

// countAttempts / countCorrectAttempts / findAllAttempts / findRecentAttempts
// Input:  userId
// Output: số lượng / danh sách attempts
// Dùng trong: quiz.service.getUserStats()

export async function countAttempts(userId: string) {
  return prisma.attempt.count({ where: { userId } })
}

export async function countCorrectAttempts(userId: string) {
  return prisma.attempt.count({
    where: { userId, isCorrect: true },
  })
}

export async function findAllAttempts(userId: string) {
  return prisma.attempt.findMany({
    where: { userId },
    select: {
      isCorrect: true,
      question: { select: { type: true } },
    },
  })
}

export async function findRecentAttempts(userId: string) {
  return prisma.attempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      question: {
        select: { type: true, difficulty: true },
      },
    },
  })
}
```

**Diagram luồng dữ liệu:**

```
quiz.service.ts gọi repository:
  submitAttempt()
    → findQuestionById(id)        ← Question | null
    → createAttempt(data)          ← Attempt

  listQuestions()
    → findQuestionsPaginated(...)  ← { questions, total }

  getRandomQuestions()
    → findQuestions(where)         ← Question[] (không kèm isCorrect)

  getUserStats()
    → countAttempts(userId)        ← number
    → countCorrectAttempts(userId) ← number
    → findAllAttempts(userId)      ← { isCorrect, question.type }[]
    → findRecentAttempts(userId)   ← Attempt[]
```

---

### File 5: `src/api/quiz/quiz.service.ts` — Business logic

**Mục đích:** Chứa business logic — những quyết định dạng "nếu A thì làm B".

**Nguyên tắc:**
- Gọi repository để lấy data
- Dùng `if/else` để validate và quyết định
- Throw `AppError` nếu có lỗi
- Trả về DTO đã định hình sẵn (không trả raw Prisma data)

**Cách hoạt động — từng function:**

```typescript
import * as quizRepo from './quiz.repository'
import { AppError } from '@/lib/errors/AppError'

// ════════════════════════════════════════════════════════════
// submitAttempt — Xử lý khi user chọn đáp án
// ════════════════════════════════════════════════════════════
//
// Input:  { questionId, selectedOptionId, timeSpentSeconds? }
//         userId — từ auth
//
// Flow logic:
//   1. Tìm question trong DB (repository)
//   2. Nếu question không tồn tại → throw NOT_FOUND (404)
//   3. Tìm option user đã chọn trong question.options
//   4. Nếu option không tồn tại → throw VALIDATION_ERROR (400)
//      (user gửi optionId sai/không thuộc question này)
//   5. selectedOption.isCorrect cho biết đáp án đúng hay sai
//      → Đây là business logic: DB lưu isCorrect, service đọc và quyết định
//   6. Tạo attempt record (repository — dùng transaction)
//   7. Tìm correctOptionId từ question.options (option nào có isCorrect = true)
//   8. rationale của selectedOption — giải thích tại sao đúng/sai
//   9. Trả về DTO: { attempt, correctOptionId, rationale }
//
// Output: { attempt: { id, isCorrect }, correctOptionId, rationale }

export async function submitAttempt(
  input: { questionId: string; selectedOptionId: string; timeSpentSeconds?: number },
  userId: string,
) {
  // Bước 1: Lấy question + options từ DB
  const question = await quizRepo.findQuestionById(input.questionId)

  // Bước 2: Kiểm tra question tồn tại
  if (!question) throw AppError.notFound('Question')

  // Bước 3: Tìm option user đã chọn
  const selectedOption = question.options.find(
    (o) => o.id === input.selectedOptionId,
  )

  // Bước 4: Kiểm tra option hợp lệ
  if (!selectedOption) throw AppError.validation('Invalid option')

  // Bước 5-6: isCorrect đã có sẵn trong DB — dùng luôn
  const attempt = await quizRepo.createAttempt({
    userId,
    questionId: input.questionId,
    selectedOptionId: input.selectedOptionId,
    isCorrect: selectedOption.isCorrect,
    timeSpentSeconds: input.timeSpentSeconds ?? 0,
  })

  // Bước 7-8: Tìm đáp án đúng + lấy rationale của option đã chọn
  const correctOptionId = question.options.find((o) => o.isCorrect)?.id

  // Bước 9: Trả DTO đã định hình
  return {
    attempt: { id: attempt.id, isCorrect: attempt.isCorrect },
    correctOptionId,
    rationale: selectedOption.rationale,
  }
}

// ════════════════════════════════════════════════════════════
// listQuestions — Lấy danh sách câu hỏi (có filter + phân trang)
// ════════════════════════════════════════════════════════════
//
// Input:  { type?, difficulty?, limit?, offset? }
//
// Flow logic:
//   1. Xây dựng where clause từ params (chỉ thêm filter nếu có)
//   2. Gọi repository → findQuestionsPaginated
//   3. Trả về { questions[], total }
//
// Lưu ý: Repository đã ẩn isCorrect trong options select
//         → Client không thấy đáp án đúng

export async function listQuestions(params: {
  type?: string | null
  difficulty?: string | null
  limit?: number
  offset?: number
}) {
  const where: Record<string, unknown> = { isActive: true }
  if (params.type) where.type = params.type
  if (params.difficulty) where.difficulty = params.difficulty

  return quizRepo.findQuestionsPaginated(
    where,
    params.limit ?? 20,
    params.offset ?? 0,
  )
}

// ════════════════════════════════════════════════════════════
// getRandomQuestions — Lấy câu hỏi ngẫu nhiên
// ════════════════════════════════════════════════════════════
//
// Input:  { type?, difficulty?, limit? }
//
// Flow logic:
//   1. Xây dựng where clause (giống listQuestions)
//   2. Gọi repository → findQuestions (không phân trang)
//   3. Xáo trộn (Fisher-Yates shuffle) — business logic thuần
//   4. Cắt lấy limit câu đầu
//   5. Trả về { questions[], total }

export async function getRandomQuestions(params: {
  type?: string | null
  difficulty?: string | null
  limit?: number
}) {
  const where: Record<string, unknown> = { isActive: true }
  if (params.type) where.type = params.type
  if (params.difficulty) where.difficulty = params.difficulty

  const questions = await quizRepo.findQuestions(where)

  // Fisher-Yates shuffle — xáo trộn mảng tại chỗ
  // Đây là business logic: random hóa thứ tự câu hỏi
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[questions[i], questions[j]] = [questions[j], questions[i]]
  }

  return {
    questions: questions.slice(0, params.limit ?? 20),
    total: questions.length,
  }
}

// ════════════════════════════════════════════════════════════
// getUserStats — Thống kê user
// ════════════════════════════════════════════════════════════
//
// Input:  userId
//
// Flow logic:
//   1. Gọi 4 repository queries song song (Promise.all)
//   2. Tính typeStats: duyệt allAttempts → nhóm theo question.type
//   3. Tính accuracy: (correct / total) * 100, làm tròn
//   4. Trả về DTO tổng hợp
//
// Query song song:
//   countAttempts(userId) ─┐
//   countCorrectAttempts()  ├── Promise.all ──┐
//   findAllAttempts(userId)─┘                 │→ return { ... }
//   findRecentAttempts()──────────────────────┘

export async function getUserStats(userId: string) {
  const [totalAttempts, correctAttempts, allAttempts, recentAttempts] =
    await Promise.all([
      quizRepo.countAttempts(userId),
      quizRepo.countCorrectAttempts(userId),
      quizRepo.findAllAttempts(userId),
      quizRepo.findRecentAttempts(userId),
    ])

  // Tính typeStats — nhóm attempts theo question.type
  const typeMap = new Map<string, { total: number; correct: number }>()
  for (const a of allAttempts) {
    const key = a.question.type          // "COMPARISON", "WORD_FORM"...
    const entry = typeMap.get(key) ?? { total: 0, correct: 0 }
    entry.total++
    if (a.isCorrect) entry.correct++
    typeMap.set(key, entry)
  }

  return {
    totalAttempts,
    correctAttempts,
    accuracy:
      totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : 0,
    typeStats: Object.fromEntries(typeMap),
    recentAttempts,
  }
}
```

---

### File 6-9: Sửa 4 Route files

> Các route hiện tại có code gộp. Sửa thành chỉ gọi service + response helper.

#### Nguyên tắc chung cho tất cả route sau sửa:

```typescript
// TRƯỚC: 1 file làm hết (HTTP + logic + DB)
// SAU: chunk nhỏ, chỉ làm HTTP

export async function GET/POST(request) {
  try {
    // 1. Parse request (lấy params/body)
    // 2. Gọi service
    // 3. Trả response qua helper
  } catch (e) {
    // Bắt AppError → trả error response
    // Bắt lỗi khác → 500
  }
}
```

#### `attempts/route.ts` — Sau khi sửa

**Thay đổi so với hiện tại:**
- `getUserId()` → không còn trong file này, import từ `auth-utils`
- `prisma.question.findUnique()` → dời vào repository
- `prisma.attempt.create()` → dời vào repository
- `NextResponse.json()` → thay bằng `success()` / `error()`
- Logic kiểm tra question/option → dời vào service

```typescript
import { type NextRequest } from 'next/server'
import { getUserId } from '@/lib/auth-utils'
import { submitAttempt } from '@/api/quiz/quiz.service'
import { success, error } from '@/lib/response'
import { AppError } from '@/lib/errors/AppError'

export async function POST(request: NextRequest) {
  try {
    // Bước 1: Auth — lấy userId
    const userId = await getUserId()

    // Bước 2: Parse body
    const body = await request.json()

    // Bước 3: Gọi service (business logic + DB)
    const result = await submitAttempt(body, userId)

    // Bước 4: Trả response chuẩn
    return success(result)
  } catch (e) {
    // Bắt AppError → trả lỗi có status code
    if (e instanceof AppError) {
      return error(e.message, e.statusCode, e.code)
    }
    // Lỗi không xác định → 500
    return error('Internal server error', 500)
  }
}
```

#### `questions/route.ts` — Sau khi sửa

**Thay đổi so với hiện tại:**
- `prisma.question.findMany()` + `.count()` → dời vào repository
- `NextResponse.json()` → thay bằng `paginated()`

```typescript
import { type NextRequest } from 'next/server'
import { listQuestions } from '@/api/quiz/quiz.service'
import { paginated, error } from '@/lib/response'
import { AppError } from '@/lib/errors/AppError'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const result = await listQuestions({
      type: searchParams.get('type'),
      difficulty: searchParams.get('difficulty'),
      limit: Math.min(Number(searchParams.get('limit')) || 20, 50),
      offset: Number(searchParams.get('offset')) || 0,
    })

    return paginated(
      result.questions,
      result.total,
      1,
      result.questions.length,
    )
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
```

#### `questions/random/route.ts` — Sau khi sửa

**Thay đổi so với hiện tại:**
- `prisma.question.findMany()` → dời vào repository
- Fisher-Yates shuffle → dời vào service
- `NextResponse.json()` → thay bằng `success()`

```typescript
import { type NextRequest } from 'next/server'
import { getRandomQuestions } from '@/api/quiz/quiz.service'
import { success, error } from '@/lib/response'
import { AppError } from '@/lib/errors/AppError'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const result = await getRandomQuestions({
      type: searchParams.get('type'),
      difficulty: searchParams.get('difficulty'),
      limit: Math.min(Number(searchParams.get('limit')) || 20, 50),
    })

    return success(result)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
```

#### `stats/route.ts` — Sau khi sửa

**Thay đổi so với hiện tại:**
- `getUserId()` → dời vào `auth-utils`
- Tất cả Prisma queries → dời vào repository
- Logic tính typeStats/accuracy → dời vào service
- `NextResponse.json()` → thay bằng `success()`

```typescript
import { getUserId } from '@/lib/auth-utils'
import { getUserStats } from '@/api/quiz/quiz.service'
import { success, error } from '@/lib/response'
import { AppError } from '@/lib/errors/AppError'

export async function GET() {
  try {
    const userId = await getUserId()
    const stats = await getUserStats(userId)
    return success(stats)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
```

---

## 6. So sánh Trước/Sau cho route hiện tại

### attempts/route.ts

```
TRƯỚC (67 dòng):                                         SAU (28 dòng):
┌─────────────────────────────────────┐                  ┌─────────────────────────────┐
│ import { auth } from '@/lib/auth'   │                  │ import { getUserId }         │
│ import { prisma } from '@/lib/prisma'│                  │   from '@/lib/auth-utils'    │
│                                     │                  │ import { submitAttempt }     │
│ getUserId() { ... }                 │  → DỜI VÀO       │   from '@/api/quiz/quiz.service'│
│   auth() → session → upsert dev     │    auth-utils.ts  │ import { success, error }    │
│                                     │                  │   from '@/lib/response'      │
│ POST(request) {                     │                  │ import { AppError }          │
│   const userId = await getUserId()  │                  │   from '@/lib/errors/AppError'│
│   const body = await request.json() │                  │                             │
│   const { questionId, ... } = body  │                  │ POST(request) {              │
│                                     │                  │   const userId = getUserId() │
│   // DB QUERY                        │                  │   const body = request.json()│
│   const question = await            │  → DỜI VÀO       │   const result = submitAttempt│
│     prisma.question.findUnique({    │    repository     │     (body, userId)           │
│       where: { id: questionId },    │                  │   return success(result)     │
│       include: { options: true },   │                  │ } catch (e) {                │
│     })                              │                  │   if(e instanceof AppError)  │
│                                     │                  │     return error(...)        │
│   // VALIDATE                        │                  │   return error(500)          │
│   const selectedOption =            │  → DỜI VÀO       │ }                            │
│     question.options.find(...)      │    service        └─────────────────────────────┘
│   if (!selectedOption) return 400   │
│                                     │
│   // DB QUERY                        │
│   const attempt = await             │  → DỜI VÀO
│     prisma.attempt.create({ ... })  │    repository
│   await prisma.question.update(     │
│     { timesUsed: { increment: 1 } })│
│                                     │
│   const correctOptionId =           │  → DỜI VÀO
│     question.options.find(          │    service
│       o => o.isCorrect)?.id         │
│                                     │
│   return NextResponse.json({        │  → THAY BẰNG
│     attempt, correctOptionId,       │    success()
│     rationale,                      │
│   })                                │
└─────────────────────────────────────┘
```

---

## 7. Kiểm tra sau refactor

```bash
# 1. TypeScript check — không được có lỗi
pnpm typecheck

# 2. Build thử
pnpm build

# 3. Chạy dev server
pnpm dev

# 4. Test từng API
#    Lấy danh sách
curl http://localhost:3000/api/questions?type=comparison
#    Random
curl http://localhost:3000/api/questions/random
#    Submit (lấy ID thật từ DB trước)
curl -X POST http://localhost:3000/api/attempts \
  -H "Content-Type: application/json" \
  -d '{"questionId":"<id>","selectedOptionId":"<opt_id>"}'
#    Stats
curl http://localhost:3000/api/stats

# 5. Test UI
#    http://localhost:3000 → click practice → chọn đáp án → xem kết quả
```
