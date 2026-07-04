# So sánh kiến trúc: phf-api vs TOEIC Reading

> `phf-api`: Express 5 + Prisma + TypeScript (pure backend)
> `TOEIC`: Next.js 16 App Router + Prisma + TypeScript (FE+BE monolith)

---

## 1. Tổng quan kiến trúc

| Tiêu chí | phf-api | TOEIC Reading |
|---|---|---|
| **Pattern** | Layered (5 layers) | Feature-based (modular) |
| **Framework** | Express 5 | Next.js 16 App Router |
| **Vai trò** | Pure Backend API | Monolith (FE + BE cùng project) |
| **API style** | RESTful (`/api/v1/...`) | Next.js API Routes (`/api/...`) |
| **Port** | 5001 (dev) | 3000 (dev) |
| **Deploy** | VPS + PM2 | Vercel (serverless) |

---

## 2. Cấu trúc thư mục — Đối chiếu

### phf-api — 5-layer xoay theo chức năng

```
src/
├── api/routes/          ← Layer 1: Route (định tuyến)
├── controllers/         ← Layer 2: Controller (xử lý request)
├── services/            ← Layer 3: Service (business logic)
├── db/                  ← Layer 4: Data Access (Prisma queries)
└── config/prisma.config.ts  ← Layer 5: Prisma Client

Các thư mục ngang:
├── middleware/          ← Xuyên suốt: auth, validation, error, rate-limit
├── types/               ← DTOs: request/, response/
├── constant/            ← Enum, status, hằng số
├── extensions/          ← Transform response data
└── utils/               ← AppError, jwt, email, excel, upload...
```

**Luồng request:**
```
Route → Middleware chain → Controller → Service → DB → Prisma → PostgreSQL
```

### TOEIC Reading — Feature-based (module xoay theo domain)

```
src/
├── app/                 ← Next.js App Router
│   ├── page.tsx         ← FE: Landing page
│   ├── layout.tsx       ← FE: Root layout
│   ├── (main)/          ← FE: Pages có sidebar
│   └── api/             ← BE: API Routes
│       ├── questions/   ←   /api/questions
│       ├── attempts/    ←   /api/attempts
│       └── stats/       ←   /api/stats
│
├── features/            ← Mỗi feature là 1 module độc lập
│   └── quiz/
│       ├── types.ts           ← Định nghĩa data
│       ├── constants.ts       ← Hằng số
│       ├── client/quiz.client.ts  ← API call functions (client → server)
│       ├── utils/                ← Pure logic (không React, không API)
│       ├── hooks/             ← React hooks (orchestration + state)
│       └── components/        ← UI components
│
├── components/          ← Shared components (shadcn/ui)
├── lib/                 ← Prisma client, auth config, utils
└── env.ts               ← Environment validation
```

---

## 3. Luồng xử lý request — So sánh tương ứng

### phf-api (Login request)
```
POST /api/v1/auth/login
  │
  ├─ auth.route.ts
  │   └─ router.post("/login", validateRequest("login"), authController.login)
  │
  ├─ auth.middleware.ts         (nếu cần protect)
  ├─ validation.middleware.ts   (validate body/query)
  │
  ├─ auth.controller.ts
  │   └─ login = catchAsyncError(async (req, res) => { ... })
  │
  ├─ auth.service.ts
  │   └─ login(email, password) → check pass, generate tokens
  │
  └─ auth.db-prisma.ts
      └─ findUserByEmail(email) → prisma.user.findUnique(...)
```

### TOEIC Reading (Submit attempt request)
```
POST /api/attempts
  │
  ├─ Next.js tự match route → src/app/api/attempts/route.ts
  │
  ├─ attempts/route.ts
  │   └─ export async function POST(request: NextRequest)
  │       ├─ getUserId() → auth()
  │       ├─ request.json() → { questionId, selectedOptionId }
  │       └─ prisma.question.findUnique(...)  // DB gọi thẳng, không qua service layer
  │
  └─ Response → client → dispatch(SUBMIT_SUCCESS) → re-render
```

---

## 4. Kiến trúc layer — Ánh xạ

| phf-api Layer | TOEIC Layer | Ghi chú |
|---|---|---|
| **Route** (`api/routes/`) | **API Routes** (`app/api/*/route.ts`) | Next.js tự động match route bằng file system |
| **Controller** | **route.ts** (chính nó) | TOEIC có thể gộp controller vào route cho logic đơn giản |
| **Service** (business logic) | **Service** (`src/api/*/*.service.ts`) | `quiz.service.ts` — business logic thuần |
| **DB** (data access) | **Repository** (`src/api/*/*.repository.ts`) | `quiz.repository.ts` — DB layer riêng |
| **Middleware** | — (không có middleware pattern) | Next.js không có express-style middleware cho API routes |

### Điểm khác biệt chính

**1. TOEIC đã tách Service + Repository layer**

```typescript
// TOEIC route.ts: chỉ làm controller — gọi service
import { quizService } from '@/api/quiz/quiz.service'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = await quizService.submitAttempt(body)
  return NextResponse.json(result)
}
```

```typescript
// quiz.service.ts: business logic
export async function submitAttempt(input: SubmitInput) {
  const question = await quizRepo.findQuestion(input.questionId)
  const isCorrect = question.correctOptionId === input.selectedOptionId
  const attempt = await quizRepo.createAttempt({ ... })
  return { isCorrect, ... }
}
```

```typescript
// quiz.repository.ts: data access
export async function createAttempt(data: CreateAttemptInput) {
  return prisma.attempt.create({ data })
}
```

```typescript
// phf-api: tách 3 layer rõ ràng
// Controller
export const login = catchAsyncError(async (req, res) => {
  const result = await authService.login(req.body)
  res.json(result)
})

// Service  
async login(input: LoginInput) {
  const user = await userDb.findByEmail(input.email)
  // business logic: check pass, generate token...
}

// DB
async findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}
```

**2. TOEIC feature module tự quản lý state client**

```typescript
// TOEIC: hooks quản lý state React
// features/quiz/hooks/useQuizAttempt.ts
const [state, dispatch] = useReducer(attemptReducer, INITIAL_STATE)
// vừa gọi API, vừa quản lý UI state
```

```typescript
// phf-api: không có client state — chỉ trả JSON
res.json({ token, user })
// Client tự quản lý state (Zustand, Redux...)
```

**3. TOEIC có "controllers" là pure function (không React, không API)**

```typescript
// features/quiz/utils/quiz.utils.ts
export function parseImportedJSON(raw: string, type: string): Question[] {
  // Pure function: cùng input → cùng output
  // Không import React, không gọi API
  return JSON.parse(raw).map(...)
}
```

Đây là layer tương đương `service` layer của phf-api — business logic thuần túy, dễ test unit.

---

## 5. Database layer — So sánh

| Tiêu chí | phf-api | TOEIC Reading |
|---|---|---|
| **Prisma schema** | Multi-schema (5 schemas) | Single schema |
| **DB layer** | Riêng: `src/db/*.db-prisma.ts` | Gọi Prisma trực tiếp trong route.ts |
| **ID generation** | Sonyflake (Snowflake 64-bit) | cuid (mặc định Prisma) |
| **Raw SQL** | Có (`prisma.$queryRaw`) | Không |
| **Seed** | File `.sql` riêng | `prisma/seed.ts` |

---

## 6. Tổng kết — Cái nào "tốt hơn"?

**Không có cái nào "tốt hơn"** — mỗi cái phù hợp với mục đích khác nhau:

```
phf-api (Express layered):
  - Dự án lớn, nhiều module (ERP: HR, Sales, Inventory, Accounting)
  - Cần test riêng từng layer (unit test service, mock DB)
  - Nhiều dev cùng làm → phân chia rõ ràng
  - Cần reuse business logic giữa nhiều endpoint
  → 5-layer là chuẩn cho enterprise backend

TOEIC (Next.js feature-based):
  - Dự án nhỏ, 1 feature chính (quiz)
  - FE + BE cùng project → giảm boilerplate
  - Logic đơn giản, không cần tách service riêng
  - Cần nhanh, ít file, dễ đọc
  → Feature-based là chuẩn cho monolith Next.js
```

**Nếu muốn áp dụng pattern phf-api vào TOEIC:**

```typescript
// Hiện tại (gộp):
// src/app/api/attempts/route.ts (42 dòng — controller + service + db)

// Có thể tách thành:
// src/app/api/attempts/route.ts          ← Route + Controller nhẹ (parse + call service)
// src/features/quiz/services/attempt.service.ts  ← Business logic
// src/features/quiz/db/attempt.db.ts     ← Prisma queries
```

Nhưng điều này chỉ có ý nghĩa nếu feature đủ phức tạp để cần tách. Quiz feature hiện tại chỉ có 2 API calls — việc thêm 2 layer nữa sẽ tạo boilerplate không cần thiết.
