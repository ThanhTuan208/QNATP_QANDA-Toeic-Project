'use client'

import { Star } from 'lucide-react'
import { useSaveQuestion } from '@/features/quiz/hooks/useSaveQuestion'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  questionId: string
}

export function SaveButton({ questionId }: SaveButtonProps) {
  const { isSaved, toggle, loading } = useSaveQuestion(questionId)

  return (
    <button
      type='button'
      onClick={toggle}
      disabled={loading}
      className={cn(
        'flex items-center gap-1.5 text-xs transition-colors',
        isSaved
          ? 'text-amber-500 hover:text-amber-600'
          : 'text-muted-foreground hover:text-amber-400',
      )}
    >
      <Star className={cn('w-4 h-4', isSaved && 'fill-amber-500')} />
      {isSaved ? 'Đã lưu' : 'Lưu'}
    </button>
  )
}
