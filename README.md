# LITOEIC — Luyện thi TOEIC 2 Kỹ năng

> Nền tảng web luyện thi TOEIC **Reading & Listening** — hỗ trợ luyện tập theo từng dạng câu hỏi, chấm điểm, giải thích đáp án chi tiết.
    
---

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui + SCSS modules |
| Data Fetching | @tanstack/react-query v5 |
| Database | PostgreSQL + Prisma 7 |
| Auth | next-auth v5 (Credentials) |
| Form | react-hook-form + zod |
| Animation | framer-motion + CSS keyframes |
| Charts | recharts |
| Linting | Biome |
| Testing | Vitest + Playwright |

---

## Features

### Reading (đã có)
- **12 dạng ngữ pháp**: comparison, word-form, verb-tense, preposition, conjunction, participle, voice, relative-clause, agreement, vocabulary
- **Lý thuyết + Thực hành + Quiz**: 3 section cho mỗi topic
- **Chấm điểm tự động**: rationale chi tiết sau mỗi câu
- **Dashboard**: thống kê tiến độ, lịch sử làm bài
- **Import câu hỏi**: dán JSON tự tạo đề
- **Dark mode**: giao diện tối/sáng
- **Admin**: quản lý câu hỏi

### Listening (đang xây dựng)
- Audio player với speed control
- Hiển thị ảnh cho Part 1
- Hỗ trợ group question cho Part 3, 4
- Timer theo format thi thật

Xem chi tiết: [`docs/plans/roadmap-2skills.md`](docs/plans/roadmap-2skills.md)

---

## Kiến trúc

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             #   Login / Register
│   └── (main)/             #   Dashboard / Practice / Admin
├── components/             # Shared components
│   ├── common/             #   Button, Dialog, Input, Loading, AnimatedLoader
│   ├── layout/             #   MainLayout, Sidebar, SiteHeader
│   └── ui/                 #   shadcn/ui primitives
├── features/               # Feature modules
│   ├── auth/               #   Auth forms, hooks, schemas
│   ├── quiz/               #   Quiz engine, questions (Reading)
│   ├── listening/          #   Listening components, AudioPlayer (đang xây)
│   ├── dashboard/          #   Stats, charts, history
│   └── admin/              #   Question management
├── constants/              # Sidebar, header, label maps
├── hooks/                  # Global hooks
├── api/                    # Service + repository layer
├── lib/                    # Auth, prisma, response utils
└── types/                  # Global type definitions
```

Data flow chính: `practice/[module]/[topic]/page.tsx` → `PracticeTopicView` (load JSON) → `QuizEngine` (client) → `QuestionCard` / `RationaleBox`.

---

## Yêu cầu

- Node.js 20+
- pnpm (khuyến nghị)
- PostgreSQL database

---

## Cài đặt & chạy

```bash
git clone <repo-url>
cd toeic-reading
pnpm install

cp .env.example .env
# Điền: DATABASE_URL, NEXTAUTH_SECRET, ...

pnpm db:generate
pnpm db:migrate
pnpm db:seed

pnpm dev
```

Mở `http://localhost:3000`.

---

## Scripts

| Script | Mô tả |
|--------|-------|
| `pnpm dev` | Dev server |
| `pnpm build` | Build production |
| `pnpm lint` | Biome check + fix |
| `pnpm format` | Biome format |
| `pnpm typecheck` | TypeScript check |
| `pnpm db:studio` | Prisma Studio UI |
| `pnpm db:seed` | Seed database |
| `pnpm test` | Vitest (unit) |

---

## Environment

| Variable | Mô tả |
|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth secret |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000`) |

---

## Coding Conventions

- **Components**: `'use client'` khi cần state/effect, server component khi không
- **Styling**: Tailwind utilities cho layout/spacing, SCSS module cho animation phức tạp
- **Data fetching**: React Query `useQuery`/`useMutation` cho client, direct DB cho server
- **Forms**: react-hook-form + zod validation
- **Lint**: Biome — chạy `pnpm lint` trước commit

---

## Tài liệu

Chi tiết kiến trúc, database, content tại [`docs/`](docs/README.md).
