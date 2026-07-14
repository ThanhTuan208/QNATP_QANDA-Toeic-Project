'use client'

import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { SessionQuestion } from '@/features/temp-session/types'

interface QuestionItemProps {
  question: SessionQuestion
  index: number
}

export function QuestionItem({ question, index }: QuestionItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className='border border-border rounded-xl overflow-hidden'>
      <button
        type='button'
        onClick={() => setExpanded((p) => !p)}
        className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors'
      >
        {expanded ? (
          <ChevronDown className='size-4 shrink-0 text-muted-foreground' />
        ) : (
          <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
        )}
        <span className='text-sm font-medium text-foreground'>Question {index + 1}</span>
        <span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
          {question.type}
        </span>
        <span className='text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
          Part {question.part}
        </span>
      </button>
      {expanded && (
        <div className='px-4 pb-4 space-y-3 border-t border-border pt-3'>
          <p className='text-sm text-foreground'>{question.questionText}</p>
          <div className='space-y-1.5'>
            {question.options.map((opt) => {
              const isCorrect = opt.id === question.correctOptionId
              return (
                <div
                  key={opt.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isCorrect
                      ? 'bg-success-soft text-success border border-success/30'
                      : 'bg-muted/30 text-muted-foreground border border-border'
                  }`}
                >
                  {isCorrect && <CheckCircle2 className='size-4 shrink-0' />}
                  <span className={isCorrect ? 'font-medium' : ''}>
                    {opt.id}. {opt.text}
                  </span>
                </div>
              )
            })}
          </div>
          {question.rationale && (
            <div className='bg-steel-blue-5 border border-steel-blue/20 rounded-lg p-3 text-xs text-steel-blue'>
              {question.rationale}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
