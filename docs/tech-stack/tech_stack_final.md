# Tech Stack Final — TOEIC Reading Platform

> Chiến lược: **Chi phí $0 + Học công nghệ mới trong quá trình build MVP**.

---

## 1. Stack chính thức

```
Frontend + Backend:  Next.js 14+ (App Router, TypeScript)
Database ORM:        Prisma
Database:            PostgreSQL (Neon — free tier)
Auth:                NextAuth.js
Deploy:              Vercel (free tier)
Cache:               None ở MVP (có thể thêm Redis sau: Upstash free)
Testing:             Vitest + Playwright
Linting:             ESLint + Prettier (built-in với create-next-app)
```

### Lý do chọn

| Yếu tố | Lý do |
|--------|-------|
| **Chi phí $0** | Vercel free + Neon free + Upstash free = 0đ |
| **Học Prisma** | ORM đang hot, dùng được cho mọi dự án sau |
| **Học PostgreSQL** | Mở rộng tư duy DB (JSONB, array, full-text search) |
| **Học App Router** | Server Components, Server Actions — chuẩn Next.js mới |
| **1 codebase** | FE + BE chung, không cần CORS, deploy 1 lần |
| **TypeScript end-to-end** | Từ DB → API → UI, tận dụng tối đa type safety |

---

## 2. CLI Tools — Danh sách đầy đủ

### 2.1 Bắt buộc (cài trước khi bắt đầu)

| Tool | Mục đích | Cài đặt |
|------|----------|---------|
| **Node.js 20+** | Runtime | `winget install OpenJS.NodeJS.LTS` |
| **pnpm** | Package manager (nhanh hơn npm) | `npm i -g pnpm` |
| **Git** | Version control | `winget install Git.Git` |
| **VS Code** | Editor | `winget install Microsoft.VisualStudioCode` |
| **Postman / Bruno** | Test API | `winget install Postman.Postman` |
| **DBeaver** | GUI cho PostgreSQL | `winget install DBeaver.DBeaver` |

### 2.2 Trong quá trình phát triển

| Tool | Mục đích | Khi nào cài |
|------|----------|:-----------:|
| **Vercel CLI** | Deploy local → production | Tuần 1 |
| **Neon CLI** | Quản lý database branches | Tuần 1 |
| **Prisma CLI** (built-in) | Migration, seed, studio | Tuần 1 |
| **tsx** | Chạy TypeScript script (seed) | Tuần 1 |
| **Vitest** | Unit test | Tuần 2 |
| **Playwright** | E2E test | Tuần 3 |
| **Docker Desktop** | PostgreSQL local (optional) | Khi cần offline |

### 2.3 VS Code Extensions

| Extension | Mục đích | Ưu tiên |
|-----------|----------|:-------:|
| Prisma | Syntax highlight + format | 🔴 |
| Tailwind CSS IntelliSense | Auto-complete class | 🔴 |
| ESLint | Lint on save | 🟠 |
| Prettier | Format on save | 🟠 |
| Thunder Client | Test API trong VS Code | 🟡 |
| GitLens | Git history UI | 🟡 |
| Error Lens | Inline error messages | 🟡 |

---

## 3. Quy trình phát triển từ đầu — Step by Step

### Phase 0: Khởi tạo project (Day 0)

```bash
# 1. Tạo Next.js App
pnpm create next-app@latest toeic-reading --typescript --tailwind --app --eslint
cd toeic-reading

# 2. Init Git
git init
git add .
git commit -m "chore: init Next.js project"

# 3. Cài Prisma
pnpm add prisma @prisma/client
pnpm add -D tsx

# 4. Init Prisma
npx prisma init

# 5. Setup Neon (tạo database)
#    - Vào console.neon.tech → Create project
#    - Copy DATABASE_URL vào .env

# 6. Viết schema → migrate
npx prisma migrate dev --name init

# 7. Cài NextAuth
pnpm add next-auth@beta @auth/prisma-adapter

# 8. Cài shadcn/ui (component library)
pnpm dlx shadcn-ui@latest init

# 9. Commit
git add .
git commit -m "chore: setup prisma + nextauth + shadcn"
```

### Phase 1: Database + Seed Data (Day 1-2)

```
Day 1:
  - Viết Prisma schema hoàn chỉnh (User, Question, Option, Attempt...)
  - Chạy migration
  - Học Prisma: prisma studio, prisma generate, query cơ bản
  
Day 2:
  - Viết seed script (import từ data/questions.json hiện có)
  - Tìm hiểu PostgreSQL: JSONB vs TEXT, array, indexing
  - Kiểm tra data trong DBeaver
```

```bash
# Seed script
pnpm tsx prisma/seed.ts

# Xem data
npx prisma studio
```

### Phase 2: Auth + Core Layout (Day 3-4)

```
Day 3:
  - Setup NextAuth (GitHub provider + Credentials)
  - Tạo AuthProvider wrapper (layout.tsx)
  - Tạo Navbar + ProtectedRoute component
  
Day 4:
  - Tạo layout cơ bản (Navbar, Footer, Container)
  - Tạo trang Landing page
  - Tạo trang Practice (chọn dạng câu hỏi)
```

**NextAuth setup:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Phase 3: Quiz Engine (Day 5-7)

```
Day 5:
  - API: GET /api/questions/random (lọc theo type/difficulty)
  - Component: QuestionCard + OptionButton
  
Day 6:
  - QuizEngine: fetch → render → select → submit
  - Server Action: POST /api/attempt (lưu kết quả)
  - Hiển thị rationale sau khi chọn
  
Day 7:
  - Nút Next → câu tiếp theo
  - Kết thúc → results page
  - Học Prisma relations: include, where, orderBy
```

**Quiz flow:**
```
User vào /practice/session
  → Server Component fetch question từ Prisma
  → Client Component render options
  → User click → Server Action lưu attempt
  → Hiển thị rationale (correct/incorrect + giải thích)
  → Next question hoặc kết thúc
```

### Phase 4: Timed Mode + Dashboard (Day 8-10)

```
Day 8:
  - TestSession model: tạo session, timer
  - Component Timer (đếm ngược)
  - API: start session, submit trong session
  
Day 9:
  - Dashboard: thống kê tổng quan
  - Chart (recharts hoặc chart.js)
  - Lịch sử làm bài (table + filter)
  - Học Prisma aggregate: groupBy, count, avg
  
Day 10:
  - Filter câu hỏi theo type (Word Form, Vocabulary...)
  - Filter theo difficulty
  - Luyện theo dạng cụ thể
```

### Phase 5: Admin (Day 11-13)

```
Day 11:
  - Admin layout + auth guard (admin role)
  - Question list page (table + search + filter)
  
Day 12:
  - Question form (CRUD: thêm/sửa/xóa)
  - Option editor (4 options + rationale)
  
Day 13:
  - Bulk import JSON (drag & drop file)
  - Preview trước khi import
  - Học Prisma: createMany, transaction, upsert
```

### Phase 6: Deploy + Testing (Day 14-16)

```
Day 14:
  - Deploy lên Vercel
  - Setup Neon production database
  - Config environment variables

Day 15:
  - Setup domain + SSL (auto với Vercel)
  - Smoke test tất cả chức năng
  - Fix bugs

Day 16:
  - Vitest: unit test cho utility functions
  - Playwright: E2E test flow chính (login → quiz → result)
  - CI/CD: GitHub Actions → auto test → auto deploy
```

---

## 4. Tech Stack Phased — Xây dựng dần

Không cài hết mọi thứ ngay từ đầu. Dưới đây là lộ trình thêm dần.

### Phase 1 (Week 1): Core Foundation

```
Next.js App Router
├── TypeScript
├── Tailwind CSS
├── Prisma
├── PostgreSQL (Neon)
└── NextAuth.js
```
→ Mục tiêu: Chạy được quiz cơ bản, có auth.

### Phase 2 (Week 2): Features

```
+ shadcn/ui          (UI components: Button, Card, Dialog, Table)
+ recharts           (Biểu đồ dashboard)
+ date-fns           (Format ngày tháng)
+ zod                (Validate form + API input)
```
→ Mục tiêu: Dashboard, admin, timed mode.

### Phase 3 (Week 3): Quality

```
+ Vitest             (Unit test)
+ Playwright         (E2E test)
+ GitHub Actions     (CI/CD: lint → test → deploy)
+ Sentry             (Error tracking, miễn phí cho dev)
```
→ Mục tiêu: Ổn định, tự động hóa.

### Phase 4 (Future — optional)

```
+ Redis (Upstash)           Caching, rate limiting, session store
+ i18n (next-intl)           Hỗ trợ tiếng Anh cho UI
+ PWA (next-pwa)             Install app, offline support
+ AI Integration (OpenAI)    Sinh câu hỏi tự động
+ Spaced Repetition Engine   Lặp lại câu hỏi sai
```

---

## 5. Kiến trúc thư mục

```
toeic-reading/
├── .env                     ← DATABASE_URL, NEXTAUTH_SECRET
├── .env.local               ← Override local
├── prisma/
│   ├── schema.prisma        ← Database schema
│   ├── seed.ts              ← Seed data
│   └── migrations/          ← Auto-generated
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← Root layout (Navbar, AuthProvider)
│   │   ├── page.tsx         ← Landing page
│   │   ├── practice/
│   │   │   ├── page.tsx     ← Chọn dạng/độ khó
│   │   │   └── session/
│   │   │       └── page.tsx ← Quiz engine
│   │   ├── dashboard/
│   │   │   └── page.tsx     ← Thống kê
│   │   ├── admin/
│   │   │   ├── page.tsx     ← Dashboard admin
│   │   │   └── questions/
│   │   │       ├── page.tsx ← List + import
│   │   │       └── [id]/
│   │   │           └── page.tsx ← Edit
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── questions/
│   │       │   ├── route.ts       ← GET list, POST create
│   │       │   ├── random/route.ts← GET random question
│   │       │   └── [id]/route.ts  ← GET, PUT, DELETE
│   │       ├── attempt/
│   │       │   └── route.ts       ← POST submit answer
│   │       ├── session/
│   │       │   └── route.ts       ← POST start, complete
│   │       └── stats/
│   │           └── route.ts       ← GET user stats
│   ├── components/
│   │   ├── ui/                    ← shadcn/ui components
│   │   ├── quiz/
│   │   │   ├── QuizEngine.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── OptionButton.tsx
│   │   │   ├── RationaleBox.tsx
│   │   │   └── Timer.tsx
│   │   ├── dashboard/
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── StatsSummary.tsx
│   │   │   └── AttemptHistory.tsx
│   │   ├── admin/
│   │   │   ├── QuestionList.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   └── JsonImporter.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       └── AuthGuard.tsx
│   ├── lib/
│   │   ├── prisma.ts              ← PrismaClient singleton
│   │   ├── auth.ts                ← NextAuth config
│   │   ├── validations.ts         ← Zod schemas
│   │   └── utils.ts               ← Helper functions
│   └── types/
│       └── index.ts               ← Shared types
├── tests/
│   ├── unit/                      ← Vitest
│   └── e2e/                       ← Playwright
├── public/
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum QuestionSource {
  ETS
  AI
  ADMIN_IMPORT
  MANUAL
}

enum SessionType {
  PRACTICE
  TIMED_TEST
}

enum SessionStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String?
  image         String?
  attempts      Attempt[]
  testSessions  TestSession[]
  createdAt     DateTime      @default(now())
}

model Question {
  id            String        @id @default(cuid())
  questionText  String
  type          QuestionType
  difficulty    Difficulty
  source        QuestionSource @default(MANUAL)
  hint          String?
  note          String?
  isActive      Boolean       @default(true)
  timesUsed     Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  options       Option[]
  attempts      Attempt[]
  tags          QuestionTag[]
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

model Attempt {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  questionId        String
  question          Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  selectedOptionId  String?
  isCorrect         Boolean
  timeSpentSeconds  Int      @default(0)
  testSessionId     String?
  testSession       TestSession? @relation(fields: [testSessionId], references: [id])
  createdAt         DateTime @default(now())

  @@index([userId])
  @@index([testSessionId])
}

model TestSession {
  id                String        @id @default(cuid())
  userId            String
  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  type              SessionType
  timeLimitMinutes  Int?
  totalQuestions    Int           @default(0)
  correctCount      Int           @default(0)
  status            SessionStatus @default(IN_PROGRESS)
  startedAt         DateTime      @default(now())
  completedAt       DateTime?
  attempts          Attempt[]

  @@index([userId])
}

model Tag {
  id          String        @id @default(cuid())
  name        String        @unique
  description String?
  questions   QuestionTag[]
}

model QuestionTag {
  questionId  String
  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  tagId       String
  tag         Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([questionId, tagId])
}
```

---

## 7. Chi tiết Environment Variables

```bash
# .env (root)
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/toeic?sslmode=require"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"    # Generate: openssl rand -base64 32

# GitHub OAuth (optional)
GITHUB_ID=""
GITHUB_SECRET=""

# Production
# Trên Vercel: Set các biến trên trong Dashboard → Environment Variables
```

---

## 8. Scripts trong package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset --force",
    "test": "vitest",
    "test:e2e": "playwright test",
    "deploy": "vercel --prod"
  }
}
```

---

## 9. So sánh: ASP.NET Core Concept → Prisma

| ASP.NET Core | Prisma (Next.js) |
|-------------|------------------|
| `dotnet new webapi` | `create-next-app` |
| `Add-Migration` | `prisma migrate dev` |
| `Update-Database` | `prisma migrate deploy` |
| `DbContext` | `PrismaClient` |
| `DbSet<User> Users` | `prisma.user` |
| `_context.SaveChangesAsync()` | `prisma.$transaction()` |
| `Include(x => x.Options)` | `include: { options: true }` |
| `Where(x => x.Type == type)` | `where: { type: type }` |
| `OrderBy(x => x.CreatedAt)` | `orderBy: { createdAt: 'desc' }` |
| `Select(x => new { x.Id })` | `select: { id: true }` |
| `GroupBy().Count()` | `groupBy: {...}, _count: {...}` |
| `FirstOrDefaultAsync()` | `findFirst()` |
| `ToListAsync()` | `findMany()` |
| `_context.Database.MigrateAsync()` | `prisma migrate deploy` (CLI) |
| FluentValidation | Zod (validate input) |

### SQL Server → PostgreSQL mappings

| SQL Server | PostgreSQL |
|-----------|-----------|
| `GETDATE()` | `NOW()` |
| `IDENTITY(1,1)` | `SERIAL` hoặc `@default(autoincrement())` |
| `NVARCHAR(MAX)` | `TEXT` |
| `DATETIME2` | `TIMESTAMPTZ` |
| `TOP n` | `LIMIT n` |
| `OFFSET n ROWS` | `OFFSET n` |
| `ISNULL(x, val)` | `COALESCE(x, val)` |
| `STRING_AGG` | `string_agg` (tương tự) |
| No native JSON | `JSONB` native |
| `@@IDENTITY` | `RETURNING id` |

---

## 10. Deploy Checklist

```bash
# === PRODUCTION DEPLOY ===

# 1. Push code lên GitHub
git push origin main

# 2. Tạo project trên Vercel
#    - Import từ GitHub
#    - Framework: Next.js (auto detect)
#    - Root directory: ./

# 3. Set environment variables trên Vercel Dashboard
#    DATABASE_URL=<Neon production connection string>
#    NEXTAUTH_URL=<Vercel deployment URL>
#    NEXTAUTH_SECRET=<random string>

# 4. Deploy
npx vercel --prod
#    hoặc: 
git push  # (nếu đã connect GitHub)

# 5. Setup domain (optional)
#    Vercel Dashboard → Domains → Add custom domain

# 6. Kiểm tra
#    - https://toeic-reading.vercel.app
#    - Login flow
#    - Quiz flow
#    - Admin page
```

### Neon production setup

| Environment | Cách dùng |
|------------|-----------|
| **Local dev** | Neon free branch → `DATABASE_URL` trong `.env` |
| **Production** | Tạo branch `prod` trên Neon → URL mới → set trên Vercel |
| **Staging** | Branch `staging` → deploy preview Vercel tự động |

---

## 11. Tổng kết

### Đầu tư thời gian

| Giai đoạn | Thời gian | Kết quả |
|-----------|:---------:|---------|
| Setup tooling + Prisma | 2 ngày | Migration, seed, studio |
| Auth + Layout | 2 ngày | Login, protected routes |
| Quiz Engine | 3 ngày | Core feature hoàn chỉnh |
| Timed Mode + Dashboard | 3 ngày | Thi thử, thống kê |
| Admin | 3 ngày | CRUD + bulk import |
| Deploy + Test | 3 ngày | Production ready |
| **Tổng** | **~16 ngày** | **MVP hoàn chỉnh** |

### Học được gì sau dự án này

| Công nghệ | Mức thành thạo sau MVP |
|-----------|:---------------------:|
| Prisma (schema, migration, query, aggregate) | ⭐⭐⭐⭐ |
| PostgreSQL (khác SQL Server, JSONB, text search) | ⭐⭐⭐ |
| Next.js App Router (Server Components, Server Actions) | ⭐⭐⭐⭐ |
| NextAuth.js | ⭐⭐⭐ |
| Vercel deploy + Neon | ⭐⭐⭐ |
| shadcn/ui + Tailwind | ⭐⭐⭐⭐ |
| Vitest + Playwright | ⭐⭐⭐ |

### Chi phí vận hành

| Dịch vụ | Free tier | Hết hạn |
|---------|:---------:|:-------:|
| Vercel | ✅ | Không |
| Neon PostgreSQL | 0.5GB | Không |
| GitHub | Public repo free | Không |
| **Tổng** | **$0/th** | — |
