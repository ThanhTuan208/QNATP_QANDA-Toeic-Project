# Onboarding — Làm quen với dự án

> Lộ trình step-by-step từ `git clone` → hiểu sâu code.

---

## Bước 0: Chạy được app

```bash
# 1. Cài dependencies
pnpm install

# 2. Tạo file .env (hỏi đồng đội hoặc copy từ .env.example)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# 3. Tạo database + seed
pnpm db:migrate     # migration
pnpm db:seed        # import 33 câu hỏi

# 4. Chạy dev
pnpm dev            # → http://localhost:3000
```

Sau bước này bạn thấy landing page với 10 card practice types. Click 1 cái → vào `/practice/comparison` → thấy theory table + quiz.

---

## Bước 1: Đọc docs — hiểu kiến trúc

Đọc theo thứ tự:

| Thứ tự | File | Học được gì |
|:------:|------|-------------|
| 1 | `docs/architecture/ARCHITECTURE.md` | Tổng quan layers, cấu trúc thư mục `app/` vs `features/` vs `components/`, 2 đường data flow chính |
| 2 | `docs/architecture/quiz-flow.md` | Luồng feature quiz: khởi tạo → chọn đáp án → next → import → reset |
| 3 | `docs/architecture/quiz-flow-detailed.md` | Chi tiết input/output từng file trong quiz feature |

> Đọc ARCHITECTURE.md trước để biết "bản đồ" tổng thể, rồi đọc quiz-flow.md để hiểu 1 feature cụ thể.

---

## Bước 2: Đọc code theo data flow

Mở project trong VS Code và trace 1 user flow hoàn chỉnh.

### Flow 1: Landning page → click practice card

```
src/app/page.tsx                                     # Landing page
  → PracticeCardsSection                             # Render 10 card, mỗi card là <Link>
    → PRACTICE_TYPES (constants/index.constant.ts)   # Danh sách type: id, label, icon
      → href="/practice/comparison"                  # Click → navigate
```

### Flow 2: Load trang practice

```
src/app/(main)/practice/[type]/page.tsx              # Server Component
  → await params → { type: "comparison" }            # Lấy slug từ URL
  → loadQuestions(type)                              # readFileSync lọc 33 câu từ JSON
  → <TheorySection type />                           # Render bảng lý thuyết
  → <QuizSection type initialQuestions />             # Client component
    → <QuizEngine type initialQuestions />
      → useQuizEngine({ type, initialQuestions })
        → useQuizQuestions({ type, initialQuestions })
```

**File cần đọc:**
1. `page.tsx` — entry point, validate type, load data
2. `QuizSection.tsx` — layout 2 cột (quiz + sidebar stats)
3. `QuizEngine.tsx` — smart component, render 4 trạng thái (loading/empty/complete/quiz)
4. `QuestionCard.tsx` — render question + 4 options
5. `OptionButton.tsx` — 1 button, 5 trạng thái màu

### Flow 3: Chọn đáp án

```
OptionButton.onClick
  → QuestionCard.onSelect(optId)
    → QuizEngine.handleSelect(optId)
      → useQuizAttempt.handleSelect(optId)
        → dispatch({ type: 'SELECT' })              // phase: idle → submitting
        → submitAttempt(questionId, optionId)        // POST /api/attempts
          → dispatch({ type: 'SUBMIT_SUCCESS' })     // phase: submitting → answered
          → render RationaleBox (đúng/sai + giải thích)
```

**File cần đọc:**
1. `useQuizAttempt.ts` — state machine (useReducer), 3 phase: idle → submitting → answered
2. `quiz.client.ts` — `submitAttempt()` gọi POST /api/attempts
3. `RationaleBox.tsx` — hiển thị kết quả + nút Next

### Flow 4: Import câu hỏi bằng JSON

```
Click "Tự nhập câu hỏi"
  → useQuizImport.openImport()
    → generateTemplate(type)                         // Tạo JSON mẫu
    → generatePrompt(type)                           // Tạo prompt cho AI
    → setShowImport(true)                            // Hiện dialog

Paste JSON → click "Sử dụng"
  → useQuizImport.submitImport()
    → parseImportedJSON(json, type)                  // Parse + validate
    → onImportQuestions(parsed)                      // Gửi lên orchestrator
      → questionsHook.setQuestions(parsed)           // Ghi đè questions
      → questionsHook.resetIdx()                     // Về câu đầu
```

**File cần đọc:**
1. `useQuizImport.ts` — state của dialog
2. `quiz.controller.ts` — 3 pure functions: `generateTemplate`, `generatePrompt`, `parseImportedJSON`
3. `ImportDialog.tsx` — render modal

---

## Bước 3: Đọc Database Layer

```
prisma/schema.prisma              # 6 models, 5 enums
  ├── User                        # Auth
  ├── Question                    # TOEIC Part 5 questions
  ├── Option                      # 4 options/question + rationale
  ├── Attempt                     # Lịch sử làm bài
  ├── TestSession                 # Phiên luyện tập
  └── Tag + QuestionTag           # Phân loại

src/lib/prisma.ts                 # PrismaClient singleton + adapter Prisma v7
```

**So sánh với ASP.NET Core để dễ hình dung:**

| TOEIC | ASP.NET Core |
|-------|-------------|
| `schema.prisma` | `DbContext` + Entity classes |
| `prisma/question.findMany()` | `context.Questions.ToListAsync()` |
| `POST /api/attempts` → `prisma.attempt.create()` | `Controller` → `_context.Attempts.AddAsync()` |

---

## Bước 4: Đọc API Routes

```
src/app/api/
├── questions/route.ts            # GET /api/questions (list + filter)
├── questions/random/route.ts     # GET /api/questions/random
├── questions/[id]/route.ts       # GET /api/questions/:id
├── attempts/route.ts             # POST /api/attempts (submit answer)
├── stats/route.ts                # GET /api/stats
└── auth/[...nextauth]/route.ts   # NextAuth handler
```

Mỗi file là 1 API endpoint. Đọc `attempts/route.ts` để hiểu flow submit:

```ts
// 1. Nhận { questionId, selectedOptionId } từ body
// 2. Tìm question + correct option trong DB
// 3. So sánh selectedOptionId với correctOptionId
// 4. Tạo Attempt record trong DB
// 5. Trả về { isCorrect, correctOptionId, rationale }
```

---

## Bước 5: Tự tay sửa — học nhanh nhất

Sau khi đọc xong, làm 3 bài tập để kiểm tra hiểu biết:

### Bài 1: Thêm 1 type mới
```
1. Thêm vào VALID_TYPES (page.tsx)
2. Thêm vào TYPE_LABEL_MAP (constants.ts)
3. Thêm vào QuestionType enum (schema.prisma)
4. Thêm vào migration
5. Thêm data vào questions.json
→ Chạy pnpm dev xem card mới hiện ra chưa
```

### Bài 2: Sửa UI OptionButton
```
Sửa OptionButton.tsx để thêm 1 trạng thái mới "hover"
→ Xem hiệu ứng thay đổi khi chọn đáp án
```

### Bài 3: Đọc 1 API endpoint
```
Mở src/app/api/attempts/route.ts
- debug bằng console.log
- dùng Postman gọi thử POST /api/attempts
- xem response format
```

---

## Tóm tắt — Bản đồ kiến thức

```
┌────────────────────────────────────────────┐
│              TRANG BẠN NHÌN THẤY           │
├────────────────────────────────────────────┤
│  page.tsx (server) → render HTML sẵn       │
│  QuizEngine (client) → tương tác           │
├────────────────────────────────────────────┤
│              HOOKS (orchestration)          │
│  useQuizQuestions → questions[] + currentIdx│
│  useQuizAttempt   → phase machine          │
│  useQuizImport    → dialog state           │
│  useQuizEngine    → phối hợp 3 hooks trên  │
├────────────────────────────────────────────┤
│          CONTROLLERS (pure logic)           │
│  quiz.utils     → parse, generate          │
│  question.utils → getOptionStatus          │
│  theory.utils   → THEORY_DATA              │
├────────────────────────────────────────────┤
│          API (network layer)               │
│  quiz.client.ts → fetchQuestions, submit   │
├────────────────────────────────────────────┤
│         API ROUTES (server endpoints)      │
│  /api/questions/random → GET               │
│  /api/attempts         → POST              │
├────────────────────────────────────────────┤
│           DATABASE (Prisma + PostgreSQL)   │
│  schema.prisma → Question, Option, Attempt │
│  seed.ts       → import questions.json     │
└────────────────────────────────────────────┘
```
