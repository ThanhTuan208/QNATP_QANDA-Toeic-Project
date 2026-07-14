'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { TYPE_LABEL_MAP_VIETNAM } from '@/constants/index.constants'
import { OPTION_LABELS } from '@/features/quiz/constants'
import type { AttemptRecord, Question } from '@/features/quiz/types'

interface ReviewPanelProps {
  questions: Question[]
  attemptHistory: AttemptRecord[]
}

function ReviewItem({
  question,
  record,
  index,
}: {
  question: Question
  record: AttemptRecord
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className='border border-border rounded-xl overflow-hidden'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors'
      >
        <span className='w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-muted'>
          {index + 1}
        </span>
        <span className='inline-block rounded-full bg-steel-blue-10 px-2 py-0.5 text-xs font-medium text-steel-blue shrink-0'>
          {TYPE_LABEL_MAP_VIETNAM[question.type] ?? question.type}
        </span>
        <span className='text-sm font-medium text-foreground truncate flex-1'>
          {question.questionText.length > 60
            ? `${question.questionText.slice(0, 60)}...`
            : question.questionText}
        </span>
        <span
          className={`text-xs font-semibold shrink-0 ${record.isCorrect ? 'text-green-dark' : 'text-error'}`}
        >
          {record.isCorrect ? 'Đúng' : 'Sai'}
        </span>
        {open ? (
          <ChevronUp className='w-4 h-4 shrink-0 text-muted-foreground' />
        ) : (
          <ChevronDown className='w-4 h-4 shrink-0 text-muted-foreground' />
        )}
      </button>

      {open && (
        <div className='px-4 pb-4 space-y-3 border-t border-border'>
          <p className='pt-3 text-sm text-foreground'>{question.questionText}</p>
          <div className='space-y-2'>
            {question.options.map((opt, idx) => {
              const isSelected = opt.id === record.selectedOptionId
              const isCorrectOpt = opt.id === record.correctOptionId
              let className = 'rounded-xl border px-3 py-2 text-sm flex items-center gap-2'
              if (isSelected && isCorrectOpt) {
                className += ' border-green-teal-20 bg-green-teal-5 text-green-dark'
              } else if (isSelected && !isCorrectOpt) {
                className += ' border-error/20 bg-error-soft text-error'
              } else if (isCorrectOpt) {
                className += ' border-green-teal-20 bg-green-teal-5 text-green-dark'
              } else {
                className += ' border-border text-muted-foreground'
              }
              const icon =
                isSelected && isCorrectOpt ? '✓' : isSelected ? '✗' : isCorrectOpt ? '✓' : ''
              return (
                <div key={opt.id} className={className}>
                  <span className='font-semibold w-5 shrink-0'>{OPTION_LABELS[idx]}</span>
                  <span className='flex-1'>{opt.text}</span>
                  {icon && <span className='font-bold'>{icon}</span>}
                </div>
              )
            })}
          </div>
          <div className='rounded-xl bg-muted p-3 text-sm text-muted-foreground'>
            <span className='font-medium text-foreground'>Giải thích: </span>
            {record.rationale}
          </div>
        </div>
      )}
    </div>
  )
}

export function ReviewPanel({ questions, attemptHistory }: ReviewPanelProps) {
  if (attemptHistory.length === 0) return null

  const sorted = attemptHistory
    .map((record) => ({
      record,
      question: questions.find((q) => q.id === record.questionId),
    }))
    .filter(
      (item): item is { record: AttemptRecord; question: Question } => item.question !== undefined,
    )

  if (sorted.length === 0) return null

  return (
    <div className='space-y-3 p-6 bg-card rounded-2xl border border-border'>
      <h3 className='text-sm font-semibold text-foreground'>Xem lại câu trả lời</h3>
      <div className='space-y-2'>
        {sorted.map(({ record, question }, i) => (
          <ReviewItem key={record.questionId} question={question} record={record} index={i} />
        ))}
      </div>
    </div>
  )
}
