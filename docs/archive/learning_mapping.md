# Learning Mapping — tnp-ui-web → TOEIC Reading

> Đối chiếu từng thư viện, pattern, flow giữa dự án cũ và mới.  
> Xác định: **cái nào giữ nguyên, cái nào thay đổi, cái nào học mới.**

---

## 1. Tổng quan kiến trúc

### tnp-ui-web (kiến trúc hiện tại)

```
Browser
  │
  ▼
Next.js (App Router)
  ├── Server Components (layout, landing)
  ├── Client Components (pages có tương tác)
  │     │
  │     ▼
  │   Axios ───HTTPS──→ .NET Backend API
  │                       │
  │                       ▼
  │                     SQL Server
  │
  └── Zustand (auth state, client state)
```

### TOEIC Reading (Option A — kiến trúc mới)

```
Browser
  │
  ▼
Next.js (App Router)
  ├── Server Components
  │     │
  │     ├── trực tiếp gọi Prisma (DB)
  │     │
  │     └── render sẵn HTML cho client
  │
  ├── API Routes / Server Actions
  │     │
  │     ├── gọi Prisma
  │     │
  │     └── trả về JSON
  │
  ├── Client Components
  │     │
  │     ├── gọi API Routes (fetch thay vì Axios)
  │     │
  │     └── hoặc gọi Server Actions trực tiếp
  │
  └── NextAuth (thay Zustand auth)
```

### Thay đổi chính

| Khía cạnh | tnp-ui-web | TOEIC Reading |
|-----------|-----------|---------------|
| **Backend** | .NET riêng (container riêng) | **API Routes trong Next.js** (1 container) |
| **Database** | SQL Server (container riêng) | **PostgreSQL (Neon — cloud)** |
| **ORM** | EF Core (trong .NET) | **Prisma** (trong Next.js) |
| **Auth** | Custom Zustand + Axios interceptor | **NextAuth.js** (thư viện chính thống) |
| **HTTP client** | Axios | **fetch** (native) hoặc **ky** (nhẹ hơn Axios) |
| **API call pattern** | Client → Axios → .NET API | Server Component → **Prisma trực tiếp** |
| **Deploy** | Docker Compose (VPS) | **Vercel** (serverless) |

---

## 2. Đối chiếu từng thư viện

### 2.1 Frontend Core

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **Next.js** | 16.2.4 App Router | 14+ (hoặc 16) App Router | ✅ Giống — không đổi |
| **React** | 19.2.4 | 18+/19+ | ✅ Giống |
| **TypeScript** | ^5 strict | ^5 strict | ✅ Giống |
| **pnpm** | ✅ | ✅ | ✅ Giống |

### 2.2 UI & Styling

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **Tailwind CSS** | v4 (PostCSS) | v4 | ✅ Giống |
| **shadcn/ui** | base-luma style | base-luma hoặc neutral | ✅ Giống — copy components |
| **lucide-react** | ✅ icons | ✅ icons | ✅ Giống |
| **clsx + tailwind-merge** | ✅ cn() | ✅ cn() | ✅ Giống |
| **class-variance-authority** | ✅ CVA | ✅ CVA | ✅ Giống |
| **framer-motion** | ✅ | ✅ animations | ✅ Giống |
| **sonner** | ✅ toast | ✅ toast | ✅ Giống |

**→ Copy toàn bộ UI stack, không đổi gì.**

### 2.3 Form & Validation

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **react-hook-form** | ✅ v7 | ✅ v7 | ✅ Giống |
| **@hookform/resolvers** | ✅ | ✅ | ✅ Giống |
| **zod** | ✅ v4 | ✅ v4 | ✅ Giống |

**→ Form patterns giữ nguyên. Chỉ cần copy.**

### 2.4 State Management & Data Fetching

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **@tanstack/react-query** | ✅ v5 queries + mutations | ✅ v5 | ⚠️ Giống pattern nhưng khác nguồn dữ liệu |
| **zustand** | ✅ auth-store | ❌ **Bỏ** (NextAuth thay thế) | 🔴 Thay đổi |
| **@lukemorales/query-key-factory** | ✅ | ❌ **Bỏ** (không cần thiết cho MVP) | 🔴 Bỏ |

**Chi tiết thay đổi React Query:**

```
tnp-ui-web:                           TOEIC Reading:
  useQuery({                            useQuery({
    queryFn: () => axios.get(...)          queryFn: () => fetch('/api/...')
  })                                       | hoặc
                                         })|
                                         Server Component gọi Prisma trực tiếp
                                         (không cần React Query)
```

→ React Query vẫn dùng cho **Client Component** cần realtime/tương tác.  
→ **Server Component** có thể gọi Prisma thẳng, không cần React Query.

### 2.5 HTTP Client

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **axios** | ✅ | ❌ **Bỏ** | 🔴 Thay bằng fetch native hoặc ky |
| **fetch native** | ❌ | ✅ **Dùng** (Next.js extend fetch với caching) | 🔴 API routes internal |
| **@hey-api/openapi-ts** | ✅ SDK gen | ❌ **Bỏ** (không có OpenAPI) | 🔴 Không cần |

**Giải thích:** Ở TOEIC, backend là API Routes trong Next.js.  
Gọi API routes từ client component → dùng `fetch('/api/questions')`.  
Gọi DB từ server component → dùng `prisma.question.findMany()`.

```
tnp-ui-web flow:
  Client → axios.get('https://api.example.com/questions') → .NET → SQL

TOEIC flow:
  Client → fetch('/api/questions') → API Route → prisma → PostgreSQL
  ─ hoặc ─
  Server Component → prisma.question.findMany() → render HTML
```

### 2.6 Authentication

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **next-auth** | ❌ (cài nhưng không dùng) | ✅ **Dùng chính thức** | 🔴 Học mới |
| **zustand auth-store** | ✅ custom | ❌ **Bỏ** | 🔴 Thay bằng NextAuth |
| **Axios interceptor** (401 retry) | ✅ | ❌ **Bỏ** | 🔴 Không cần |
| **CSRF token** | ✅ | ❌ **Bỏ** | 🔴 NextAuth xử lý |

**So sánh flow auth:**

```
tnp-ui-web (custom):
  Login → POST /api/auth/login → nhận token
  → lưu accessToken trong Zustand
  → refreshToken trong HttpOnly cookie
  → Axios interceptor tự động refresh khi 401

TOEIC (NextAuth.js):
  Login → gọi signIn() → NextAuth tự xử lý
  → session lưu trong JWT hoặc database
  → useSession() hook tự động quản lý
  → getServerSession() trong Server Component
```

### 2.7 Tooling & Quality

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **Biome** | ✅ v2 | ✅ v2 | ✅ Giống |
| **ESLint** | ✅ (cả ESLint + Biome) | ❌ **Bỏ** hoặc giữ 1 | ⚠️ Chỉ dùng Biome |
| **Vitest** | ✅ v4 | ✅ v4 | ✅ Giống |
| **Playwright** | ✅ | ✅ | ✅ Giống |
| **@testing-library/react** | ✅ | ✅ | ✅ Giống |
| **MSW** | ✅ mock API | ❌ **Bỏ** (mock Prisma thay thế) | 🔴 Thay bằng Prisma mock |

**Biome config có thể copy nguyên từ tnp-ui-web:**
```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "semicolons": "asNeeded"
    }
  }
}
```

### 2.8 Database & ORM

| Thư viện | tnp-ui-web | TOEIC Reading | Thay đổi |
|----------|:----------:|:-------------:|:--------:|
| **Prisma** | ❌ | ✅ **Học mới** | 🔴 Mới hoàn toàn |
| **PostgreSQL** | ❌ (dùng SQL Server) | ✅ **Học mới** | 🔴 Mới hoàn toàn |
| **EF Core** | ✅ (trong .NET BE) | ❌ **Bỏ** | 🔴 Thay bằng Prisma |
| **Dapper** | ✅ (trong .NET BE) | ❌ **Bỏ** | 🔴 Không cần |

**Đây là phần thay đổi lớn nhất. Cần học từ đầu.**

---

## 3. So sánh Data Flow — Từng tầng

### 3.1 Auth Flow

```
tnp-ui-web:                          TOEIC Reading:
                                      ─────────────────
Login Form                           Login Form
  → useLoginForm() hook                → signIn('credentials')
    → useMutation()                      → NextAuth tự gọi authorize()
      → axios.post('/auth/login')          → prisma.user.findUnique()
        → .NET BE validate                   → verify password
          → generate JWT                      → tạo session
          → trả về token                      → redirect /dashboard
    → lưu vào Zustand
    → redirect /dashboard
                                      ─────────────────
Page load (F5)                        Page load (F5)
  → useAuth() hook                      → getServerSession() (server)
    → performRefresh()                    → session có sẵn trong request
      → POST /api/auth/refresh-token      → không cần gọi API
      → GET /api/auth/me                
    → set user vào Zustand
                                      ─────────────────
Protected route                       Protected route
  → AuthGuard component kiểm tra        → Middleware.ts kiểm tra session
    token trong Zustand                    → redirect nếu không có
  → nếu không có → redirect /login
```

### 3.2 Quiz Flow

```
tnp-ui-web:                          TOEIC Reading:
                                      ─────────────────
User vào /practice                    User vào /practice
  → Client Component                    → Server Component
    → axios.get('/api/questions')         → prisma.question.findMany()
    → React Query cache                   → render HTML sẵn
    → render question
                                      ─────────────────
User chọn đáp án                      User chọn đáp án
  → Client Component                     → Client Component
    → validation (Zod)                     → validation (Zod)
    → axios.post('/api/attempt')           → Server Action (function call)
      → .NET BE lưu vào DB                   → prisma.attempt.create()
    → nhận kết quả                          → trả về { correct, rationale }
    → hiển thị rationale                    → hiển thị rationale
                                      ─────────────────
Xem dashboard                         Xem dashboard
  → axios.get('/api/stats')            → Server Component
    → React Query                        → prisma.attempt.aggregate()
    → render chart                       → render chart trực tiếp
```

### 3.3 Admin Flow

```
tnp-ui-web:                          TOEIC Reading:
                                      ─────────────────
Câu hỏi list                          Câu hỏi list
  → Server Component (table)            → Server Component
    → fetch + render                      → prisma.question.findMany()
  → Client Component (edit modal)      → Client Component (edit modal)
    → axios.put('/api/questions/:id')     → Server Action
      → .NET BE update                      → prisma.question.update()
                                      ─────────────────
Import JSON                            Import JSON
  → Client Component                     → Client Component
    → đọc file                             → đọc file
    → axios.post('/api/questions/bulk')    → Server Action
      → .NET BE parse + save                 → prisma.question.createMany()
    → refresh list                          → refresh list
```

---

## 4. Đối chiếu code mẫu — Từng thư viện cụ thể

### 4.1 API Route (thay cho .NET Controller)

```typescript
// .NET (tnp-ui-web)
[ApiController]
[Route("api/questions")]
public class QuestionsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetQuestions([FromQuery] QuestionType? type)
    {
        var query = _context.Questions.AsQueryable();
        if (type.HasValue)
            query = query.Where(q => q.Type == type.Value);
        var questions = await query.Include(q => q.Options).ToListAsync();
        return Ok(questions);
    }
}
```

```typescript
// Next.js API Route (TOEIC)
// app/api/questions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const where = type ? { type: type as QuestionType } : {}

  const questions = await prisma.question.findMany({
    where,
    include: { options: true },
  })

  return NextResponse.json(questions)
}
```

### 4.2 Prisma Query (thay cho EF Core)

```csharp
// EF Core (tnp-ui-web .NET backend)
var attempts = await _context.Attempts
    .Where(a => a.UserId == userId && a.IsCorrect)
    .GroupBy(a => a.Question.Type)
    .Select(g => new { Type = g.Key, Correct = g.Count() })
    .ToListAsync();
```

```typescript
// Prisma (TOEIC)
const stats = await prisma.attempt.groupBy({
  by: ['questionId'],
  where: { userId, isCorrect: true },
  _count: { id: true },
})
```

### 4.3 Server Action (thay cho Axios POST)

```typescript
// tnp-ui-web (Axios)
const { mutate } = useMutation({
  mutationFn: (data: AttemptInput) =>
    axios.post('/api/attempt', data),
})

// TOEIC (Server Action)
'use server'
export async function submitAttempt(data: AttemptInput) {
  const attempt = await prisma.attempt.create({
    data: {
      userId: data.userId,
      questionId: data.questionId,
      selectedOptionId: data.selectedOptionId,
      isCorrect: data.isCorrect,
      timeSpentSeconds: data.timeSpentSeconds,
    },
  })
  return attempt
}
```

### 4.4 NextAuth (thay cho Zustand auth)

```typescript
// tnp-ui-web (Zustand store)
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (email, password) => {
    const res = await axios.post('/auth/login', { email, password })
    set({ user: res.data.user, token: res.data.accessToken })
  },
  logout: () => set({ user: null, token: null }),
}))
```

```typescript
// TOEIC (NextAuth)
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null
        // verify password...
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
}

// Dùng trong Component:
'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

function LoginButton() {
  const { data: session } = useSession()
  if (session) return <button onClick={() => signOut()}>Logout</button>
  return <button onClick={() => signIn()}>Login</button>
}

// Dùng trong Server Component:
import { getServerSession } from 'next-auth'
const session = await getServerSession(authOptions)
```

---

## 5. Lộ trình học — Theo thứ tự

### Bước 1: Prisma schema + migration (2 ngày)

```
EF Core bạn đã biết:
  DbContext + DbSet + Migration + LINQ

Prisma mapping:
  schema.prisma  →  DbContext + attribute annotations
  prisma migrate →  dotnet ef migrations
  prisma studio  →  SQL Server Object Explorer
  findMany()     →  ToListAsync()
  findUnique()   →  FirstOrDefaultAsync()
  create()       →  Add() + SaveChangesAsync()
  update()       →  Update() + SaveChangesAsync()
  delete()       →  Remove() + SaveChangesAsync()
```

📖 **Bài tập:** Tạo schema Question + Option + User. Run migration. Seed data từ `data/questions.json` hiện có.

### Bước 2: PostgreSQL khác SQL Server chỗ nào (2 ngày)

| SQL Server (bạn biết) | PostgreSQL (cần học) |
|-----------------------|---------------------|
| Management Studio | DBeaver |
| `GETDATE()` | `NOW()` |
| `TOP n` | `LIMIT n` |
| `NVARCHAR` | `TEXT` |
| `IDENTITY` | `SERIAL` |
| Không có JSON native | `JSONB` (mạnh) |
| `STRING_AGG` | `string_agg` |
| `ISNULL()` | `COALESCE()` |

📖 **Bài tập:** Tạo 1 database PostgreSQL trên Neon. Dùng DBeaver kết nối. Chạy Prisma migration lên đó.

### Bước 3: Next.js API Routes (2 ngày)

```
Bạn đã biết ASP.NET Controller:
  [Route], [HttpGet], [HttpPost], FromBody, FromQuery

API Routes mapping:
  app/api/questions/route.ts  →  QuestionsController
  export async function GET()  →  [HttpGet]
  export async function POST() →  [HttpPost]
  NextRequest                  →  HttpRequest
  NextResponse.json()          →  Ok() / BadRequest()
  URL.searchParams.get()       →  [FromQuery]
  request.json()               →  [FromBody]
```

📖 **Bài tập:** Tạo API `GET /api/questions` + `POST /api/attempt`. Test bằng Postman.

### Bước 4: Server Actions (1 ngày)

```
Thay vì:
  Client → fetch API → API Route → Prisma

Bạn có thể:
  Client → gọi function → Server Action → Prisma

Không cần tạo API route cho mutation.
```

📖 **Bài tập:** Chuyển `POST /api/attempt` thành Server Action.

### Bước 5: NextAuth.js (2 ngày)

```
Thay vì tự build:
  Login API + JWT + refresh + Zustand store + Axios interceptor

NextAuth xử lý:
  Session management + JWT/Database session + Providers + Middleware
```

📖 **Bài tập:** Setup NextAuth với Credentials provider. protected route bằng middleware.

---

## 6. Tổng kết — Ma trận kiến thức

### Giữ nguyên (copy từ tnp-ui-web)

```
✅ Next.js App Router layout + route groups
✅ Tailwind v4 + shadcn/ui components
✅ react-hook-form + zod
✅ TanStack React Query
✅ Biome (lint + format)
✅ Vitest + Playwright
✅ TypeScript strict mode
✅ Component pattern (folder + index.ts + barrel export)
✅ Feature-based folder structure
```

### Thay đổi nhỏ (cần điều chỉnh)

```
⚠️ React Query: nguồn data là API Routes thay vì Axios đến .NET
⚠️ Form pattern: submit đến Server Action thay vì Axios
```

### Học mới hoàn toàn

```
🔴 Prisma (ORM) — thay EF Core
🔴 PostgreSQL (DB) — thay SQL Server
🔴 NextAuth.js (auth) — thay Zustand auth store + JWT
🔴 Server Components gọi DB trực tiếp — pattern mới
🔴 Server Actions — pattern mới
🔴 API Routes — thay ASP.NET Controllers
🔴 Vercel deploy — thay Docker Compose VPS
```

### Tỉ lệ reuse

```
Kiến thức giữ nguyên:     ~65%
Kiến thức điều chỉnh:     ~15%
Kiến thức học mới:        ~20%
```

20% mới là: **Prisma + PostgreSQL + NextAuth + API Routes + Server Actions.**  
Đây đều là những kỹ năng có giá trị cho dự án sau này.
