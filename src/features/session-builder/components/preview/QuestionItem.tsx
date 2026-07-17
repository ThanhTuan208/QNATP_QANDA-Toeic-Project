'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronDown, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/common/Breadcrumb'
import { DIFFICULTY_LABELS } from '@/features/session-builder/constants/difficulty'
import type { SessionQuestion } from '@/features/temp-session/types'

const DIFFICULTY_STYLE: Record<string, string> = {
  EASY: 'text-green-teal',
  MEDIUM: 'text-steel-blue',
  HARD: 'text-error-active',
}

interface QuestionItemProps {
  question: SessionQuestion
  index: number
  showAnswers?: boolean
  showCorrect?: boolean
  onRemove?: (tempId: string) => void
}

export function QuestionItem({
  question,
  index,
  showAnswers = false,
  showCorrect = false,
  onRemove,
}: QuestionItemProps) {
  const [expanded, setExpanded] = useState(false)
  const isExpanded = expanded || showAnswers

  return (
    <div className='group border border-green-teal-10/50 dark:border-neutral-80/10 rounded-xl overflow-hidden bg-card/60 dark:bg-card/20 transition-all duration-300'>
      <div
        role='button'
        tabIndex={0}
        onClick={() => setExpanded((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setExpanded((p) => !p)
          }
        }}
        className='w-full flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 text-left hover:bg-green-bright/20 dark:hover:bg-neutral-80/10 transition-colors cursor-pointer'
      >
        {isExpanded ? (
          <ChevronDown className='size-4 shrink-0 text-green-teal dark:text-pale-teal' />
        ) : (
          <ChevronRight className='size-4 shrink-0 text-green-teal dark:text-pale-teal' />
        )}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className='text-xs sm:text-sm font-bold text-primary-teal dark:text-pale-light'>
                Question {index + 1}
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-[10px] sm:text-sm font-semibold'>
                Part {question.part}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='hidden sm:inline-flex'>
              <BreadcrumbPage className='text-xs sm:text-sm font-normal text-muted-foreground'>
                {question.type}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden sm:block' />
            <BreadcrumbItem>
              <BreadcrumbPage
                className={`text-[10px] sm:text-sm font-bold ${DIFFICULTY_STYLE[question.difficulty.toUpperCase()] ?? ''}`}
              >
                {DIFFICULTY_LABELS[question.difficulty.toUpperCase()] ?? question.difficulty}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {onRemove && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onRemove(question.tempId)
            }}
            className='ml-auto p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-error hover:bg-error-soft/20'
          >
            <X className='size-3.5' />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 border-t border-green-teal-10/30 dark:border-neutral-80/10 pt-3 bg-neutral-0/30 dark:bg-neutral-90/10'>
              <p className='text-xs sm:text-sm font-medium text-foreground'>{question.questionText}</p>

              <div className='space-y-1.5'>
                {question.options.map((opt) => {
                  const isCorrect = opt.id === question.correctOptionId
                  const showAsCorrect = showCorrect && isCorrect
                  const showExplanation = showCorrect && opt.rationale
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-start gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-300 ${showAsCorrect
                        ? 'bg-success-soft/20 text-success border border-success/30 shadow-xs'
                        : showExplanation
                          ? 'bg-safety-orange-5 text-error border border-safety-orange-20'
                          : 'text-subtext-90 dark:text-neutral-30 border border-green-teal-10/10 bg-neutral-5/40 dark:bg-neutral-90/40'
                        }`}
                    >
                      {showAsCorrect && <CheckCircle2 className='size-3.5 sm:size-4.5 shrink-0 text-success' />}
                      <span className='flex-1 min-w-0'>
                        <span className='font-bold'>
                          {opt.id}. {opt.text}
                        </span>
                        {showExplanation && (
                          <span className={showAsCorrect ? 'text-success' : 'text-error dark:text-error/60'}>
                            {' '}→ {opt.rationale}
                          </span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
