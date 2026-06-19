'use client'

interface StatsSummaryProps {
  completed: number
  total: number
  correct: number
}

export function StatsSummary({ completed, total, correct }: StatsSummaryProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className='space-y-2'>
      <div className='flex justify-between text-sm'>
        <span>Đã hoàn thành:</span>
        <span className='font-bold'>
          {completed}/{total}
        </span>
      </div>
      <div className='flex justify-between text-sm'>
        <span>Đúng:</span>
        <span className='text-green-dark font-bold'>{correct}</span>
      </div>
      <div className='text-center pt-4 text-2xl font-bold text-primary'>{accuracy}%</div>
    </div>
  )
}
