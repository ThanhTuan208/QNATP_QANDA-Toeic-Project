'use client'

import { Eye, EyeOff, LayoutPanelTop, ScrollText } from 'lucide-react'
import { usePracticeOptions } from '@/contexts/PracticeOptionsContext'
import { cn } from '@/lib/utils'

export function PracticeToolbar() {
  const {
    showExplanations,
    setShowExplanations,
    passageViewMode,
    setPassageViewMode,
    hasMultiplePassages,
  } = usePracticeOptions()

  return (
    <div className='flex items-center gap-2 flex-wrap'>
      <button
        type='button'
        onClick={() => setShowExplanations(!showExplanations)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
          showExplanations
            ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
            : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80',
        )}
      >
        {showExplanations ? <Eye className='size-3.5' /> : <EyeOff className='size-3.5' />}
        {showExplanations ? 'Giải thích' : 'Ẩn giải thích'}
      </button>

      {hasMultiplePassages && (
        <button
          type='button'
          onClick={() => setPassageViewMode(passageViewMode === 'single' ? 'all' : 'single')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
            passageViewMode === 'all'
              ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
              : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80',
          )}
        >
          {passageViewMode === 'all' ? (
            <LayoutPanelTop className='size-3.5' />
          ) : (
            <ScrollText className='size-3.5' />
          )}
          {passageViewMode === 'all' ? 'Tất cả passage' : 'Từng passage'}
        </button>
      )}
    </div>
  )
}
