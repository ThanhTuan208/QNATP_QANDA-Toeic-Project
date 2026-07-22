'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { usePracticeOptions } from '@/contexts/PracticeOptionsContext'
import { FlagButton } from '@/features/quiz/components/FlagButton'
import { OptionButton } from '@/features/quiz/components/OptionButton'
import { PassageRenderer } from '@/features/quiz/components/PassageRenderer'
import { RationalePanel } from '@/features/quiz/components/RationalePanel'
import { OPTION_LABELS } from '@/features/quiz/constants'
import { usePart7Passage } from '@/features/quiz/hooks/usePart7Passage'
import { useViewingOption } from '@/features/quiz/hooks/useViewingOption'
import type { OptionStatus } from '@/features/quiz/types'
import type { QuestionCardProps } from '@/features/quiz/types/question-card'
import { getOptionStatus } from '@/features/quiz/utils/question.utils'
import { cn } from '@/lib/utils'

export function Part7QuestionCard({
  question,
  selectedOptionId,
  correctOptionId,
  onSelect,
  disabled,
  headerLeft,
  headerRight,
  showFlag,
  isFlagged,
  onToggleFlag,
}: QuestionCardProps) {
  const { viewingOptionId, viewingOption, handleOptionClick } = useViewingOption({
    correctOptionId,
    disabled,
    onSelect,
    options: question.options,
  })

  const {
    allPassages,
    activePassageIdx,
    activePassage,
    passageContent,
    passageBlocks,
    passageFormat,
    setActivePassageIdx,
  } = usePart7Passage({
    passage: question.passage,
    passages: question.passages,
    passageId: question.passageId,
  })

  const { passageViewMode } = usePracticeOptions()

  const [mobileView, setMobileView] = useState<'passage' | 'question'>('passage')

  const passagePanel = (
    <div className='rounded-lg bg-card px-4 md:px-5 md:overflow-y-auto md:max-h-[75vh] md:sticky md:top-4'>
      <motion.div
        key={passageViewMode === 'all' ? 'all' : (activePassage?.id ?? 'single')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        {passageViewMode === 'all' && allPassages.length > 1 ? (
          allPassages.map((p, i) => (
            <div key={p.id ?? i} className={i > 0 ? 'mt-4 pt-4 border-t border-border' : ''}>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>
                {p.title ?? `Passage ${i + 1}`}
              </p>
              <PassageRenderer
                blocks={p.contentBlocks}
                content={p.content}
                passageFormat={p.passageFormat}
                title={undefined}
              />
            </div>
          ))
        ) : (
          <>
            {allPassages.length > 1 && <div className='flex gap-1.5 mb-3 flex-wrap'></div>}
            {activePassage?.title && allPassages.length <= 1 && (
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>
                {activePassage.title}
              </p>
            )}
            <PassageRenderer
              blocks={passageBlocks}
              content={passageContent}
              passageFormat={passageFormat}
              title={activePassage?.title}
            />
          </>
        )}
      </motion.div>
    </div>
  )

  const questionPanel = (
    <div className='space-y-4'>
      <p className='font-semibold text-base sm:text-lg leading-relaxed'>{question.questionText}</p>

      <div className='space-y-2 sm:space-y-3'>
        {question.options.map((opt, idx) => {
          const status: OptionStatus = getOptionStatus(
            opt.id,
            selectedOptionId,
            correctOptionId,
            viewingOptionId,
          )
          return (
            <OptionButton
              key={opt.id}
              text={opt.text}
              label={OPTION_LABELS[idx] ?? String(idx)}
              status={status}
              onSelect={() => handleOptionClick(opt.id)}
            />
          )
        })}
      </div>
    </div>
  )

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap'>
          {headerLeft}
          <span className='inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground shrink-0'>
            {question.type}
          </span>
          <span className='inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground shrink-0'>
            {allPassages.length > 1 ? `${allPassages.length} passages` : '1 passage'}
          </span>
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          {showFlag && <FlagButton flagged={!!isFlagged} onToggle={onToggleFlag!} />}
          {headerRight}
        </div>
      </div>

      <div className='md:hidden flex rounded-lg border overflow-hidden'>
        <button
          type='button'
          onClick={() => setMobileView('passage')}
          className={cn(
            'flex-1 py-2 text-xs font-medium text-center transition-colors',
            mobileView === 'passage'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:bg-muted/50',
          )}
        >
          Passage
        </button>
        <button
          type='button'
          onClick={() => setMobileView('question')}
          className={cn(
            'flex-1 py-2 text-xs font-medium text-center transition-colors',
            mobileView === 'question'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground hover:bg-muted/50',
          )}
        >
          Question
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        <div className={mobileView === 'passage' ? 'block' : 'hidden md:block'}>{passagePanel}</div>
        <div className={mobileView === 'question' ? 'block' : 'hidden md:block'}>
          {questionPanel}
        </div>
      </div>

      <RationalePanel
        setHeight='part_7'
        viewingOption={viewingOption}
        selectedOptionId={selectedOptionId}
        correctOptionId={correctOptionId}
      />
    </div>
  )
}
