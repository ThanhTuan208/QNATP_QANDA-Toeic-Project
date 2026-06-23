'use client'

import { useState } from 'react'
import { ProgressChart } from '@/features/dashboard/components/ProgressChart'
import { StatsSummary } from '@/features/dashboard/components/StatsSummary'
import { QuizEngine } from '../../QuizEngine'

interface QuizSectionProps {
  type: string
  initialQuestions: Array<{
    id: string
    questionText: string
    type: string
    difficulty: string
    hint: string | null
    options: Array<{ id: string; text: string; order: number }>
  }>
}

export function QuizSection({ type, initialQuestions }: QuizSectionProps) {
  const [stats, setStats] = useState({ total: 0, correct: 0 })

  return (
    <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
      <section className='lg:col-span-3'>
        <QuizEngine
          type={type}
          initialQuestions={initialQuestions}
          onStatsUpdate={(total, correct) => setStats({ total, correct })}
        />
      </section>
      <aside className='lg:col-span-2 space-y-6'>
        <div className='bg-card p-6 rounded-2xl shadow-sm border border-border sticky top-24'>
          <h3 className='text-lg font-semibold mb-4 border-b pb-2'>Tiến độ của bạn</h3>
          <ProgressChart correct={stats.correct} total={Math.max(stats.total, 10)} />
          <div className='mt-6'>
            <StatsSummary
              completed={stats.total}
              total={Math.max(stats.total, 10)}
              correct={stats.correct}
            />
          </div>
        </div>
        <div className='bg-muted p-6 rounded-2xl border border-border'>
          <h3 className='font-bold mb-2'>Mẹo làm bài</h3>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            Hãy luôn xác định <strong>động từ chính</strong> trước khi chọn đáp án. Đọc kỹ ngữ cảnh
            của câu để chọn từ loại phù hợp.
          </p>
        </div>
      </aside>
    </div>
  )
}
