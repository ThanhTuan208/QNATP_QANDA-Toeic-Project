# Implementation Log

> Quy trình thực tế đã thực hiện từ lúc build Prisma đến hiện tại.

---

## Phase 0: Khởi tạo Project

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
pnpm add prisma @prisma/client
pnpm add next-auth@beta @auth/prisma-adapter
pnpm add clsx tailwind-merge
pnpm add -D tsx
```

---

## Phase 1: Database + Auth Setup

### 1. Schema (`prisma/schema.prisma`)

6 models, 6 enums — thiết kế feature-based:

| Model | Vai trò |
|-------|---------|
| `User` | Người dùng, auth |
| `Question` | Câu hỏi TOEIC Part 5 |
| `Option` | 4 đáp án + rationale |
| `Attempt` | Lịch sử làm bài |
| `TestSession` | Phiên luyện tập/test |
| `Tag` / `QuestionTag` | Phân loại câu hỏi |

### 2. Prisma v7 — Khác biệt quan trọng

Lúc chạy `npx prisma migrate dev --name init` gặp lỗi `P1012`:

```
The datasource property `url` is no longer supported in schema files
```

**Vấn đề:** Prisma v7.8.0 (bản npm mới nhất) thay đổi cách quản lý connection string:

| Feature | Prisma v5/v6 (trong docs) | Prisma v7 (thực tế) |
|---------|--------------------------|-------------------|
| `url` trong schema | `datasource db { url = env("DATABASE_URL") }` | **Không được phép** — xoá khỏi schema |
| Config CLI | Không có | `prisma.config.ts` — chứa `url`, load dotenv |
| PrismaClient | `new PrismaClient()` | **Bắt buộc adapter** — không dùng được constructor rỗng |
| `datasourceUrl` | Có thể truyền vào constructor | **Không được hỗ trợ** — lỗi "Unknown property" |

**Flow hiện tại:**
```
prisma.config.ts (CLI)          src/lib/prisma.ts (Runtime)
───────────────────────         ─────────────────────────
import 'dotenv/config'          import { PrismaPg } from '@prisma/adapter-pg'
export default {                 import { Pool } from 'pg'
  url: process.env.DATABASE_URL  const pool = new Pool({ connectionString })
}                                const adapter = new PrismaPg(pool)
                                 const prisma = new PrismaClient({ adapter })
```

### 3. PrismaClient + Adapter (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Packages cần cài:**
```bash
pnpm add @prisma/adapter-pg pg
pnpm add -D @types/pg dotenv
```

### 4. Seed Data (`prisma/seed.ts`)

- Import 33 câu hỏi từ `data/questions.json`
- Dùng `import 'dotenv/config'` vì `tsx` không tự load `.env`
- Xoá duplicate `const prisma = new PrismaClient()` (lỗi cũ sau khi sửa adapter)

```bash
pnpm db:seed          # tsx prisma/seed.ts        (upsert: thêm mới/sửa, giữ attempts)
pnpm db:seed:reset    # tsx prisma/seed.ts --reset (xoá sạch + import lại)
```

### 5. TypeScript + pnpm — Symlink fix

`@prisma/client/index.d.ts` exports từ `.prisma/client/default` nhưng thư mục `.prisma` không nằm cùng vị trí trong pnpm store → TypeScript không resolve được types.

**Fix:** tạo junction từ `@prisma/client/.prisma` → thư mục `.prisma` trong store.

```powershell
$storePath = (Get-Item "node_modules\@prisma\client").Target
$storeRoot = Split-Path -Parent (Split-Path -Parent $storePath)
New-Item -ItemType Junction -Path "$storePath\.prisma" -Target "$storeRoot\.prisma" -Force
```

### 6. Auth (`src/lib/auth.ts`)

- NextAuth v5 + Credentials provider + JWT strategy
- Dùng `@auth/prisma-adapter` (khác với `next-auth/prisma-adapter` cũ)
- `strategy: 'jwt' as const` — cần `as const` để TypeScript không suy ra kiểu `string`

---

## Phase 2: API Routes

| Route | Method | Auth | Chức năng |
|-------|--------|------|-----------|
| `/api/questions` | GET | No | Danh sách câu hỏi (filter: type, difficulty, limit, offset). Ẩn đáp án |
| `/api/questions/[id]` | GET | No | Chi tiết 1 câu hỏi + options |
| `/api/attempts` | POST | Yes | Nộp bài → trả về đúng/sai + rationale |
| `/api/stats` | GET | Yes | Thống kê: total, accuracy, typeStats, recentAttempts |

---

## Phase 3: Components

| Component | File | Chức năng |
|-----------|------|-----------|
| `OptionButton` | `src/features/quiz/components/OptionButton/OptionButton.tsx` | 5 states: idle, selected, correct, wrong, disabled |
| `QuestionCard` | `src/features/quiz/components/QuestionCard/QuestionCard.tsx` | Hiển thị câu hỏi + options + hint |
| `RationaleBox` | `src/features/quiz/components/RationaleBox/RationaleBox.tsx` | Kết quả + giải thích + nút Next |
| `QuizEngine` | `src/features/quiz/components/QuizEngine/QuizEngine.tsx` | State machine: loading → answering → result → next/complete |

**Luồng QuizEngine:**
```
mount → fetch /api/questions → loading
  → render QuestionCard
  → user chọn option → POST /api/attempts → submitting
  → hiển thị kết quả (QuestionCard highlight + RationaleBox)
  → Next → câu tiếp theo
  → hết câu → "Quiz Complete!" + Start Over
```

---

## Các lệnh thường dùng

```bash
# Database
npx prisma generate                    # Tạo PrismaClient
npx prisma migrate dev --name <name>   # Migration
pnpm db:seed                           # Seed data (upsert: thêm mới/sửa, giữ attempts)
pnpm db:seed:reset                     # Seed data (xoá sạch + import lại)
npx prisma studio                      # GUI database

# Development
pnpm dev                               # Next.js dev server
pnpm build                             # Production build
npx tsc --noEmit                       # TypeScript check
```

---

## Ghi chú Prisma v7

- **Luôn** cần `@prisma/adapter-pg` + `pg` (hoặc adapter tương ứng) cho PrismaClient runtime
- `prisma.config.ts` (root) dùng cho CLI commands; runtime dùng adapter
- Khi pnpm ignore build scripts, cần chạy `npx prisma generate` thủ công sau install
- `.env` được load bởi `prisma.config.ts` (CLI), `import 'dotenv/config'` (seed), hoặc Next.js built-in (app)
