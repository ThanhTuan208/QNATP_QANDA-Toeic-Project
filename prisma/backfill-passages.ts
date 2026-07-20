import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const questions = await prisma.question.findMany({
    where: {
      part: { in: [6, 7] },
      passageId: null,
    },
  })

  console.log(`Found ${questions.length} Part 6/7 questions without passage linkage`)

  for (const q of questions) {
    const sourceText = q.passageText || q.questionText

    const passage = await prisma.passage.create({
      data: {
        id: `passage_backfill_${q.id}`,
        part: q.part,
        passageFormat: 'SINGLE',
        content: sourceText,
        title: q.part === 6 ? 'Text Completion Passage' : 'Reading Passage',
      },
    })

    await prisma.question.update({
      where: { id: q.id },
      data: { passageId: passage.id },
    })

    console.log(`  Linked question ${q.id} → passage ${passage.id}`)
  }

  console.log('Backfill complete')
}

main()
  .catch((e) => {
    console.error('Backfill failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
