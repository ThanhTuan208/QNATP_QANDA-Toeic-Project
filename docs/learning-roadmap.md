# Hướng dẫn Học từ Dự án LITOEIC — Lộ trình & Phân tích Kiến thức

> Tài liệu này tổng hợp tất cả kiến thức có trong dự án, phân tích theo cấp độ từ cơ bản đến nâng cao, kèm lộ trình học đề xuất và giải thích lý do tại sao nên học theo thứ tự đó.

---

## Mục lục

- [1. Tổng quan Hệ thống](#1-t%E1%BB%95ng-quan-h%E1%BB%87-th%E1%BB%91ng)
- [2. Dự án đang mạnh về kiến thức nào?](#2-d%E1%BB%B1-%C3%A1n-%C4%91ang-m%E1%BA%A1nh-v%E1%BB%81-ki%E1%BA%BFn-th%E1%BB%A9c-n%C3%A0o)
- [3. Kiến thức cần nắm rõ để hiểu luồng code](#3-ki%E1%BA%BFn-th%E1%BB%A9c-c%E1%BA%A7n-n%E1%BA%AFm-r%C3%B5-%C4%91%E1%BB%83-hi%E1%BB%83u-lu%E1%BB%93ng-code)
- [4. Kiến trúc tổng thể (Layered Architecture)](#4-ki%E1%BA%BFn-tr%C3%BAc-t%E1%BB%95ng-th%E1%BB%83-layered-architecture)
- [5. Lộ trình học tập chi tiết](#5-l%E1%BB%99-tr%C3%ACnh-h%E1%BB%8Dc-t%E1%BA%ADp-chi-ti%E1%BA%BFt)
- [6. Phân tích chi tiết từng khối kiến thức](#6-ph%C3%A2n-t%C3%ADch-chi-ti%E1%BA%BFt-t%E1%BB%ABng-kh%E1%BB%91i-ki%E1%BA%BFn-th%E1%BB%A9c)
  - [6.1. TypeScript](#61-typescript)
  - [6.2. React & Hooks](#62-react--hooks)
  - [6.3. Next.js App Router](#63-nextjs-app-router)
  - [6.4. Tailwind CSS & Design System](#64-tailwind-css--design-system)
  - [6.5. Database & Prisma ORM](#65-database--prisma-orm)
  - [6.6. Authentication (NextAuth v5)](#66-authentication-nextauth-v5)
  - [6.7. Service/Repository Pattern](#67-servicerepository-pattern)
  - [6.8. Feature-Folder Architecture](#68-feature-folder-architecture)
  - [6.9. React Query (TanStack Query)](#69-react-query-tanstack-query)
  - [6.10. Form & Validation (react-hook-form + Zod)](#610-form--validation-react-hook-form--zod)
  - [6.11. API Routes & Standardized Responses](#611-api-routes--standardized-responses)
  - [6.12. Animation (Framer Motion)](#612-animation-framer-motion)
  - [6.13. Testing (Vitest + Playwright)](#613-testing-vitest--playwright)
  - [6.14. Code Quality (Biome)](#614-code-quality-biome)
  - [6.15. UI/UX Patterns & Design Tokens](#615-uiux-patterns--design-tokens)
- [7. Bản đồ kiến thức trực quan](#7-b%E1%BA%A3n-%C4%91%E1%BB%93-ki%E1%BA%BFn-th%E1%BB%A9c-tr%E1%BB%B1c-quan)
- [8. Câu hỏi thường gặp](#8-c%C3%A2u-h%E1%BB%8Fi-th%C6%B0%E1%BB%9Dng-g%E1%BA%B7p)

---

## 1. Tổng quan Hệ thống

**LITOEIC** là nền tảng web luyện thi TOEIC Reading & Listening sử dụng:

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Framework | Next.js (App Router) | 16.2.9 |
| UI Library | React | 19.2.4 |
| Ngôn ngữ | TypeScript | ^5 |
| CSS | Tailwind CSS + shadcn/ui | v4 |
| Database | PostgreSQL + Prisma | 7.8 |
| Auth | NextAuth (Auth.js) | v5 beta |
| State (Server) | TanStack React Query | 5.x |
| Form | react-hook-form + Zod | 7.x + 4.x |
| Animation | Framer Motion | 12.x |
| Charts | Recharts | 3.x |
| Package Manager | pnpm | — |
| Lint/Format | Biome | 2.x |
| Testing | Vitest + Playwright | 4.x + 1.x |

### Tính năng chính
- **Reading**: 10+ dạng ngữ pháp TOEIC Part 5, mỗi topic có Lý thuyết + Thực hành + Quiz
- **Dashboard**: Thống kê tiến độ, biểu đồ tròn, lịch sử làm bài
- **Import câu hỏi**: User tự nhập JSON hoặc AI-suggest
- **Admin**: Quản lý câu hỏi CRUD, import bulk
- **Dark mode**: Theme sáng/tối với OKLCH color space
- **Weighted Selection**: Thuật toán chọn câu hỏi theo điểm yếu của user

---

## 2. Dự án đang mạnh về kiến thức nào?

Dự án **mạnh nhất** ở các mảng sau (xếp theo độ "dày" của code):

### 🥇 1. React + TypeScript Patterns (Feature-Folder, Hook Composition, useReducer)
Phần core `src/features/quiz/` là một **case study mẫu mực** về:
- Tách logic thành nhiều hooks nhỏ (1 hook 1 responsibility)
- Orchestrator pattern (`useQuizEngine` tổng hợp 3 hooks con)
- State machine với `useReducer` + Discriminated Unions
- Composition pattern (container component + dumb components)
- ~15 files, ~1000 dòng code cho riêng quiz feature

### 🥇 2. Tailwind CSS + Design System (shadcn/ui + OKLCH)
File `src/app/globals.css` (~517 dòng) là một **design system hoàn chỉnh**:
- Tự define toàn bộ bảng màu bằng OKLCH color space (hiện đại hơn HSL/RGB)
- Map thủ công sang shadcn/ui tokens
- `@theme inline` cho Tailwind v4 custom colors
- Dark mode với `.dark` class
- Custom utilities (`tab-switcher-*`, `ambient-glow`, `gradient-text`)

### 🥇 3. Service/Repository Pattern
`src/api/quiz/quiz.service.ts` + `quiz.repository.ts` là một **backend architecture pattern** rõ ràng:
- Repository: chỉ chứa Prisma queries (data access)
- Service: business logic (shuffle, weighted algorithm, validation)
- Tách biệt hoàn toàn, dễ test, dễ swap database

### 🥇 4. Next.js App Router Architecture
- Server Components + Client Components tách biệt
- Route groups `(auth)` + `(main)` phân biệt layout
- API routes với error handling đồng bộ
- Server-side data loading (`loadQuestions`) vs client-side fetching (React Query)

---

## 3. Kiến thức cần nắm rõ để hiểu luồng code

Để hiểu một luồng hoàn chỉnh (user chọn 1 đáp án → submit → xem kết quả), bạn cần nắm **theo thứ tự ưu tiên**:

### 🔴 Cấp 1: BẮT BUỘC (nếu thiếu là không hiểu gì)

| Kiến thức | Lý do | File ví dụ |
|-----------|-------|------------|
| **TypeScript cơ bản** (interface, type, generic, union) | Toàn bộ dự án viết bằng TS, không biết TS là không đọc được code | `src/features/quiz/types.ts` |
| **React Hooks** (useState, useEffect, useCallback, useMemo, useRef) | Quiz Engine hoạt động hoàn toàn dựa vào hooks | `src/features/quiz/hooks/useQuizAttempt.ts` |
| **useReducer + Action pattern** | State machine của quiz dùng useReducer với discriminated unions | `src/features/quiz/hooks/useQuizAttempt.ts:23-78` |
| **Next.js Pages & Layouts** (page.tsx, layout.tsx, route.ts) | Cấu trúc thư mục quyết định routing | `src/app/(main)/practice/[module]/[topic]/page.tsx` |
| **fetch API (GET/POST)** | Giao tiếp client-server qua API routes | `src/features/quiz/client/quiz.client.ts` |

### 🟡 Cấp 2: QUAN TRỌNG (cần hiểu để biết luồng hoàn chỉnh)

| Kiến thức | Lý do | File ví dụ |
|-----------|-------|------------|
| **React Query** (useQuery, useMutation) | Quiz dùng `useMutation` để submit, cần hiểu pattern này | `src/features/quiz/hooks/useQuizAttempt.ts:87-108` |
| **Prisma ORM** (schema, queries) | Business logic đọc/ghi database qua Prisma | `prisma/schema.prisma`, `src/api/quiz/quiz.repository.ts` |
| **Service/Repository Pattern** | Logic submit gọi Service → Repository → Prisma | `src/api/quiz/quiz.service.ts` |
| **Next.js API Routes** (route.ts, NextRequest, NextResponse) | Endpoint backend nằm trong `src/app/api/` | `src/app/api/attempts/route.ts` |
| **props + component composition** | QuizEngine nhận props, render QuestionCard + RationaleBox | `src/features/quiz/components/QuizEngine/QuizEngine.tsx` |
| **Client Component vs Server Component** | `'use client'` directive quyết định code chạy ở đâu | `src/features/quiz/hooks/useQuizEngine.ts:1` |

### 🟢 Cấp 3: MỞ RỘNG (giúp hiểu sâu, tối ưu, maintain)

| Kiến thức | File ví dụ |
|-----------|------------|
| Tailwind CSS + shadcn/ui | `src/app/globals.css` |
| OKLCH Color Space | `src/app/globals.css:7-165` |
| NextAuth v5 config | `src/lib/auth.ts` |
| Zod validation | `src/features/auth/schemas/login.schema.ts` |
| react-hook-form | `src/features/auth/hooks/useLoginForm.ts` |
| Framer Motion | `src/features/landing/` |
| Biome linter config | `biome.json` |
| Error handling (AppError + response.ts) | `src/lib/errors/AppError.ts`, `src/lib/response.ts` |
| Prisma adapter for PostgreSQL | `src/lib/prisma.ts` |
| Weighted question algorithm | `src/api/quiz/quiz.service.ts:103-185` |

---

## 4. Kiến trúc tổng thể (Layered Architecture)

Dự án áp dụng **kiến trúc phân lớp (layered architecture)** kết hợp **feature-folder pattern**:

```
┌──────────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER (Pages)                        │
│  server: page.tsx, layout.tsx, loading.tsx, PracticeTopicView        │
│  client: QuizEngine, QuizActiveView, QuizCompleteView, QuestionCard  │
├──────────────────────────────────────────────────────────────────────┤
│                     FEATURE LAYER (Hooks + State)                     │
│  useQuizEngine (orchestrator) → useQuizQuestions + useQuizAttempt    │
│  + useQuizImport + useLoginForm + useMainLayoutController             │
├──────────────────────────────────────────────────────────────────────┤
│                     NETWORK LAYER (API Client)                        │
│  quiz.client.ts: fetchQuestions(), submitAttempt(), fetchStats()      │
├──────────────────────────────────────────────────────────────────────┤
│                     API ROUTES (Next.js API Layer)                    │
│  /api/attempts, /api/questions, /api/stats, /api/auth/[...nextauth]  │
├──────────────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER (Business Logic)                    │
│  quiz.service.ts: submitAttempt(), getRandomQuestions(),              │
│  getWeightedQuestions(), getUserStats()                                │
├──────────────────────────────────────────────────────────────────────┤
│                     REPOSITORY LAYER (Data Access)                    │
│  quiz.repository.ts: findQuestionById(), createAttempt(), ...         │
├──────────────────────────────────────────────────────────────────────┤
│                     DATA LAYER (ORM + Database)                       │
│  Prisma + PostgreSQL: User, Question, Option, Attempt, Tag, ...       │
└──────────────────────────────────────────────────────────────────────┘
```

### Luồng dữ liệu chính (data flow)

Khi user chọn 1 đáp án trong quiz:

```
1. OptionButton.onClick(id)               (User click)
   → 2. QuestionCard.onSelect(id)
       → 3. QuizEngine.handleSelect(id)     (thực chất là attemptHook.handleSelect)
           → 4. useQuizAttempt.handleSelect(id)
               │
               ├─ [GUARD] if (!question || phase !== 'idle') return
               │
               ├─ dispatch({ type: 'SELECT', optionId })
               │   → phase = 'submitting', UI disable các option
               │
               ├─ mutation.mutate({ questionId, selectedOptionId })
               │   → 5. quiz.client.submitAttempt(qId, optId)
               │       → 6. POST /api/attempts { questionId, selectedOptionId }
               │           → 7. quiz.service.submitAttempt(body, userId)
               │               → 8. quiz.repository.findQuestionById(id)
               │               → 9. quiz.repository.createAttempt(data)
               │               → Trả về { isCorrect, correctOptionId, rationale }
               │
               └─ dispatch({ type: 'SUBMIT_SUCCESS', result })
                   → phase = 'answered', UI hiện xanh/đỏ + RationaleBox

5. User click "Next" → handleNext()
   → clearAnswer() + advanceQuestion()
```

### Sơ đồ quan hệ giữa các hooks (dependency graph)

```
                         QuizEngine (component)
                              │
                         useQuizEngine (orchestrator)
                        /        |            \
                       ↓         ↓             ↓
            useQuizQuestions  useQuizAttempt  useQuizImport
            (questions + idx)  (submit)        (import JSON)
                   ↓               ↓
            currentQuestion ──► handleSelect
                              correctCount ──► onStatsUpdate
```

---

## 5. Lộ trình học tập chi tiết

Lộ trình này được thiết kế để bạn **học từ nền tảng → hiểu được code → có thể tự sửa/mở rộng**.

### Phase 0: Chuẩn bị (nếu chưa biết gì)

| Kỹ năng | Thời gian | Link học |
|---------|-----------|----------|
| JavaScript cơ bản (ES6+: arrow, destructuring, spread, async/await) | 1 tuần | MDN Web Docs |
| Git cơ bản (clone, commit, push, branch) | 2 ngày | Git SCM |
| Command line cơ bản | 1 ngày | — |

---

### Phase 1: TypeScript + React Hooks (Tuần 1-2)

> **Tại sao học trước?** 100% code trong dự án là TypeScript + React Hooks. Nếu không biết 2 thứ này, bạn không thể đọc được bất kỳ file nào.

#### Nội dung:
| Thứ tự | Kiến thức | Code trong dự án |
|--------|-----------|-------------------|
| 1.1 | `interface` vs `type`, optional fields | `src/features/quiz/types.ts` |
| 1.2 | Union types (`\|`), literal types | `type AttemptPhase = 'idle' \| 'submitting' \| 'answered'` |
| 1.3 | Generics cơ bản | `src/lib/response.ts`: `success<T>(data: T)` |
| 1.4 | `useState` + `useEffect` | `useQuizQuestions.ts:40-60` |
| 1.5 | `useCallback` + `useMemo` | `useQuizEngine.ts:84-93` (toggleFlag), `useQuizEngine.ts:79-82` (incorrectCount) |
| 1.6 | `useRef` | `useQuizAttempt.ts:83-85` |
| 1.7 | `useReducer` + Discriminated Unions | `useQuizAttempt.ts:23-78` — **quan trọng nhất** |
| 1.8 | Props + Component composition | `QuizEngine.tsx:13-24` |

#### Bài tập thực hành:
- Đọc và hiểu `src/features/quiz/types.ts` — tất cả interface
- Đọc `useQuizAttempt.ts` và vẽ lại state machine
- Mở `src/app/globals.css` và xem các custom properties

---

### Phase 2: Next.js App Router (Tuần 3-4)

> **Tại sao học tiếp theo?** Sau khi hiểu React components, bạn cần hiểu cách chúng được route và render. Next.js App Router là cách dự án tổ chức pages.

#### Nội dung:
| Thứ tự | Kiến thức | Code trong dự án |
|--------|-----------|-------------------|
| 2.1 | File-based routing: `page.tsx`, `layout.tsx` | `src/app/(main)/practice/[module]/[topic]/page.tsx` |
| 2.2 | Route groups `(auth)` + `(main)` | `src/app/(auth)/layout.tsx`, `src/app/(main)/layout.tsx` |
| 2.3 | Server Components vs Client Components | `PracticeTopicView.tsx` (server) vs `QuizEngine.tsx` (client) |
| 2.4 | `layout.tsx` nesting | Root → (main) → practice → [topic] |
| 2.5 | Dynamic routes `[param]` | `src/app/(main)/practice/[module]/[topic]/page.tsx` |
| 2.6 | Loading UI (`loading.tsx`) | `src/app/(main)/practice/[module]/[topic]/loading.tsx` |
| 2.7 | Server-side data loading | `PracticeTopicView.tsx:16`: `loadQuestions()` gọi từ server |

#### Bài tập thực hành:
- Mở URL `http://localhost:3000/practice/grammar/comparison` và trace route đến file nào
- Xem sự khác biệt giữa `(auth)/layout.tsx` và `(main)/layout.tsx`

---

### Phase 3: Service/Repository + API Routes (Tuần 5-6)

> **Tại sao học tiếp theo?** Đây là xương sống backend của dự án. Hiểu được tầng này, bạn biết dữ liệu đi từ database đến UI như thế nào.

#### Nội dung:
| Thứ tự | Kiến thức | Code trong dự án |
|--------|-----------|-------------------|
| 3.1 | Prisma schema: models, enums, relations | `prisma/schema.prisma` (7 models, 6 enums) |
| 3.2 | Prisma Client queries (`findMany`, `findUnique`, `create`, `$transaction`) | `src/api/quiz/quiz.repository.ts` |
| 3.3 | Repository pattern (data access layer) | `quiz.repository.ts` — chỉ chứa Prisma queries |
| 3.4 | Service pattern (business logic) | `quiz.service.ts`: submitAttempt, getWeightedQuestions, shuffle |
| 3.5 | API Routes: `NextRequest`, `NextResponse` | `src/app/api/attempts/route.ts` |
| 3.6 | Standardized response format | `src/lib/response.ts`: success(), error(), paginated() |
| 3.7 | Error handling (AppError class) | `src/lib/errors/AppError.ts`: notFound(), validation(), unauthorized() |

#### Bài tập thực hành:
- Đọc `quiz.repository.ts`: xem mỗi function query gì
- Đọc `quiz.service.ts`: xem `getWeightedQuestions` algorithm
- Đọc `src/app/api/attempts/route.ts`: trace từ HTTP request → response

---

### Phase 4: React Query + Client-side Data Fetching (Tuần 7-8)

> **Tại sao học tiếp theo?** Sau khi hiểu backend, bạn cần hiểu cách frontend gọi backend và quản lý state server.

#### Nội dung:
| Thứ tự | Kiến thức | Code trong dự án |
|--------|-----------|-------------------|
| 4.1 | `QueryClientProvider` setup | `src/app/provider.tsx` |
| 4.2 | `useMutation` pattern | `useQuizAttempt.ts:87-108`: mutation.submit |
| 4.3 | API client functions | `quiz.client.ts`: fetchQuestions, submitAttempt, fetchStats |
| 4.4 | Optimistic UI (dispatch trước khi API trả về) | `useQuizAttempt.ts:127`: dispatch SELECT trước await |
| 4.5 | Error handling + rollback | `useQuizAttempt.ts:105-107`: SUBMIT_ERROR → về idle |

#### Bài tập thực hành:
- Trace `handleSelect` trong `useQuizAttempt.ts`: từ click → mutation → kết quả
- Xem `provider.tsx` và hiểu cách React Query wrap app

---

### Phase 5: Tailwind + Design System (Tuần 9-10)

> **Tại sao học tiếp theo?** UI là thứ bạn nhìn thấy đầu tiên. Hiểu design system giúp bạn sửa bất kỳ style nào.

#### Nội dung:
| Thứ tự | Kiến thức | Code trong dự án |
|--------|-----------|-------------------|
| 5.1 | Tailwind v4 `@import "tailwindcss"` | `globals.css:1-3` |
| 5.2 | OKLCH color space (tại sao dùng OKLCH thay vì HEX/RGB) | `globals.css:7-165` |
| 5.3 | shadcn/ui token mapping (`--background`, `--primary`, ...) | `globals.css:111-150` |
| 5.4 | Dark mode `.dark` class | `globals.css:168-210` |
| 5.5 | `cn()` utility (tailwind-merge + clsx) | `src/lib/utils.ts` |
| 5.6 | `class-variance-authority` (CVA) | `src/components/ui/form/button.tsx` |
| 5.7 | `@theme inline` directive (Tailwind v4) | `globals.css:212-400` |
| 5.8 | Custom utilities (`@utility`) | `globals.css:415-492` |

#### Bài tập thực hành:
- Đọc `globals.css` phần khai báo màu OKLCH
- So sánh `:root` và `.dark`: màu nào thay đổi, màu nào giữ nguyên
- Xem `cn()` function trong `src/lib/utils.ts`

---

### Phase 6: Pattern Nâng cao (Tuần 11-12)

> **Tại sao học cuối?** Đây là các pattern kiến trúc tổng hợp — cần hiểu tất cả phần trên trước.

#### Nội dung:
| Thứ tự | Kiến thức | Code trong dự án |
|--------|-----------|-------------------|
| 6.1 | Feature-Folder pattern | `src/features/quiz/` — toàn bộ cấu trúc |
| 6.2 | Hook Composition (Orchestrator pattern) | `useQuizEngine.ts` tổng hợp 3 hooks |
| 6.3 | State machine với useReducer | `useQuizAttempt.ts:14-79` |
| 6.4 | Server/Component Split Strategy | So sánh PracticeTopicView (server) vs QuizEngine (client) |
| 6.5 | Weighted Question Algorithm | `quiz.service.ts:103-185` |
| 6.6 | Auth middleware + dev fallback | `src/lib/auth-utils.ts` |
| 6.7 | NextAuth v5 (Auth.js) configuration | `src/lib/auth.ts` |
| 6.8 | Prisma adapter pattern + connection pooling | `src/lib/prisma.ts` |
| 6.9 | Error boundary pattern (AppError + catch) | `src/app/api/attempts/route.ts:7-18` |
| 6.10 | Framer Motion animations | `src/features/landing/components/ToeicLanding/` |

---

## 6. Phân tích chi tiết từng khối kiến thức

### 6.1. TypeScript

#### Các kỹ thuật TypeScript trong dự án:

| Kỹ thuật | Cấp độ | Ví dụ trong code |
|----------|--------|-------------------|
| `interface` + `type` | Cơ bản | `types.ts`: `interface Option`, `interface Question` |
| Optional fields (`?`) | Cơ bản | `Question.hint: string \| null`, `onStatsUpdate?: (...) => void` |
| Union types (`\|`) | Cơ bản | `AttemptPhase = 'idle' \| 'submitting' \| 'answered'` |
| `Record<K, V>` | Trung cấp | `Record<string, number>`, `Record<string, { total: number; correct: number }>` |
| Generics (`<T>`) | Trung cấp | `success<T>(data: T)`, `Promise<T>` |
| Discriminated Unions | **Nâng cao** | `AttemptAction = { type: 'SELECT'; optionId: string } \| { type: 'SUBMIT_SUCCESS'; result: AttemptResult }` |
| `ReadonlyArray` | Trung cấp | `OPTION_LABELS: readonly ["A","B","C","D"]` |
| Type narrowing (`switch`) | Trung cấp | `attemptReducer`: TypeScript tự động thu hẹp kiểu trong `switch(action.type)` |
| `as const` | Trung cấp | Hằng số module |
| `interface extends` | Cơ bản | `SubmitAttemptResponse extends AttemptResult` |

#### 📍 File quan trọng nhất: `src/features/quiz/types.ts`
- 14 type/interface definitions
- Đây là "contract" giữa tất cả các phần của quiz feature
- Mọi hook và component đều import từ file này

---

### 6.2. React & Hooks

#### A. `useState` — Cơ bản

```typescript
// useQuizQuestions.ts
const [questions, setQuestions] = useState<Question[]>(options.initialQuestions ?? [])
const [currentIdx, setCurrentIdx] = useState(0)
```

- Dùng cho state đơn giản, độc lập
- Trong dự án: quản lý danh sách câu hỏi, vị trí hiện tại, flag

#### B. `useReducer` — Nâng cao (state machine)

```typescript
// useQuizAttempt.ts
const [state, dispatch] = useReducer(attemptReducer, INITIAL_STATE)
```

- Dùng khi state là object nhiều field thay đổi đồng bộ
- Dùng khi có state machine (nhiều phase chuyển đổi)
- **Discriminated Union**: mỗi action có type + payload khác nhau

```
Phase transitions:
  idle ──SELECT──→ submitting ──SUBMIT_SUCCESS──→ answered
                     │                                │
                     └──SUBMIT_ERROR──→ idle ←──CLEAR──┘
```

#### C. `useCallback` — Trung cấp (performance + referential stability)

```typescript
// useQuizEngine.ts
const toggleFlag = useCallback(() => {
  setFlagged((prev) => {
    const next = new Set(prev)
    next.has(questionsHook.currentIdx)
      ? next.delete(questionsHook.currentIdx)
      : next.add(questionsHook.currentIdx)
    return next
  })
}, [questionsHook.currentIdx])
```

- **Tại sao dùng?** Tránh tạo function mới mỗi render
- **Khi nào cần?** Khi function là dependency của hook khác hoặc truyền xuống child component
- **Lưu ý**: `clearAnswer` dùng `useCallback` với `[]` → function chỉ tạo 1 lần

#### D. `useMemo` — Trung cấp (derived state)

```typescript
// useQuizEngine.ts
const incorrectCount = useMemo(
  () => attemptHook.attemptHistory.filter((a) => !a.isCorrect).length,
  [attemptHook.attemptHistory],
)
```

- Tính toán giá trị từ state khác, chỉ re-calculate khi dependency thay đổi
- `answeredMap`, `correctMap`, `pct` đều là derived state

#### E. `useRef` — Cơ bản (mutable ref)

```typescript
// useQuizAttempt.ts
const lastQuestionType = useRef('')
const lastQuestionId = useRef('')
```

- Lưu giá trị giữa các render mà không gây re-render
- Ở đây: lưu câu hỏi hiện tại để dùng trong callback của mutation

#### F. Custom Hooks Pattern

Dự án áp dụng **Single Responsibility Hook** pattern:

```
1 hook = 1 nhóm state duy nhất
useQuizQuestions   → questions[] + index
useQuizAttempt     → submit state machine
useQuizImport      → import dialog state
useTimer           → timer state
useSaveQuestion    → bookmark state
useLoginForm       → login form state
useRegisterForm    → register form state
```

Sau đó **Orchestrator Hook** tổng hợp:

```
useQuizEngine = useQuizQuestions + useQuizAttempt + useQuizImport
              → 1 interface duy nhất cho component
```

---

### 6.3. Next.js App Router

#### A. Route Groups

```
(app)/
├── (auth)/               ← Route group: KHÔNG có trong URL
│   ├── layout.tsx        ← Layout riêng cho auth pages (mỏng, không sidebar)
│   └── login/page.tsx    → URL: /login
│
├── (main)/               ← Route group: KHÔNG có trong URL
│   ├── layout.tsx        ← Layout riêng cho main pages (dày, có sidebar)
│   ├── dashboard/page.tsx → URL: /dashboard
│   └── practice/[module]/[topic]/page.tsx → URL: /practice/grammar/comparison
│
└── api/                  ← API Routes (không có layout)
    └── attempts/route.ts → URL: /api/attemps
```

**Lợi ích:**
- `(auth)` và `(main)` có layout khác nhau
- Không ảnh hưởng đến URL
- Có thể có middleware riêng cho từng group

#### B. Server Component vs Client Component

| Server Component | Client Component |
|-----------------|------------------|
| Chạy ở server, gửi HTML | Chạy ở browser, có state + effect |
| Có thể `async` + `await` | Cần `'use client'` directive |
| Không dùng được hooks | Dùng được hooks |
| Direct database access | Phải fetch qua API |
| VD: `PracticeTopicView.tsx` | VD: `QuizEngine.tsx` |

**Chiến lược trong dự án:**
- **Server**: load dữ liệu ban đầu (questions từ JSON), render layout, SEO
- **Client**: quiz engine (interactive), form, import dialog

#### C. API Routes

```typescript
// src/app/api/attempts/route.ts
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const body = await request.json()
    const result = await submitAttempt(body, userId)
    return success(result)
  } catch (e) {
    if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
    return error('Internal server error', 500)
  }
}
```

**Pattern:**
1. Get userId (từ session hoặc dev fallback)
2. Parse request body
3. Gọi service layer
4. Return standardized response (success or error)
5. Catch AppError → trả về HTTP status code phù hợp

#### D. Server-side Data Loading

```typescript
// PracticeTopicView.tsx
const initialQuestions = topic.questionCount
  ? await loadQuestions(questionType, topic.questionCount)
  : []
```

- Load data từ JSON file trực tiếp (không qua API)
- Truyền xuống Client Component qua props
- Client Component dùng làm `initialQuestions` cho hook

---

### 6.4. Tailwind CSS & Design System

#### A. OKLCH Color Space

Dự án dùng **OKLCH** thay vì HEX/RGB/HSL truyền thống:

```css
/* OKLCH format: oklch(L C H / alpha) */
--green-teal-default: oklch(0.504 0.125 192.5);  /* #008081 */
--green-teal-80: oklch(0.504 0.125 192.5 / 0.8); /* 80% opacity */
```

**Tại sao OKLCH?**
- Perceptually uniform: thay đổi giá trị → mắt cảm nhận thay đổi đều
- Dễ tạo biến thể: cùng L, C, H chỉ khác alpha
- Tương thích dark mode tốt hơn

#### B. Design Token Mapping

Project map thủ công từ custom colors → shadcn tokens:

```css
:root {
  --background: var(--green-bright);          /* #eef7f7 */
  --foreground: var(--neutral-90);            /* #171717 */
  --primary: var(--primary-teal);             /* #185858 */
  --primary-foreground: var(--neutral-0);     /* #ffffff */
  --card: var(--neutral-0);                   /* #ffffff */
  /* ... */
}
```

**Chiến lược:** 
- Tự define bảng màu gốc (OKLCH)
- Map sang shadcn tokens
- Dark mode override từng token
- Tailwind v4 `@theme inline` tạo utility classes tự động

#### C. `cn()` Utility

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Công dụng:**
1. `clsx`: gộp class names có điều kiện
2. `twMerge`: gộp Tailwind classes, giải quyết xung đột (vd: `px-4 px-6` → `px-6`)

#### D. Custom Utilities (Tailwind v4)

```css
@utility tab-switcher-btn-active {
  background-color: var(--neutral-0);
  color: var(--green-teal-default);
  box-shadow: var(--shadow-tab-active);
}
@utility gradient-text {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Dùng: `className="tab-switcher-btn-active"` hoặc `className="gradient-text"`

---

### 6.5. Database & Prisma ORM

#### A. Schema Design (7 models, 6 enums)

```
User ──1:N──→ Attempt ──N:1── Question ──1:N── Option
 │              │                              │
 │              └──N:1── TestSession            │
 │                                              │
 └──1:N── SavedQuestion ──N:1── Question        │
                                                │
Tag ──N:M── QuestionTag ──N:M── Question ───────┘
```

**Các enums:**
- `QuestionType`: WORD_FORM, VOCABULARY, VERB_TENSE, PREPOSITION, CONJUNCTION, PARTICIPLE, VOICE, RELATIVE_CLAUSE, COMPARISON, AGREEMENT
- `Difficulty`: EASY, MEDIUM, HARD
- `QuestionSource`: ETS, AI, ADMIN_IMPORT, MANUAL
- `SessionType`: PRACTICE, TIMED_TEST
- `SessionStatus`: IN_PROGRESS, COMPLETED, ABANDONED

#### B. Prisma Client với PostgreSQL Adapter

```typescript
// src/lib/prisma.ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
```

**Kỹ thuật:**
- Singleton pattern (tránh nhiều connection khi hot reload)
- Dùng `pg` pool trực tiếp (không qua Prisma's default driver)
- `PrismaPg` adapter cho PostgreSQL-specific features

#### C. Transaction Pattern

```typescript
// quiz.repository.ts
export async function createAttempt(data: CreateAttemptInput) {
  const [attempt] = await prisma.$transaction([
    prisma.attempt.create({ data: { ... } }),
    prisma.question.update({
      where: { id: data.questionId },
      data: { timesUsed: { increment: 1 } },
    }),
  ])
  return attempt
}
```

- `$transaction` đảm bảo atomicity: cả 2 operation cùng thành công hoặc cùng rollback
- Cập nhật `timesUsed` + tạo attempt trong 1 transaction

#### D. Migration + Seed

```bash
pnpm db:migrate   # prisma migrate dev — tạo migration từ schema changes
pnpm db:seed      # tsx prisma/seed.ts — import data/questions.json vào DB
pnpm db:studio    # Prisma Studio — GUI xem/edit database
```

---

### 6.6. Authentication (NextAuth v5)

#### A. Configuration

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    session: ({ session, token }) => {
      if (session.user && token.sub) session.user.id = token.sub
      return session
    },
    jwt: ({ token, user }) => {
      if (user) token.sub = user.id
      return token
    },
  },
}
```

**Các thành phần:**
- `PrismaAdapter`: tự động đồng bộ User model với database
- `Credentials provider`: email + password (chưa có hash — dev mode)
- `JWT strategy`: session lưu trong JWT token (không dùng database session)
- `callbacks.session`: gán `user.id` từ token vào session

#### B. Dev Fallback Pattern

```typescript
// src/lib/auth-utils.ts
export async function getUserId(): Promise<string> {
  const session = await auth()
  if (session?.user?.id) return session.user.id

  // Dev mode: auto-create user
  const dev = await prisma.user.upsert({
    where: { email: 'dev@toeic.local' },
    update: {},
    create: { email: 'dev@toeic.local', name: 'Dev User' },
  })
  return dev.id
}
```

**Tại sao pattern này quan trọng?** 
- Dev không cần login
- Production: dùng session thật
- Không cần sửa code khi deploy

---

### 6.7. Service/Repository Pattern

#### A. Repository Layer

```typescript
// src/api/quiz/quiz.repository.ts
export async function findQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: { options: true },
  })
}

export async function createAttempt(data: CreateAttemptInput) {
  // transaction: create attempt + update question.timesUsed
}

export async function findAllAttempts(userId: string) {
  return prisma.attempt.findMany({
    where: { userId },
    select: { isCorrect: true, question: { select: { type: true } } },
  })
}
```

**Responsibility:** Chỉ chứa Prisma queries, không business logic.

#### B. Service Layer

```typescript
// src/api/quiz/quiz.service.ts
export async function submitAttempt(input, userId) {
  const question = await quizRepo.findQuestionById(input.questionId)
  if (!question) throw AppError.notFound('Question')

  const selectedOption = question.options.find((o) => o.id === input.selectedOptionId)
  if (!selectedOption) throw AppError.validation('Invalid option')

  const attempt = await quizRepo.createAttempt({ ... })
  const correctOptionId = question.options.find((o) => o.isCorrect)?.id

  return { attempt, isCorrect: selectedOption.isCorrect, correctOptionId, rationale: selectedOption.rationale }
}
```

**Responsibility:** Validation, business logic, orchestrate repository calls.

#### C. Weighted Questions Algorithm (Nâng cao)

```typescript
// quiz.service.ts:103-185
export async function getWeightedQuestions(userId, params) {
  // 1. Lấy tất cả attempts của user
  // 2. Tính accuracy cho từng type
  // 3. Tính weight = 1 - accuracy (type càng yếu → weight càng cao)
  // 4. Normalize weights → tổng = 1
  // 5. Phân bổ limit theo weight
  // 6. Shuffle + slice từng type
  // 7. Trộn tất cả + return
}
```

---

### 6.8. Feature-Folder Architecture

```
src/features/quiz/
├── types.ts              ← Interface/types (không import React)
├── constants.ts          ← Hằng số, label maps
├── client/
│   └── quiz.client.ts    ← API client (không state, không logic)
├── utils/
│   ├── quiz.utils.ts     ← Pure functions (ko biết React, dễ test)
│   ├── question.utils.ts ← getOptionStatus()
│   └── theory.utils.tsx   ← Lý thuyết ngữ pháp (JSX data)
├── hooks/
│   ├── useQuizQuestions.ts   ← 1 hook, 1 responsibility
│   ├── useQuizAttempt.ts     ← 1 hook, 1 responsibility
│   ├── useQuizImport.ts      ← 1 hook, 1 responsibility
│   └── useQuizEngine.ts      ← Orchestrator (compose 3 hooks trên)
└── components/
    ├── QuizEngine/           ← Smart component (gọi hooks)
    ├── QuizActiveView/       ← View khi đang làm quiz
    ├── QuizCompleteView/     ← View khi hoàn thành
    ├── QuizReviewPanel/      ← Review lại đáp án
    ├── QuestionCard/         ← Dumb component (nhận props)
    ├── OptionButton/         ← Dumb component
    ├── RationaleBox/         ← Dumb component
    ├── SaveButton/           ← Dumb component
    ├── ImportDialog/         ← Dumb component
    └── sections/             ← Page-level sections
        ├── PracticeTopicView/
        ├── PracticeHeaderSection/
        ├── QuizSection/
        └── TheorySection/
```

**Lợi ích:**
- **Tách biệt rõ ràng**: types → utils → hooks → components
- **Dễ test**: pure functions trong utils có thể test không cần mock React
- **Dễ refactor**: đổi database chỉ cần sửa repository
- **Dễ scale**: thêm tính năng mới = thêm folder mới

---

### 6.9. React Query (TanStack Query)

#### A. Provider Setup

```typescript
// src/app/provider.tsx
export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  )
}
```

**Providers chain:** SessionProvider → QueryClientProvider → Toaster

#### B. useMutation Pattern

```typescript
// useQuizAttempt.ts
const mutation = useMutation({
  mutationFn: ({ questionId, selectedOptionId }) =>
    submitAttempt(questionId, selectedOptionId),
  onSuccess: (data) => {
    dispatch({ type: 'SUBMIT_SUCCESS', result: data, ... })
    options.onStatsUpdate?.(...)
  },
  onError: () => {
    dispatch({ type: 'SUBMIT_ERROR' })
  },
})
```

**Luồng:**
1. User click → dispatch SELECT (optimistic)
2. `mutation.mutate(...)` gọi API
3. Success → dispatch SUBMIT_SUCCESS + update stats
4. Error → dispatch SUBMIT_ERROR (rollback)

---

### 6.10. Form & Validation (react-hook-form + Zod)

```typescript
// src/features/auth/schemas/login.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type LoginInput = z.infer<typeof loginSchema>
```

```typescript
// src/features/auth/hooks/useLoginForm.ts
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function useLoginForm() {
  return useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })
}
```

**Pattern:**
1. Define schema với Zod → tự động infer type
2. `z.infer<typeof schema>` → TypeScript type từ schema
3. `zodResolver` bridge: react-hook-form dùng Zod để validate

---

### 6.11. API Routes & Standardized Responses

#### A. Response Format

```typescript
// src/lib/response.ts
export function success<T>(data: T, message = 'Success') {
  return NextResponse.json({ success: true, data, message })
}

export function error(message: string, status = 400, code?: string) {
  return NextResponse.json({ success: false, message, code }, { status })
}

export function paginated<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true, data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  })
}
```

**Format:**
- Success: `{ success: true, data: T, message?: string }`
- Error: `{ success: false, message: string, code?: string }`
- Paginated: thêm `pagination` field

#### B. Error Handling

```typescript
// src/lib/errors/AppError.ts
export class AppError extends Error {
  constructor(public statusCode: number, message: string, public code?: string) {
    super(message)
  }
  static notFound(entity: string) { return new AppError(404, `${entity} not found`, 'NOT_FOUND') }
  static validation(message: string) { return new AppError(400, message, 'VALIDATION_ERROR') }
  static unauthorized(message = 'Unauthorized') { return new AppError(401, message, 'UNAUTHORIZED') }
}
```

**Pattern trong API route:**
```typescript
try {
  // ...
  return success(result)
} catch (e) {
  if (e instanceof AppError) return error(e.message, e.statusCode, e.code)
  return error('Internal server error', 500)
}
```

---

### 6.12. Animation (Framer Motion)

Dự án dùng Framer Motion cho landing page và animation cơ bản:

```typescript
// src/features/landing/animations.ts
import { motion } from 'framer-motion'

// Variants pattern
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}
```

**Pattern:** Variants (initial + animate + transition) cho component mount animation.

---

### 6.13. Testing (Vitest + Playwright)

Dự án có setup testing nhưng chưa có test files:

```json
// package.json
"devDependencies": {
  "vitest": "^4.1.9",
  "@playwright/test": "^1.61.0"
}
```

**Để viết test cho project này, bạn sẽ cần:**
- **Unit test (Vitest)**: test `quiz.utils.ts`, `question.utils.ts`, `response.ts`, `AppError.ts`
- **Hook test (Vitest + @testing-library/react)**: test `useQuizAttempt`, `useQuizEngine`
- **Component test (Vitest + @testing-library/react)**: test `QuestionCard`, `OptionButton`
- **E2E (Playwright)**: test full flow login → practice → submit → dashboard

---

### 6.14. Code Quality (Biome)

```json
// biome.json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "rules": {
      "recommended": true,
      "style": { "useSingleVarDeclarations": "off" },
      "correctness": { "useExhaustiveDependencies": "warn" }
    }
  }
}
```

**Biome thay thế ESLint + Prettier:**
- Nhanh hơn (Rust-based)
- Tích hợp linter + formatter
- VSCode extension: format on save + lint on type

**Scripts:**
```bash
pnpm lint      # biome check --write src/
pnpm format    # biome format --write src/
pnpm typecheck # tsc --noEmit
```

---

### 6.15. UI/UX Patterns & Design Tokens

#### A. shadcn/ui Components

shadcn/ui là "component collection" có thể copy-paste, không phải package:

```
src/components/ui/
├── form/
│   ├── button.tsx       ← CVA variants: default, destructive, outline, secondary, ghost, link
│   ├── input.tsx
│   ├── label.tsx
│   └── select.tsx
├── layout/
│   ├── badge.tsx
│   └── scroll-area.tsx
├── feedback/
│   └── sonner.tsx       ← Toast notifications
├── navigation/
│   ├── dropdown-menu.tsx
│   └── tabs.tsx
└── overlay/
    ├── dialog.tsx
    └── sheet.tsx
```

#### B. Custom Common Components

```
src/components/common/
├── AnimatedLoader/
├── AnimatedStep/
├── Badge/
├── Breadcrumb/
├── Button/
├── ConfirmDialog/
├── Dialog/
├── EmptyState/
├── Form/
├── Input/
├── Label/
├── Loading/
├── Select/
├── StepHeader/
└── Switch/
```

#### C. OptionButton State Machine (UI Pattern)

```typescript
const STATUS_STYLES: Record<OptionStatus, string> = {
  idle:      'border-gray-200 hover:border-blue-400 cursor-pointer',
  selected:  'border-blue-500 bg-blue-50',
  correct:   'border-green-500 bg-green-50',
  wrong:     'border-red-500 bg-red-50',
  disabled:  'opacity-60 cursor-not-allowed',
}
```

5 states của option button:
- `idle`: chưa chọn, có thể click
- `selected`: đang được chọn (trong lúc submitting)
- `correct`: đáp án đúng
- `wrong`: đáp án sai (user đã chọn)
- `disabled`: các option còn lại sau khi đã chọn

---

## 7. Bản đồ kiến thức trực quan

```
                          ┌───────────────────┐
                          │   TypeScript 5     │ ← Nền tảng của mọi thứ
                          └─────────┬─────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │   Next.js 16      │  │   React 19        │  │   Tailwind v4    │
   │   (App Router)    │  │   (Hooks + JSX)    │  │   + shadcn/ui    │
   └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
            │                     │                      │
            ▼                     ▼                      ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                     Quiz Feature (core)                      │
   │  useReducer | Hook Composition | Optimistic UI | State Mach  │
   └─────────────────────────────┬───────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │   React Query     │  │   Prisma ORM     │  │   NextAuth v5    │
   │   (TanStack)      │  │   + PostgreSQL   │  │   (Auth.js)      │
   └──────────────────┘  └──────────────────┘  └──────────────────┘
                                                      │
              ┌───────────────────────────────────────┘
              ▼
   ┌─────────────────────────────────────────────────────┐
   │              Service / Repository Pattern            │
   │  quiz.service.ts → quiz.repository.ts → Prisma      │
   └─────────────────────────────────────────────────────┘
```

---

## 8. Câu hỏi thường gặp

### Q: Tôi chỉ muốn sửa một cái gì đó nhỏ, cần biết gì?

Tình huống thường gặp + kiến thức cần:

| Tôi muốn... | Cần biết | File cần sửa |
|-------------|----------|--------------|
| Đổi màu chủ đạo | CSS custom properties, OKLCH | `src/app/globals.css` |
| Thêm 1 loại câu hỏi mới | TypeScript enum, Prisma schema, constants | `prisma/schema.prisma`, `data/questions.json`, `src/features/quiz/constants.ts` |
| Sửa cách tính điểm | TypeScript, quiz.service.ts logic | `src/api/quiz/quiz.service.ts` |
| Thêm 1 bước trong quiz flow | React hooks, useReducer, state machine | `src/features/quiz/hooks/useQuizAttempt.ts` |
| Thêm 1 API endpoint | Next.js API Routes, response.ts | `src/app/api/{name}/route.ts` |
| Thêm 1 trang mới | Next.js App Router, layout | `src/app/(main)/{name}/page.tsx` |
| Sửa UI của OptionButton | Tailwind, React props | `src/features/quiz/components/OptionButton/` |

### Q: Dự án này khác gì so với một dự án React thông thường?

| Điểm khác biệt | Lý do |
|----------------|-------|
| Dùng Next.js App Router (không phải React Router) | Server Components, file-based routing, SSR |
| Dùng `useReducer` thay vì Redux/Zustand | State machine pattern phù hợp với quiz flow |
| Dùng React Query thay vì Redux Toolkit Query | Server state management đơn giản hơn |
| Dùng Biome thay vì ESLint + Prettier | Tốc độ, tích hợp sẵn |
| Dùng Prisma thay vì TypeORM/Drizzle | Type-safe, migration tự động, schema-first |
| OKLCH thay vì HSL/RGB | Perceptually uniform, dễ tạo theme |

### Q: Làm sao để biết mình đã hiểu đủ?

Bạn có thể trả lời được các câu hỏi sau:

1. **TypeScript**: Giải thích discriminated union trong `useQuizAttempt`?
2. **React**: `useCallback` khác `useMemo` thế nào? Khi nào dùng `useReducer` thay vì `useState`?
3. **Next.js**: Server Component khác Client Component thế nào? Route groups dùng để làm gì?
4. **Prisma**: `$transaction` để làm gì? Singleton pattern trong `prisma.ts` giải quyết vấn đề gì?
5. **Architecture**: Service khác Repository thế nào? Feature-folder pattern có lợi ích gì?
6. **Data Flow**: Vẽ luồng từ lúc user click đáp án đến lúc hiện kết quả?
7. **State Machine**: Vẽ sơ đồ phase transitions của `useQuizAttempt`?

---

> **Lời khuyên cuối:** Đừng cố học tất cả cùng lúc. Bắt đầu với **Phase 1 (TypeScript + React Hooks)**, chỉ cần hiểu `useQuizAttempt.ts` là bạn đã hiểu được phần core của toàn bộ dự án. Mỗi phase xây dựng trên phase trước. Chúc bạn học tốt!
