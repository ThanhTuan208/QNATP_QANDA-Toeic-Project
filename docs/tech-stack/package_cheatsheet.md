# Package Cheatsheet & CLI Commands

> Danh sách đầy đủ packages, lệnh cài đặt, CLI build cho TOEIC Reading.

---

## 1. Init Project

```bash
# === CREATE NEXT.JS APP ===
pnpm create next-app@latest toeic-reading \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir

cd toeic-reading

# === GIT ===
git init
git add .
git commit -m "chore: init next.js project"

# === VSCODE SETTINGS ===
# Tạo .vscode/settings.json tự động format
mkdir -p .vscode
```

---

## 2. Core Dependencies

### 2.1 Database & ORM

```bash
# Prisma
pnpm add prisma @prisma/client
pnpm add -D tsx

npx prisma init
npx prisma migrate dev --name init
npx prisma studio              # GUI xem data
npx prisma generate            # Tạo client
npx prisma db seed             # Seed data
npx prisma migrate deploy      # Production migration
npx prisma migrate reset --force  # Reset DB
```

| Lệnh | Tương đương EF Core |
|------|-------------------|
| `prisma init` | `dotnet new` + install EF packages |
| `prisma migrate dev` | `dotnet ef migrations add` |
| `prisma migrate deploy` | `dotnet ef database update` |
| `prisma studio` | SQL Server Management Studio |
| `prisma db seed` | Seed script trong `Program.cs` |

### 2.2 Authentication

```bash
# NextAuth.js
pnpm add next-auth@beta
pnpm add @auth/prisma-adapter    # Prisma adapter cho NextAuth
```

| File | Mục đích |
|------|---------|
| `src/lib/auth.ts` | NextAuth config |
| `src/app/api/auth/[...nextauth]/route.ts` | API route auth |
| `src/app/api/auth/signin/page.tsx` | Trang login custom (nếu cần) |

### 2.3 UI Components

```bash
# shadcn/ui
pnpm dlx shadcn-ui@latest init

# Các component cần dùng
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add table
pnpm dlx shadcn-ui@latest add badge
pnpm dlx shadcn-ui@latest add select
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add label
pnpm dlx shadcn-ui@latest add avatar
pnpm dlx shadcn-ui@latest add dropdown-menu
pnpm dlx shadcn-ui@latest add tabs
pnpm dlx shadcn-ui@latest add toast
```

> Copy `cn()` utility và `lib/utils.ts` từ tnp-ui-web — giống hệt.

### 2.4 Form & Validation

```bash
pnpm add react-hook-form
pnpm add @hookform/resolvers
pnpm add zod
```

### 2.5 Data Fetching (Client Components)

```bash
pnpm add @tanstack/react-query
pnpm add @tanstack/react-query-devtools -D
```

### 2.6 Chart

```bash
pnpm add recharts    # thay vì chart.js (nhẹ hơn, React-native)
```

### 2.7 Icons

```bash
pnpm add lucide-react
```

### 2.8 Date formatting

```bash
pnpm add date-fns   # thay vì Intl (gọn, tree-shakeable)
```

### 2.9 Utilities

```bash
pnpm add clsx
pnpm add tailwind-merge
pnpm add class-variance-authority
```

---

## 3. Dev Dependencies

```bash
# === LINT & FORMAT (thay ESLint + Prettier) ===
pnpm add -D @biomejs/biome
pnpm biome init

# === TESTING ===
pnpm add -D vitest
pnpm add -D @testing-library/react
pnpm add -D @testing-library/jest-dom
pnpm add -D jsdom
pnpm add -D @playwright/test
npx playwright install

# === ENV TYPE SAFETY ===
pnpm add -D @t3-oss/env-nextjs   # validate env lúc build

# === GIT HOOKS (optional) ===
pnpm add -D husky
pnpm add -D lint-staged
npx husky init
```

---

## 4. package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check --write src/",
    "format": "biome format --write src/",
    "typecheck": "tsc --noEmit",

    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset --force",

    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",

    "prebuild": "prisma generate",
    "postinstall": "prisma generate"
  }
}
```

### So sánh CLI với tnp-ui-web

| Hành động | tnp-ui-web (Biome) | TOEIC Reading |
|-----------|-------------------|---------------|
| Lint | `pnpm lint` (biome) | `pnpm lint` (biome) |
| Format | `pnpm format` (prettier) | `pnpm format` (biome — gộp) |
| Type check | ❌ không có | `pnpm typecheck` |
| Dev server | `pnpm dev` | `pnpm dev` |
| Test unit | `pnpm test` | `pnpm test` |
| Test e2e | `pnpm test:e2e` | `pnpm test:e2e` |

---

## 5. Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/toeic?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="openssl rand -base64 32"
AUTH_SECRET="openssl rand -base64 32"

# .env.local (override local)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Validation với @t3-oss/env-nextjs

```typescript
// src/env.ts
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

---

## 6. Biome Config

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
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
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  },
  "organizeImports": {
    "enabled": true
  }
}
```

> Copy từ tnp-ui-web — tương tự.

---

## 7. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 8. Setup Complete — Tổng quan CLI

```bash
# MỘT LẦN: Cài tất cả
pnpm create next-app@latest toeic-reading --typescript --tailwind --app --eslint --src-dir
cd toeic-reading
pnpm add prisma @prisma/client react-hook-form @hookform/resolvers zod
pnpm add @tanstack/react-query next-auth@beta @auth/prisma-adapter
pnpm add recharts lucide-react date-fns clsx tailwind-merge class-variance-authority
pnpm add -D @biomejs/biome vitest @playwright/test @t3-oss/env-nextjs tsx
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button card dialog table badge select input tabs toast
npx prisma init
npx prisma migrate dev --name init

# HÀNG NGÀY: Dev
pnpm dev                    # localhost:3000
npx prisma studio           # GUI database
pnpm lint                   # Kiểm tra code
pnpm test                   # Chạy unit test

# PRODUCTION: Deploy
npx prisma migrate deploy   # Migration production
pnpm build                  # Build Next.js
npx vercel --prod           # Deploy
```

---

## 9. So sánh tổng số packages

| Nhóm | tnp-ui-web | TOEIC Reading | Chênh lệch |
|------|:----------:|:-------------:|:----------:|
| Production | 41 | 20 | -21 |
| Dev | 13 | 8 | -5 |
| **Tổng** | **54** | **28** | **-26** |

Giảm gần một nửa vì bỏ: antd, framer-motion, axios, next-auth (ko dùng), @hey-api, msw, vaul, sonner, tw-animate-css...
