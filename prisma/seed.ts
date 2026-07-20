import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type QuestionType } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const isReset = process.argv.includes('--reset')

const questions = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'questions.json'), 'utf-8'))

const TYPE_MAP: Record<string, QuestionType> = {
  'word-form': 'WORD_FORM',
  vocabulary: 'VOCABULARY',
  'verb-tense': 'VERB_TENSE',
  preposition: 'PREPOSITION',
  conjunction: 'CONJUNCTION',
  participle: 'PARTICIPLE',
  voice: 'VOICE',
  'relative-clause': 'RELATIVE_CLAUSE',
  comparison: 'COMPARISON',
  agreement: 'AGREEMENT',
  'modal-verbs': 'MODAL_VERBS',
  conditionals: 'CONDITIONALS',
  'infinitive-gerund': 'INFINITIVE_GERUND',
  'parallel-structure': 'PARALLEL_STRUCTURE',
  pronoun: 'PRONOUN',
  'determiner-quantifier': 'DETERMINER_QUANTIFIER',
  'sentence-insertion': 'SENTENCE_INSERTION',
  grammar: 'GRAMMAR',
  transition: 'TRANSITION',
  'main-idea': 'MAIN_IDEA',
  detail: 'DETAIL',
  inference: 'INFERENCE',
  'vocabulary-in-context': 'VOCABULARY_IN_CONTEXT',
  reference: 'REFERENCE',
  intention: 'INTENTION',
  'next-step': 'INTENTION',
  'not-question': 'NOT_QUESTION',
}

async function main() {
  if (isReset) {
    // Xoa du lieu cu neu reset
    await prisma.attempt.deleteMany()
    await prisma.option.deleteMany()
    await prisma.question.deleteMany()
  }

  const data = questions as any[]
  console.log(`Seeding ${data.length} questions...`)

  for (const q of data) {
    const questionData = {
      part: q.part ?? 5,
      questionText: q.question,
      type: TYPE_MAP[q.type] || 'WORD_FORM',
      difficulty: (q.difficulty || 'medium').toUpperCase(),
      source: 'ADMIN_IMPORT' as const,
      hint: q.hint || null,
    }

    const questionId = q.code

    const upsertQuestion = async () => {
      const common = {
        ...questionData,
        options: {
          create: q.options.map((opt: any, idx: number) => ({
            id: `${questionId}_${idx + 1}`,
            text: opt.text,
            isCorrect: opt.isCorrect,
            rationale: opt.rationale,
            order: idx,
          })),
        },
      }

      if (isReset) {
        return prisma.question.create({ data: { id: questionId, ...common } })
      }

      const existing = await prisma.question.findUnique({ where: { id: questionId } })
      if (existing) {
        return prisma.question.update({ where: { id: questionId }, data: questionData })
      }
      return prisma.question.create({ data: { id: questionId, ...common } })
    }

    const created = await upsertQuestion()

    // Create Passage record for Part 6/7 questions
    const part = q.part ?? 5
    if ([6, 7].includes(part) && created.passageId === null) {
      const sourceText = q.passageText || q.passage || q.question || ''
      if (sourceText) {
        const existingPassage = await prisma.passage.findUnique({
          where: { id: `passage_${questionId}` },
        })
        if (!existingPassage) {
          const passage = await prisma.passage.create({
            data: {
              id: `passage_${questionId}`,
              part,
              passageFormat: 'SINGLE',
              content: sourceText,
              title: q.passageTitle || null,
            },
          })
          await prisma.question.update({
            where: { id: questionId },
            data: { passageId: passage.id },
          })
        }
      }
    }
  }

  console.log(`Seeded ${data.length} questions successfully`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
