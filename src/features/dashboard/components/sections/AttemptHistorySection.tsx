'use client'

import { useMemo } from 'react'
import { TYPE_LABEL_MAP } from '@/constants/index.constant'

interface Attempt {
  id: string
  isCorrect: boolean
  createdAt: string
  question: {
    type: string
    difficulty: string
  }
}

interface AttemptHistorySectionProps {
  attempts: Attempt[]
}

export function AttemptHistorySection({ attempts }: AttemptHistorySectionProps) {
  const sorted = useMemo(
    () =>
      [...attempts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [attempts],
  )

  return (
    <div className='bg-card p-6 rounded-2xl shadow-sm border border-border'>
      <h3 className='text-lg font-semibold mb-4 border-b pb-2'>Lịch sử làm bài</h3>
      {sorted.length === 0 ? (
        <p className='text-sm text-muted-foreground text-center py-8'>
          Chưa có bài làm nào. Hãy bắt đầu luyện tập ngay!
        </p>
      ) : (
        <div className='space-y-2'>
          {sorted.slice(0, 10).map((a) => (
            <div
              key={a.id}
              className='flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm'
            >
              <div className='flex items-center gap-3'>
                <span
                  className={`w-2 h-2 rounded-full ${a.isCorrect ? 'bg-success' : 'bg-error'}`}
                />
                <span className='text-foreground'>
                  {TYPE_LABEL_MAP[a.question.type] ?? a.question.type}
                </span>
              </div>
              <span className='text-xs text-muted-foreground'>{a.isCorrect ? 'Đúng' : 'Sai'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
