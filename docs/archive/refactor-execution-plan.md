# Kế hoạch Refactor — Service + Repository Layer

## Vấn đề hiện tại

1. **Thiếu `AUTH_SECRET`** → `auth()` throw `MissingSecret` → `/api/attempts` trả 404
2. **Code gộp 3 layer trong 1 route** — HTTP parsing, business logic, Prisma queries đều nằm trong file route
3. **Duplicate code** — `getUserId()` lặp ở cả `attempts/route.ts` và `stats/route.ts`
4. **Response format không chuẩn** — mỗi route tự `NextResponse.json()` với format khác nhau

## Kiến trúc target (3 layer)

```
ROUTE LAYER       → Parse HTTP, gọi service, trả response helper
SERVICE LAYER     → Business logic, validation, orchestrate
REPOSITORY LAYER  → Prisma queries thuần túy
```

---

## Danh sách thay đổi (11 files)

### Bước 1: `.env` — Fix lỗi MissingSecret
- **File:** `.env`
- **Thêm:** `AUTH_SECRET="<generated-key>"`
- **Tác dụng:** Auth.js cần secret để ký/verify JWT token
- **Lưu ý:** Secret đã được generate bằng `crypto.randomBytes(32).toString('base64')`

### Bước 2: Tạo `src/lib/response.ts` — Response helpers
- `success<T>(data, message?)` → `{ success: true, data, message }`
- `paginated<T>(data, total, page, limit)` → `{ success: true, data, pagination: {...} }`
- `error(message, status?, code?)` → `{ success: false, message, code }` + HTTP status
- **Mục đích:** Format HTTP response chuẩn cho tất cả route

### Bước 3: Tạo `src/lib/errors/AppError.ts` — Error class
- `AppError` extends `Error` với `statusCode` + `code`
- Static factories: `notFound()`, `validation()`, `unauthorized()`
- **Mục đích:** Service throw lỗi kèm HTTP status, route bắt và trả response tương ứng

### Bước 4: Tạo `src/lib/auth-utils.ts` — Auth utility
- `getUserId()` — gọi `auth()`, fallback dev user nếu chưa login
- **Mục đích:** Gom `getUserId()` từ 2 route vào 1 chỗ (DRY)

### Bước 5: Tạo `src/api/quiz/quiz.repository.ts` — DB queries
- `findQuestionById(id)` → Question + options
- `findQuestions(where)` → Question[] (ẩn isCorrect)
- `findQuestionsPaginated(where, take, skip)` → { questions, total }
- `createAttempt(data)` → Attempt (transaction với timesUsed++)
- `countAttempts(userId)`, `countCorrectAttempts(userId)`
- `findAllAttempts(userId)`, `findRecentAttempts(userId)`
- **Mục đích:** Gom hết Prisma queries, không business logic

### Bước 6: Tạo `src/api/quiz/quiz.service.ts` — Business logic
- `submitAttempt(input, userId)` — validate question/option, gọi repo, trả DTO
- `listQuestions(params)` — build where clause, gọi repo paginated
- `getRandomQuestions(params)` — build where, Fisher-Yates shuffle, slice
- `getUserStats(userId)` — Promise.all 4 queries, tính accuracy + typeStats
- **Mục đích:** Nơi duy nhất có `if/else`, throw `AppError`

### Bước 7: Sửa `src/app/api/attempts/route.ts`
- **Trước:** 67 dòng — tự getUserId, tự query Prisma, tự validate
- **Sau:** ~28 dòng — chỉ parse body + gọi `submitAttempt()` + `success()` / bắt `AppError`

### Bước 8: Sửa `src/app/api/questions/route.ts`
- **Trước:** 39 dòng — tự query Prisma, tự pagination
- **Sau:** ~20 dòng — parse params + gọi `listQuestions()` + `paginated()`

### Bước 9: Sửa `src/app/api/questions/random/route.ts`
- **Trước:** 35 dòng — tự query, tự shuffle
- **Sau:** ~18 dòng — parse params + gọi `getRandomQuestions()` + `success()`

### Bước 10: Sửa `src/app/api/stats/route.ts`
- **Trước:** 60 dòng — tự getUserId, tất cả queries, tính typeStats
- **Sau:** ~15 dòng — gọi `getUserId()` + `getUserStats()` + `success()`

### Bước 11: Verify
- `pnpm typecheck` — TypeScript không lỗi
- `pnpm lint` — Biome không lỗi

---

## Data flow sau refactor

```
Browser → POST /api/attempts
  → Route: parse body, gọi submitAttempt(body, userId)
    → Service: gọi repository.findQuestionById()
      → Repository: prisma.question.findUnique()
    → Service: validate question/option, throw AppError nếu lỗi
    → Service: gọi repository.createAttempt()
      → Repository: prisma.$transaction([create, update timesUsed])
    → Service: trả DTO { attempt, correctOptionId, rationale }
  → Route: success(result) → HTTP 200 { success: true, data: {...} }
```

---

## Thứ tự thực hiện

| Thứ tự | Hành động | File |
|:------:|:---------:|------|
| 1 | Sửa | `.env` — thêm AUTH_SECRET |
| 2 | Tạo mới | `src/lib/response.ts` |
| 3 | Tạo mới | `src/lib/errors/AppError.ts` |
| 4 | Tạo mới | `src/lib/auth-utils.ts` |
| 5 | Tạo mới | `src/api/quiz/quiz.repository.ts` |
| 6 | Tạo mới | `src/api/quiz/quiz.service.ts` |
| 7 | Sửa | `src/app/api/attempts/route.ts` |
| 8 | Sửa | `src/app/api/questions/route.ts` |
| 9 | Sửa | `src/app/api/questions/random/route.ts` |
| 10 | Sửa | `src/app/api/stats/route.ts` |
| 11 | Kiểm tra | `pnpm typecheck && pnpm lint` |
