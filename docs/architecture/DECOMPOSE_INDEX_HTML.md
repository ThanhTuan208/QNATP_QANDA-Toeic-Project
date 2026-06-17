# Decompose index.html → Next.js Architecture

> Phân tách file index.html prototype thành kiến trúc Next.js.

---

## 1. Tổng quan index.html hiện tại

File `index.html` là 1 monolithic SPA gồm:

| Phần | Dòng | Chức năng |
|------|:----:|-----------|
| HTML + CSS | 1-50 | Style, layout, responsive |
| Navigation | 54-64 | Navbar với scroll buttons |
| Welcome | 68-74 | Header giới thiệu |
| Stats sidebar | 78-104 | Doughnut chart + điểm số |
| Quiz engine | 106-146 | Question, options, rationale, next button |
| Theory table | 148-193 | Bảng lý thuyết so sánh hơn |
| JavaScript data | 197-248 | 5 câu hỏi hardcode (quizData) |
| JavaScript logic | 250-398 | initChart, updateUI, handleSelection, displayRationale... |

**Vấn đề:** Toàn bộ UI, data, logic trong 1 file → khó maintain, không mở rộng được.

---

## 2. Bảng phân tách chi tiết

### 2.1 `index.html` ──→ Next.js files

| index.html | Next.js file | Ghi chú |
|------------|-------------|---------|
| `<style>` (lines 10-50) | `src/app/globals.css` | Tailwind v4 + CSS variables |
| `<nav>` (lines 54-64) | `src/components/layout/Navbar.tsx` | Convert buttons → Next.js Link |
| Welcome header (lines 68-74) | `src/app/page.tsx` | Landing page |
| Stats sidebar (lines 78-104) | `src/components/dashboard/ProgressChart.tsx` | Doughnut chart |
| Quiz engine (lines 106-146) | `src/features/quiz/components/` | Gồm nhiều component nhỏ |
| Theory table (lines 148-193) | `src/app/page.tsx` | Section dưới landing page |
| **quizData** (lines 197-248) | `data/questions.json` + `prisma/seed.ts` | Externalize data |
| **initChart** (lines 255-273) | `src/components/dashboard/ProgressChart.tsx` | Recharts |
| **updateUI** (lines 275-295) | `src/features/quiz/components/QuestionCard.tsx` | Render question + options |
| **handleSelection** (lines 297-331) | `src/app/api/attempt/route.ts` + `src/features/quiz/components/OptionButton.tsx` | Submit + UI update |
| **displayRationale** (lines 333-345) | `src/features/quiz/components/RationaleBox.tsx` | Show explanation |
| **updateStats** (lines 347-355) | `src/components/dashboard/StatsSummary.tsx` | Update numbers |
| **nextQuestion** (lines 357-364) | `src/features/quiz/components/QuizEngine.tsx` | State management |
| **showFinalResults** (lines 366-385) | `src/app/(main)/practice/session/page.tsx` | Result page |
| **showHint** (lines 387-389) | `src/features/quiz/components/QuestionCard.tsx` | Hint button |
| **scrollToSection** (lines 391-393) | `src/app/page.tsx` | Anchor links |
| **importModal** (lines 201-219) | `src/features/admin/components/JsonImporter.tsx` | Admin feature |

### 2.2 JavaScript functions → Components + API

```
index.html                          Next.js
──────────────────────────────────────────────────────────────
quizData (hardcode 5 câu)          data/questions.json (33 câu)
                                    → prisma/seed.ts import vào DB
                                    → API: GET /api/questions
                                    
initChart()                         recharts <PieChart />
                                    trong ProgressChart.tsx
                                    
updateUI()                          QuestionCard.tsx
q => question + 4 buttons           (server fetch data, client render)

handleSelection()                   Client click → POST /api/attempt
→ kiểm tra đúng/sai                 → Prisma lưu attempt
→ hiển thị rationale                → Response { correct, rationale }
                                    → OptionButton cập nhật UI

displayRationale()                  RationaleBox.tsx
hiển thị giải thích + màu           green/red border + text

updateStats()                       StatsSummary.tsx
cập nhật chart + điểm               fetch('/api/stats') → render

nextQuestion()                      QuizEngine.tsx
chuyển câu, kết thúc bài            useReducer hoặc useState
```

---

## 3. Component Tree — Từ index.html sang Next.js

### Hiện tại (index.html)

```
index.html (1 file)
├── <nav> navbar
├── <header> welcome
├── <section> stats
│   ├── <canvas> chart
│   ├── completedCount
│   ├── correctCount
│   └── accuracyLabel
├── <section> quiz
│   ├── questionNumber
│   ├── questionText
│   ├── optionsGrid (4 buttons)
│   ├── exploreInstruction
│   ├── rationaleDisplay
│   ├── hintBtn
│   └── nextBtn
└── <section> theory table
```

### Mới (Next.js)

```
/ -> page.tsx (Landing)
├── WelcomeSection
├── TheoryTable (kế thừa từ index.html)
└── Links → /practice, /login

/(main)/practice/page.tsx
├── TypeFilter (chọn dạng câu hỏi)
├── DifficultyFilter
└── Button → Start Practice

/(main)/practice/session/page.tsx
├── QuizEngine (state machine)
│   ├── QuestionCard
│   │   ├── questionText
│   │   └── OptionButton × 4
│   ├── RationaleBox (sau khi chọn)
│   ├── HintButton
│   └── NextButton

/(main)/dashboard/page.tsx
├── StatsSummary
│   ├── ProgressChart (doughnut)
│   ├── completedCount
│   ├── correctCount
│   └── accuracyLabel
└── AttemptHistory (bảng lịch sử)
```

---

## 4. Luồng Quiz Engine — Chi tiết

### State machine (trong QuizEngine)

```
IDLE ──► LOADING ──► READY ──► ANSWERED ──► SHOW_RATIONALE ──► NEXT
  │         │           │           │              │              │
  │         │           │           │              │              │
  └─────────┴───────────┴───────────┴──────────────┴──────────────┘
```

### File chịu trách nhiệm cho từng state

| State | File | Xử lý |
|-------|------|-------|
| `LOADING` | `session/page.tsx` | Fetch question từ API |
| `READY` | `QuestionCard.tsx` | Render question + enable options |
| `ANSWERED` | `OptionButton.tsx` | Highlight đúng/sai, disable options |
| `SHOW_RATIONALE` | `RationaleBox.tsx` | Show giải thích + hint |
| `NEXT` | `QuizEngine.tsx` | Load câu tiếp hoặc kết thúc |

### Code flow cụ thể

```typescript
// session/page.tsx (Client Component)
'use client'
import { useState } from 'react'
import { QuizEngine } from '@/features/quiz/components/QuizEngine'

export default function SessionPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)

  // Fetch câu hỏi khi mount
  useEffect(() => {
    fetch('/api/questions/random?limit=10')
      .then(res => res.json())
      .then(setQuestions)
  }, [])

  if (!questions.length) return <Loading />

  return (
    <QuizEngine
      question={questions[currentIdx]}
      onNext={() => setCurrentIdx(i => i + 1)}
      onFinish={() => /* show results */}
    />
  )
}
```

```typescript
// QuizEngine.tsx
export function QuizEngine({ question, onNext, onFinish }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSelect(idx: number) {
    if (submitted) return setSelected(idx) // show rationale của option khác
    setSelected(idx)
    setSubmitted(true)
    // Gọi API submit
    await fetch('/api/attempt', {
      method: 'POST',
      body: JSON.stringify({ questionId: question.id, selectedOptionId: idx })
    })
  }

  if (!question) return <div>No more questions</div>

  return (
    <div>
      <QuestionCard
        question={question}
        selected={selected}
        submitted={submitted}
        onSelect={handleSelect}
      />
      {submitted && <RationaleBox question={question} selectedIdx={selected} />}
      {submitted && (
        <Button onClick={onNext}>
          Câu tiếp theo
        </Button>
      )}
    </div>
  )
}
```

---

## 5. Data Migration — Từ index.html sang Prisma

### Bước 1: JSON hiện tại (`data/questions.json`)

```json
[{
  "question": "The new marketing strategy...",
  "type": "comparison",
  "difficulty": "easy",
  "options": [
    { "text": "effectively", "isCorrect": false, "rationale": "..." },
    { "text": "more effective", "isCorrect": true, "rationale": "..." },
    ...
  ],
  "hint": "Chú ý cụm..."
}]
```

### Bước 2: Seed script (`prisma/seed.ts`)

```typescript
import { PrismaClient } from '@prisma/client'
import questions from '../data/questions.json'

const prisma = new PrismaClient()

async function main() {
  for (const q of questions) {
    await prisma.question.create({
      data: {
        questionText: q.question,
        type: q.type.toUpperCase().replace('-', '_'),
        difficulty: q.difficulty.toUpperCase(),
        hint: q.hint,
        options: {
          create: q.options.map((opt, idx) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            rationale: opt.rationale,
            order: idx,
          })),
        },
      },
    })
  }
  console.log(`Seeded ${questions.length} questions`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

### Bước 3: API endpoint

```typescript
// app/api/questions/random/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit')) || 10
  const type = searchParams.get('type')
  const difficulty = searchParams.get('difficulty')

  const where = {
    ...(type && { type: type.toUpperCase() as any }),
    ...(difficulty && { difficulty: difficulty.toUpperCase() as any }),
  }

  // Random: dùng PostgreSQL ORDER BY RANDOM()
  const questions = await prisma.$queryRaw`
    SELECT q.*, json_agg(
      json_build_object(
        'id', o.id, 'text', o.text,
        'isCorrect', o.is_correct,
        'rationale', o.rationale,
        'order', o.order
      ) ORDER BY o.order
    ) as options
    FROM "Question" q
    JOIN "Option" o ON o.question_id = q.id
    WHERE q.is_active = true ${type ? Prisma.sql`AND q.type = ${type}::"QuestionType"` : Prisma.empty}
    GROUP BY q.id
    ORDER BY RANDOM()
    LIMIT ${limit}
  `

  return NextResponse.json(questions)
}
```

---

## 6. Kế hoạch thực hiện

### Phase 1: Giữ nguyên prototype, thêm kiến trúc (Day 1)

| Bước | File | Output |
|:----:|------|--------|
| 1 | `prisma/schema.prisma` | Schema đầy đủ |
| 2 | `prisma/seed.ts` | Import data/questions.json |
| 3 | `src/lib/prisma.ts` | PrismaClient singleton |
| 4 | `src/lib/auth.ts` | NextAuth config |
| 5 | `src/lib/utils.ts` | cn() function |

### Phase 2: Pages + API (Day 2-3)

| Bước | File | Output |
|:----:|------|--------|
| 6 | `app/api/questions/random/route.ts` | Random question API |
| 7 | `app/api/attempt/route.ts` | Submit answer API |
| 8 | `app/api/stats/route.ts` | Stats API |
| 9 | `app/(main)/practice/page.tsx` | Trang chọn dạng |
| 10 | `app/(main)/practice/session/page.tsx` | Trang làm bài |

### Phase 3: Components (Day 3-4)

| Bước | File | Output |
|:----:|------|--------|
| 11 | `features/quiz/types.ts` | Types |
| 12 | `features/quiz/components/QuestionCard.tsx` | Question UI |
| 13 | `features/quiz/components/OptionButton.tsx` | Option button |
| 14 | `features/quiz/components/RationaleBox.tsx` | Rationale display |
| 15 | `features/quiz/components/QuizEngine.tsx` | Quiz engine |

### Phase 4: Dashboard + Admin (Day 5)

| Bước | File | Output |
|:----:|------|--------|
| 16 | `components/dashboard/ProgressChart.tsx` | Chart (từ index.html) |
| 17 | `components/dashboard/StatsSummary.tsx` | Stats display |
| 18 | `app/(main)/dashboard/page.tsx` | Dashboard page |
| 19 | `app/(main)/admin/questions/page.tsx` | Import JSON (từ index.html modal) |

---

## 7. So sánh cuối cùng

| Khía cạnh | index.html (cũ) | Next.js (mới) |
|-----------|----------------|---------------|
| **Số file** | 1 file (401 dòng) | ~25 files |
| **Data** | Hardcode trong JS | PostgreSQL + Prisma |
| **Quiz logic** | Global functions | Components + state |
| **Chart** | Chart.js CDN | Recharts (React native) |
| **Import JSON** | Modal trong HTML | Admin page riêng |
| **Auth** | Không có | NextAuth |
| **Scale** | 5 câu, 1 chủ điểm | 500+ câu, 10 dạng |
