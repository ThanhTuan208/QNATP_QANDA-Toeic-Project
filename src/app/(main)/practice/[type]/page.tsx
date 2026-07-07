import { readFileSync } from 'fs'
import { notFound } from 'next/navigation'
import { join } from 'path'
import { PracticeHeaderSection } from '@/features/quiz/components/sections/PracticeHeaderSection'
import { QuizSection } from '@/features/quiz/components/sections/QuizSection'
import { TheorySection } from '@/features/quiz/components/sections/TheorySection'
import { TYPE_CONTEXT, TYPE_LABEL_MAP } from '@/features/quiz/constants'

interface PracticeTypePageProps {
  params: Promise<{ type: string }>
}

const VALID_TYPES = new Set([
  'word-form',
  'comparison',
  'vocabulary',
  'verb-tense',
  'preposition',
  'conjunction',
  'participle',
  'voice',
  'relative-clause',
  'agreement',
])

function loadQuestions(type: string) {
  try {
    const filePath = join(process.cwd(), 'data', 'questions.json')
    const raw = readFileSync(filePath, 'utf-8')
    const all: Array<{
      question: string
      type: string
      difficulty: string
      options: Array<{ text: string; isCorrect: boolean; rationale: string }>
      hint?: string
      code: string
    }> = JSON.parse(raw)
    return all
      .filter((q) => q.type === type)
      .map((q) => ({
        id: q.code,
        questionText: q.question,
        type: q.type,
        difficulty: q.difficulty,
        hint: q.hint ?? null,
        options: q.options.map((o, idx) => ({
          id: `${q.code}_${idx}`,
          text: o.text,
          order: idx,
        })),
      }))
  } catch {
    return []
  }
}

export default async function PracticeTypePage({ params }: PracticeTypePageProps) {
  const { type } = await params

  if (!VALID_TYPES.has(type)) notFound()

  const typeLabel = TYPE_LABEL_MAP[type] ?? type
  const contextDesc =
    TYPE_CONTEXT[type] ?? 'Luyện tập dạng câu hỏi này để nâng cao kỹ năng TOEIC Reading của bạn.'

  const initialQuestions = loadQuestions(type)

  return (
    <div className='space-y-8'>
      <PracticeHeaderSection typeLabel={typeLabel} contextDesc={contextDesc} />
      <TheorySection type={type} />
      <QuizSection type={type} initialQuestions={initialQuestions} />
    </div>
  )
}
