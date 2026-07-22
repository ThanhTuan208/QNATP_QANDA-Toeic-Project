'use client'

import { FlagButton } from '@/features/quiz/components/FlagButton'
import { OptionButton } from '@/features/quiz/components/OptionButton'
import { PassageRenderer } from '@/features/quiz/components/PassageRenderer'
import { RationalePanel } from '@/features/quiz/components/RationalePanel'
import { OPTION_LABELS } from '@/features/quiz/constants'
import { useViewingOption } from '@/features/quiz/hooks/useViewingOption'
import type { OptionStatus } from '@/features/quiz/types'
import type { QuestionCardProps } from '@/features/quiz/types/question-card'
import { getOptionStatus } from '@/features/quiz/utils/question.utils'

export function Part6QuestionCard({
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

  // const blocks = question.passage?.contentBlocks
  // const hasBlocks = blocks && blocks.length > 0

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap'>
            {headerLeft}
            <span className='inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground shrink-0'>
              {question.type}
            </span>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            {showFlag && <FlagButton flagged={!!isFlagged} onToggle={onToggleFlag!} />}
            {headerRight}
          </div>
        </div>

        {question.passage && (
          <div className='rounded-lg border bg-card p-4 sm:p-5'>
            <PassageRenderer
              blocks={question.passage.contentBlocks}
              content={question.passage.contentBlocks ? undefined : question.passage.content}
              passageFormat={question.passage.passageFormat}
              title={question.passage.title}
            />
          </div>
        )}

        <p className='text-sm italic text-muted-foreground border-l-2 border-muted-foreground/20 pl-3'>
          {question.questionText}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-y-2 sm:space-y-3'>
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

        <div className='lg:col-span-1'>
          <RationalePanel
            viewingOption={viewingOption}
            selectedOptionId={selectedOptionId}
            correctOptionId={correctOptionId}
          />
        </div>
      </div>
    </div>
  )
}
