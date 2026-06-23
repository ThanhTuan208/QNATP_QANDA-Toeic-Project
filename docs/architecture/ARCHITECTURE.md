# Architecture — TOEIC Reading Platform

> Kiến trúc dự án, chức năng từng file, cách mở rộng.

---

## 1. Tổng quan layers

```
┌──────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                           │
│  Next.js App Router (pages, layouts, loading, error)                │
│  Components (shared UI + feature components)                         │
├──────────────────────────────────────────────────────────────────────┤
│                         API LAYER                                    │
│  API Routes (server-side endpoints)                                  │
│  Server Actions (mutation functions)                                 │
├──────────────────────────────────────────────────────────────────────┤
│                         SERVICE LAYER                                │
│  NextAuth (authentication)                                           │
│  Lib utilities (prisma client, helpers, validators)                  │
├──────────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                                   │
│  Prisma ORM (schema, migrations, seed)                               │
│  PostgreSQL (Neon cloud database)                                    │
└──────────────────────────────────────────────────────────────────────┘
```

### Tương đương với ASP.NET Core

| Layer TOEIC | Tương đương ASP.NET Core |
|------------|-------------------------|
| Server Component | `Razor Page` / `View` |
| API Route | `Controller` + `Action` |
| Prisma query | `EF Core LINQ` |
| Prisma schema | `DbContext` + Entity classes |
| NextAuth | `ASP.NET Core Identity` |
| Server Action | `MediatR Command Handler` |

---

## 2. Cấu trúc thư mục chi tiết

### 2.1 Root

```
toeic-reading/
├── .env                     ← DATABASE_URL, NEXTAUTH_SECRET (không commit)
├── .env.example             ← Mẫu env, commit được
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── biome.json               ← Linter + Formatter (thay ESLint + Prettier)
│
├── data/                    ← **Dữ liệu thô, seed data**
│   └── questions.json       ← 33 câu hỏi TOEIC Part 5 (import vào DB qua seed)
│
├── prisma/                  ← **Tầng database**
│   ├── schema.prisma        ← Định nghĩa models, relations, enums
│   ├── seed.ts              ← Script import data/questions.json vào DB
│   └── migrations/          ← Auto-generated from prisma migrate
│
├── public/                  ← Static assets (images, favicon)
│
└── src/                     ← **Toàn bộ source code**
    ├── app/                 ← Next.js App Router (pages + API)
    ├── features/            ← Feature modules
    ├── components/          ← Shared components
    ├── lib/                 ← Utilities, configs
    └── env.ts               ← Env validation
```

### 2.2 src/app/ — Pages (Next.js App Router)

```
src/app/
├── globals.css              ← Tailwind v4 + design tokens (màu sắc, font)
├── layout.tsx               ← Root layout - providers chain + font + metadata
├── page.tsx                 ← Landing page (/, public)
├── favicon.ico
│
├── provider.tsx             ← Providers chain: QueryProvider > SessionProvider
│
├── (auth)/                  ← Route group: không cần auth
│   ├── layout.tsx           ← Layout mỏng: logo + form center
│   ├── login/
│   │   └── page.tsx         ← Trang đăng nhập
│   └── register/
│       └── page.tsx         ← Trang đăng ký
│
├── (main)/                  ← Route group: cần auth
│   ├── layout.tsx           ← Layout dày: sidebar + header + auth guard
│   ├── dashboard/
│   │   └── page.tsx         ← Thống kê cá nhân (doughnut chart, lịch sử)
│   ├── practice/
│   │   └── [type]/
│   │       └── page.tsx     ← Quiz engine (câu hỏi, lý thuyết, submit theo type)
│   └── admin/
│       ├── page.tsx         ← Admin dashboard (overview)
│       └── questions/
│           ├── page.tsx     ← CRUD question list + bulk import JSON
│           └── [id]/
│               └── page.tsx ← Edit 1 question cụ thể
│
└── api/                     ← API Routes (backend endpoints)
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts     ← NextAuth handler (GET+POST)
    ├── questions/
    │   ├── route.ts         ← GET list, POST create question
    │   ├── random/route.ts  ← GET random question (có filter type/difficulty)
    │   └── [id]/route.ts    ← GET, PUT, DELETE 1 question
    ├── attempts/
    │   └── route.ts         ← POST submit answer + lưu kết quả
    └── stats/
        └── route.ts         ← GET user statistics (correct rate, history)
```

#### Giải thích Route Groups

```
(app)/
├── (auth)/login            → URL: /login            layout: mỏng (không sidebar)
├── (main)/dashboard        → URL: /dashboard        layout: dày (có sidebar)
├── (main)/practice         → URL: /practice         layout: dày
├── (main)/practice/session → URL: /practice/session layout: dày
├── (main)/admin/questions  → URL: /admin/questions  layout: dày
├── api/questions           → URL: /api/questions    layout: không có (API)
```

Route groups `(auth)` và `(main)` **không ảnh hưởng URL** — chỉ để nhóm layout.

#### Tương đương ASP.NET

| Next.js App Router | ASP.NET Core |
|-------------------|-------------|
| `layout.tsx` | `_Layout.cshtml` + `_ViewStart.cshtml` |
| `page.tsx` | `Razor Page` hoặc `View` |
| `loading.tsx` | Loading indicator (tự làm) |
| `error.tsx` | `Error.cshtml` / Exception filter |
| `route.ts` | `Controller` + `IActionResult` |
| `[...nextauth]/route.ts` | `app.MapIdentityApi()` |

### 2.3 src/features/ — Feature Modules

```
src/features/
├── auth/
│   ├── types.ts             ← Kiểu: LoginInput, RegisterInput, AuthResponse
│   └── schemas/
│       ├── login.schema.ts  ← Zod validation: email + password rules
│       └── register.schema.ts ← Zod: email, password, confirmPassword
│
├── quiz/
│   ├── types.ts             ← Kiểu: Question, Option, Attempt, QuizState
│   ├── constants.ts         ← Label maps, OPTION_LABELS, VALID_QUIZ_TYPES
│   ├── api/
│   │   └── quiz.api.ts      ← fetchQuestions(), submitAttempt()
│   ├── controllers/
│   │   ├── quiz.controller.ts     ← generateTemplate, generatePrompt, parseImportedJSON
│   │   ├── question.controller.ts ← getOptionStatus()
│   │   └── theory.controller.tsx  ← THEORY_DATA, getTheoryContent()
│   ├── hooks/
│   │   ├── useQuizQuestions.ts    ← Load questions + current index
│   │   ├── useQuizAttempt.ts      ← Answer flow state machine (useReducer)
│   │   ├── useQuizImport.ts       ← Import dialog state
│   │   └── useQuizEngine.ts       ← Orchestrator: compose 3 hooks trên
│   └── components/
│       ├── QuizEngine/       ← Smart component: call useQuizEngine, render children
│       ├── QuestionCard/     ← Render question text + 4 options
│       ├── OptionButton/     ← 1 button đáp án (A/B/C/D) + trạng thái
│       ├── RationaleBox/     ← Hiển thị giải thích sau khi chọn
│       ├── ImportDialog/     ← Dialog nhập JSON câu hỏi
│       └── sections/         ← Feature sections (QuizSection, TheorySection, PracticeHeaderSection)
│
└── dashboard/
    ├── types.ts             ← Kiểu: Stats, ChartData, AttemptHistory
    └── components/
        ├── ProgressChart.tsx← Doughnut chart (giống index.html)
        └── StatsSummary.tsx ← Tổng quan: câu đúng, sai, accuracy
```

#### Pattern mỗi feature

```
features/{tên}/
├── types.ts                 ← Định nghĩa interface/types riêng cho feature đó
├── constants.ts             ← Hằng số riêng của feature
├── schemas/                 ← Zod validation (nếu có form)
├── api/                     ← API call functions (nếu cần, dùng fetch)
├── controllers/             ← Pure logic, không side-effect, có thể test unit (nếu cần)
├── hooks/                   ← Custom hooks (nếu có logic phức tạp)
└── components/              ← UI components của riêng feature đó
```

**Không phải feature nào cũng cần đủ 5 thư mục** — chỉ tạo khi cần.

#### Khi thêm 1 tính năng mới, làm gì?

```
Ví dụ: Thêm tính năng "Flashcard"

1. Tạo page:  src/app/(main)/flashcard/page.tsx
2. Tạo feature:  src/features/flashcard/
   ├── types.ts              ← Flashcard, Progress...
   └── components/
       ├── FlashcardDeck.tsx
       └── FlashcardCard.tsx
3. API:  src/app/api/flashcard/route.ts  (nếu cần data riêng)
4. Thêm vào sidebar:  constants.ts (nếu có)
```

### 2.4 src/components/ — Shared Components

```
src/components/
├── ui/                      ← shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── badge.tsx
│   ├── select.tsx
│   └── ...
│
├── common/                  ← Custom components dùng chung
│   ├── cn.ts                ← class-variance-authority + tailwind-merge
│   ├── PageHeader.tsx       ← Tiêu đề trang + breadcrumb
│   └── EmptyState.tsx       ← "Chưa có dữ liệu"
│
├── layout/                  ← Layout components
│   ├── Sidebar.tsx          ← Navigation sidebar
│   ├── Header.tsx           ← Top bar (user avatar, search)
│   └── Navbar.tsx           ← Navigation links
│
└── providers/               ← React context providers
    ├── QueryProvider.tsx    ← TanStack Query provider
    ├── SessionProvider.tsx  ← NextAuth session provider
    └── ToastProvider.tsx    ← Toast notifications
```

#### So sánh với tnp-ui-web

| tnp-ui-web (14 categories) | TOEIC (4 categories) | Lý do |
|---------------------------|---------------------|-------|
| common/ | ✅ common/ | Giống |
| form/, feedback/, navigation/, overlay/, data-display/, composite/ | ❌ gộp vào ui/ + common/ | TOEIC không cần nhiều |
| layout/ | ✅ layout/ | Giống nhưng ít hơn |
| providers/ | ✅ providers/ | Giống |
| effect/ | ❌ bỏ | Không cần animation phức tạp |
| ui/ (shadcn sub) | ✅ ui/ | Giống |

### 2.5 src/lib/ — Infrastructure

```
src/lib/
├── prisma.ts                ← PrismaClient singleton
├── auth.ts                  ← NextAuth configuration
├── utils.ts                 ← cn() + helper functions
├── validators.ts            ← Email, phone, password helpers
└── constants.ts             ← QuestionTypes, Difficulty enums, routes
```

#### Chi tiết từng file

**prisma.ts** — Singleton pattern (tránh nhiều connection khi hot reload)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**auth.ts** — NextAuth config (providers, callbacks, adapter)
```typescript
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [ /* CredentialsProvider, GitHub... */ ],
  callbacks: { session: async (...) => ... },
}
```

**utils.ts** — `cn()` function
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### Tương đương ASP.NET

| src/lib/ | ASP.NET Core |
|----------|-------------|
| `prisma.ts` | `DbContext` DI singleton |
| `auth.ts` | `Program.cs` → `AddAuthentication()` + `AddIdentity()` |
| `utils.ts` | Helper static class |
| `validators.ts` | `FluentValidation` hoặc `DataAnnotations` |
| `constants.ts` | `Constants.cs` / enum classes |

### 2.6 src/env.ts — Environment Validation

```
src/env.ts                   ← @t3-oss/env-nextjs validation
```

```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
```

**Mục đích:** Nếu thiếu env, build FAIL ngay, không deploy được — tránh lỗi runtime.

### 2.7 prisma/ — Database Layer

```
prisma/
├── schema.prisma             ← Models, relations, enums
├── seed.ts                   ← Import data/questions.json
└── migrations/               ← Lịch sử thay đổi DB
```

#### Tương đương ASP.NET

| Prisma | EF Core |
|--------|---------|
| `schema.prisma` | `DbContext` + Entity classes |
| `prisma migrate dev` | `dotnet ef migrations add` |
| `prisma migrate deploy` | `dotnet ef database update` |
| `prisma studio` | SSMS / SQL Server Object Explorer |
| `seed.ts` | `HasData()` / seed script |

---

## 3. Data Flow — 2 đường chính

### Đường A: Server Component → DB (trang tĩnh)

```
📄 practice/page.tsx (Server Component)
  → gọi prisma.question.findMany()
  → lấy 10 câu hỏi
  → render HTML sẵn

🌐 Response: HTML đầy đủ (không cần JS load thêm)
```

**Dùng cho:** Dashboard, question list, landing page.

### Đường B: Client Component → API → DB (trang có tương tác)

```
🎯 practice/session/page.tsx (Client Component)
  → fetch('/api/questions/random')
  → API Route gọi prisma.question.findMany()
  → trả JSON
  → Client render question + options
  → User click → POST /api/attempt
  → API Route gọi prisma.attempt.create()
  → trả { correct, rationale }
  → Client hiển thị kết quả
```

**Dùng cho:** Quiz engine, form submit, realtime interaction.

---

## 4. Cách thêm 1 tính năng mới

### Ví dụ: Thêm "Spaced Repetition" (ôn tập câu sai)

| Bước | Làm gì | File cần tạo/sửa |
|:----:|--------|-----------------|
| 1 | Database: thêm model Review | `prisma/schema.prisma` |
| 2 | Migration | `pnpm db:migrate` |
| 3 | Page: màn hình ôn tập | `src/app/(main)/review/page.tsx` |
| 4 | Feature module | `src/features/review/types.ts` |
| 5 | Feature component | `src/features/review/components/ReviewCard.tsx` |
| 6 | API nếu cần | `src/app/api/review/route.ts` |
| 7 | Sidebar: thêm link | `src/components/layout/Sidebar.tsx` |

### Ví dụ: Thêm "Admin Bulk Import JSON"

| Bước | File |
|:----:|------|
| 1 | Form trong admin page | đã có: `admin/questions/page.tsx` |
| 2 | File upload component | `admin/components/JsonImporter.tsx` |
| 3 | API import | `api/questions/route.ts` (thêm case POST) |

### Ví dụ: Thêm "Leaderboard" (so sánh với bạn bè)

| Bước | File |
|:----:|------|
| 1 | Feature module | `features/leaderboard/types.ts` |
| 2 | API: lấy ranking | `api/leaderboard/route.ts` |
| 3 | Page | `app/(main)/leaderboard/page.tsx` |
| 4 | Component | `features/leaderboard/components/RankingTable.tsx` |

---

## 5. Cheatsheet — File nào ở đâu

| Tôi muốn... | Vào file này |
|-------------|-------------|
| Thêm 1 model mới vào DB | `prisma/schema.prisma` |
| Sửa câu hỏi trong database | `data/questions.json` → seed lại |
| Thêm 1 API endpoint | `src/app/api/{tên}/route.ts` |
| Thêm 1 trang mới | `src/app/(main)/{tên}/page.tsx` |
| Sửa layout chung | `src/app/(main)/layout.tsx` |
| Thêm 1 component dùng chung | `src/components/common/{Tên}.tsx` |
| Sửa màu sắc theme | `src/app/globals.css` |
| Sửa auth config | `src/lib/auth.ts` |
| Thêm environment variable | `.env` + `src/env.ts` |
| Thêm validation rule | `src/features/{module}/schemas/*.schema.ts` |
| Thêm linter rule | `biome.json` |
| Deploy lên production | `pnpm build` → `vercel --prod` |
