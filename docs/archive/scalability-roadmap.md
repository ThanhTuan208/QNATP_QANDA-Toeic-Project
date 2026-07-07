# Scalability Roadmap — Từ Monolith hiện tại → Enterprise-ready

> Mục tiêu: Thêm blogs, listening, writing mà code vẫn sạch, dễ maintain, dễ thêm dev mới.

---

## 1. Vấn đề hiện tại cần giải quyết

| Vấn đề | Hiện tại | Hậu quả khi scale |
|---|---|---|
| API gộp 3 layer | `route.ts` chứa parse + logic + DB | File phình to, khó test, khó reuse |
| Không middleware pattern | Auth gọi `auth()` trong từng route | Mỗi route tự xử lý auth → dễ quên, khó đồng bộ |
| Không response format chuẩn | Mỗi route tự `NextResponse.json(...)` | Client xử lý không nhất quán |
| Không error handling chuẩn | `try/catch` thủ công từng route | Dễ sót error, khó debug |
| Feature pattern chỉ cho FE | `features/quiz/` chỉ có hooks + components | BE không có cấu trúc tương ứng |

---

## 2. Cấu trúc đề xuất

### 2a. Tổng quan

```
src/
├── app/                    ← Next.js App Router (GIỮ NGUYÊN cho FE pages)
│   ├── (main)/
│   │   ├── practice/
│   │   └── dashboard/
│   └── api/                ← CHỈ còn route nhẹ, gọi service layer
│       ├── questions/route.ts     ← ~5 dòng (parse + gọi service)
│       ├── attempts/route.ts      ← ~5 dòng
│       └── stats/route.ts
│
├── api/                    ← [MỚI] Service + Repository layer
│   ├── auth/
│   │   ├── auth.service.ts       ← Business logic: login, register, refresh
│   │   └── auth.repository.ts    ← DB queries: findUser, createSession
│   ├── quiz/
│   │   ├── quiz.service.ts       ← Logic: random questions, check answer
│   │   └── quiz.repository.ts    ← DB: findQuestions, createAttempt
│   ├── blog/                     ← [TƯƠNG LAI]
│   ├── listening/                ← [TƯƠNG LAI]
│   └── writing/                  ← [TƯƠNG LAI]
│
├── features/               ← FE modules (GIỮ NGUYÊN pattern hiện tại)
│   ├── quiz/
│   ├── blog/                     ← [TƯƠNG LAI]
│   └── listening/                ← [TƯƠNG LAI]
│
├── lib/                    ← [MỞ RỘNG] Shared infrastructure
│   ├── middleware/
│   │   ├── auth.middleware.ts    ← Kiểm tra session, gán userId
│   │   ├── validate.middleware.ts← Zod validation
│   │   └── error.middleware.ts   ← Bắt lỗi tập trung
│   ├── errors/
│   │   └── AppError.ts           ← Base error class
│   ├── response.ts               ← Response helper: success(), error(), paginated()
│   ├── prisma.ts                 ← Prisma client (giữ nguyên)
│   └── auth.ts                   ← NextAuth config (giữ nguyên)
│
└── types/                  ← [MỚI] Shared types
    ├── api.ts                    ← Request/Response generics
    └── pagination.ts             ← Pagination types
```

### 2b. Luồng request mới

```
Browser
  │
  │ POST /api/attempts
  ▼
src/app/api/attempts/route.ts         ← Route: parse request, gọi service
  │  export async function POST(req) {
  │    const { questionId, optionId } = await req.json()
  │    const result = await quizService.submitAttempt(questionId, optionId)
  │    return success(result)
  │  }
  ▼
src/api/quiz/quiz.service.ts           ← Service: business logic
  │  async submitAttempt(questionId, optionId) {
  │    const question = await quizRepo.findQuestionWithOptions(questionId)
  │    const isCorrect = question.options.find(o => o.id === optionId)?.isCorrect
  │    return quizRepo.createAttempt(questionId, optionId, isCorrect)
  │  }
  ▼
src/api/quiz/quiz.repository.ts        ← Repository: DB queries
  │  async findQuestionWithOptions(id) {
  │    return prisma.question.findUnique({ where: { id }, include: { options: true } })
  │  }
  ▼
Prisma → PostgreSQL
```

### 2c. Response format chuẩn

```typescript
// lib/response.ts
export function success<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message: message ?? 'Success',
    timestamp: new Date().toISOString(),
  })
}

export function paginated<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    timestamp: new Date().toISOString(),
  })
}

export function error(message: string, status: number = 400, code?: string) {
  return NextResponse.json(
    { success: false, message, code, timestamp: new Date().toISOString() },
    { status },
  )
}
```

---

## 3. Lộ trình thay đổi — Theo phase

### Phase 1: Nền tảng (làm ngay — 1-2 ngày)

| Việc | File |
|------|------|
| Tạo `lib/errors/AppError.ts` | Base error class |
| Tạo `lib/response.ts` | Standard response helpers |
| Tạo `api/quiz/quiz.repository.ts` | Move Prisma queries từ route sang đây |
| Tạo `api/quiz/quiz.service.ts` | Move business logic từ route sang đây |
| Tạo `lib/middleware/auth.middleware.ts` | Auth guard dùng chung |
| Sửa route hiện tại | Route chỉ gọi service + response helper |

### Phase 2: Blog feature (khi cần)

```
api/blog/
├── blog.service.ts          ← CRUD logic
├── blog.repository.ts       ← Prisma queries
└── blog.validation.ts       ← Zod schemas

features/blog/
├── types.ts
├── components/
└── hooks/
```

### Phase 3: Listening feature (khi cần)

- Thêm schema Prisma cho audio files
- `api/listening/` — service + repository
- `lib/upload/` — xử lý file upload (MinIO/S3)
- `features/listening/` — FE components

---

## 4. File hiện tại cần sửa — Chi tiết

### Route attempts — Trước vs Sau

```typescript
// HIỆN TẠI: route.ts (67 dòng — parse + logic + DB)
export async function POST(request: NextRequest) {
  const userId = await getUserId()
  const body = await request.json()
  const { questionId, selectedOptionId, timeSpentSeconds } = body
  const question = await prisma.question.findUnique({ ... })
  const selectedOption = question.options.find(...)
  const attempt = await prisma.attempt.create({ ... })
  await prisma.question.update({ ... })
  return NextResponse.json({ ... })
}

// SAU: route.ts (~10 dòng)
export async function POST(request: NextRequest) {
  const userId = await authMiddleware(request)    // auth guard
  const body = await request.json()
  const result = await quizService.submitAttempt(body, userId)
  return success(result)
}
```

### Quiz service — file mới

```typescript
// src/api/quiz/quiz.service.ts
export class QuizService {
  async submitAttempt(input: SubmitAttemptInput, userId: string) {
    const question = await quizRepo.findQuestionWithOptions(input.questionId)
    if (!question) throw new NotFoundError('Question')
    const selectedOption = question.options.find(o => o.id === input.selectedOptionId)
    if (!selectedOption) throw new ValidationError('Invalid option')
    return quizRepo.createAttempt({
      userId,
      questionId: input.questionId,
      selectedOptionId: input.selectedOptionId,
      isCorrect: selectedOption.isCorrect,
      timeSpentSeconds: input.timeSpentSeconds ?? 0,
    })
  }
}
```

### Quiz repository — file mới

```typescript
// src/api/quiz/quiz.repository.ts
export class QuizRepository {
  async findQuestionWithOptions(id: string) {
    return prisma.question.findUnique({
      where: { id },
      include: { options: true },
    })
  }
  async createAttempt(data: CreateAttemptInput) {
    return prisma.attempt.create({ data })
  }
}
```

---

## 5. So sánh file count — Dự kiến

| Layer | Hiện tại | Sau Phase 1 | Sau Phase 2 (có blog) |
|---|---|---|---|
| API routes | 4 files | 4 files | 8 files |
| Services | 0 | 1 | 3 |
| Repositories | 0 | 1 | 3 |
| Middleware | 0 | 2 | 3 |
| Shared lib | 5 files | 8 files | 10 files |
| **Tổng** | **~20 files** | **~25 files** | **~40 files** |

File count tăng nhưng mỗi file nhỏ hơn, rõ ràng hơn, dễ test hơn.
