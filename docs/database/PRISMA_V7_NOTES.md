# Prisma v7 — Khác biệt so với các Stage docs

> Các file STAGE_1 → CHEATSHEET được viết cho Prisma v5/v6.
> Dưới đây là những điểm khác khi dùng Prisma v7 (bản thực tế đang dùng).

---

## 1. Schema — không có `url`

```prisma
// ❌ Prisma v5/v6 style (sai)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ✅ Prisma v7 style (đúng)
datasource db {
  provider     = "postgresql"
  relationMode = "foreignKeys"
}
```

Connection string được định nghĩa trong `prisma.config.ts` (CLI) hoặc adapter (runtime).

## 2. Migration vẫn giống

```bash
npx prisma migrate dev --name init   # → Giống docs
```

## 3. Seed — cần load dotenv

```typescript
// prisma/seed.ts
import 'dotenv/config'                    // ← Thêm dòng này
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

## 4. PrismaClient — cần adapter (khác docs nhiều nhất)

```typescript
// ❌ Prisma v5/v6 (trong STAGE_4_CLIENT.md)
new PrismaClient()

// ✅ Prisma v7 (thực tế)
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

## 5. Query syntax — không đổi

`findMany`, `findUnique`, `create`, `include`, `where` — tất cả giống docs.

## 6. Packages cần cài thêm

```bash
pnpm add @prisma/adapter-pg pg
pnpm add -D @types/pg dotenv
```
