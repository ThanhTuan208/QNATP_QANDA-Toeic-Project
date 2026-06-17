# Stage 5: Advanced — Query nâng cao

---

## 1. Transaction (nhiều thao tác trong 1 lần)

```typescript
// Submit answer + update test session cùng lúc
await prisma.$transaction(async (tx) => {
  const attempt = await tx.attempt.create({
    data: {
      userId,
      questionId,
      selectedOptionId,
      isCorrect,
      timeSpentSeconds,
    },
  })

  await tx.testSession.update({
    where: { id: sessionId },
    data: {
      totalQuestions: { increment: 1 },
      correctCount: isCorrect ? { increment: 1 } : undefined,
    },
  })

  return attempt
})
```

## 2. Raw SQL Query (khi Prisma query không đủ)

```typescript
// Random questions (PostgreSQL)
const questions = await prisma.$queryRaw`
  SELECT q.*, 
    json_agg(
      json_build_object(
        'id', o.id, 
        'text', o.text,
        'isCorrect', o.is_correct,
        'rationale', o.rationale
      ) ORDER BY o.order
    ) as options
  FROM "Question" q
  JOIN "Option" o ON o.question_id = q.id
  WHERE q.is_active = true
    AND q.type = ${type}::"QuestionType"
  GROUP BY q.id
  ORDER BY RANDOM()
  LIMIT ${limit}
`
```

## 3. Full-text Search (tìm kiếm câu hỏi)

```typescript
// Dùng PostgreSQL tsvector
const results = await prisma.$queryRaw`
  SELECT *, 
    ts_rank(to_tsvector('english', question_text), plainto_tsquery('english', ${search})) as rank
  FROM "Question"
  WHERE to_tsvector('english', question_text) @@ plainto_tsquery('english', ${search})
  ORDER BY rank DESC
  LIMIT 20
`
```

## 4. Batch Insert (import nhiều câu hỏi cùng lúc)

```typescript
const questions = jsonData.map(q => ({
  questionText: q.question,
  type: q.type as QuestionType,
  difficulty: q.difficulty as Difficulty,
}))

// Dùng createMany (nhanh hơn create từng cái)
await prisma.question.createMany({ data: questions })
```

## 5. Middleware (Prisma lifecycle hooks)

```typescript
// Tự động update timesUsed mỗi khi question được dùng
prisma.$use(async (params, next) => {
  if (params.model === 'Attempt' && params.action === 'create') {
    await prisma.question.update({
      where: { id: params.args.data.questionId },
      data: { timesUsed: { increment: 1 } },
    })
  }
  return next(params)
})
```
