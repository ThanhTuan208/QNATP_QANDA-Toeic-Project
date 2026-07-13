'use client'

import { CheckCircle2, ChevronDown, ChevronRight, Play } from 'lucide-react'
import { useState } from 'react'
import { DIFFICULTY_LABELS } from '@/features/session-builder/constants/difficulty'
import { PART_LABELS } from '@/features/session-builder/constants/knowledge-groups'
import { PRESETS } from '@/features/session-builder/constants/presets-data'
import type { PresetType } from '@/features/session-builder/types'
import type { SessionConfig, SessionQuestion } from '@/features/temp-session/types'

interface Step4PreviewProps {
  preset: PresetType
  config: Partial<SessionConfig>
  source: 'system' | 'imported'
  questions: SessionQuestion[]
  onBack: () => void
  onStart: () => void
}

function QuestionItem({ question, index }: { question: SessionQuestion; index: number }) {
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

export function Step4Preview({
  preset,
  config,
  source,
  questions,
  onBack,
  onStart,
}: Step4PreviewProps) {
  const presetInfo = PRESETS.find((p) => p.id === preset)
  const PresetIcon = presetInfo?.icon
  const total = config.totalQuestions ?? questions.length

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-bold text-foreground mb-1'>Preview</h3>
        <p className='text-sm text-muted-foreground'>
          Review your practice session before starting
        </p>
      </div>

      <div className='bg-card border border-border rounded-xl p-4 space-y-2'>
        <div className='flex items-center gap-2'>
          {PresetIcon && <PresetIcon className='size-4 text-muted-foreground' />}
          <span className='text-sm font-semibold text-foreground'>
            {presetInfo?.label ?? preset}
          </span>
          <span className='ml-auto text-xs text-muted-foreground'>
            {source === 'system' ? 'System Bank' : 'Practice Now'}
          </span>
        </div>
        <div className='grid grid-cols-2 gap-2 text-xs text-muted-foreground'>
          <span>
            Parts:{' '}
            {config.parts
              ?.sort()
              .map((p) => PART_LABELS[p]?.replace('Part ', '') ?? p)
              .join(', ')}
          </span>
          <span>
            Difficulty:{' '}
            {Array.isArray(config.difficulty)
              ? config.difficulty.map((d) => DIFFICULTY_LABELS[d] ?? d).join(', ')
              : (DIFFICULTY_LABELS[config.difficulty ?? 'medium'] ?? 'Medium')}
          </span>
          <span>Total: {total} questions</span>
          <span>Est. time: ~{Math.ceil(total * 1.5)} min</span>
        </div>
      </div>

      <div className='space-y-2'>
        <h4 className='text-sm font-semibold text-foreground'>Questions ({questions.length})</h4>
        {questions.map((q, i) => (
          <QuestionItem key={q.tempId} question={q} index={i} />
        ))}
      </div>

      <div className='flex gap-3'>
        <button
          type='button'
          onClick={onBack}
          className='bg-muted text-muted-foreground px-6 py-3 rounded-xl font-bold hover:bg-neutral-5 transition-all'
        >
          Back
        </button>
        <button
          type='button'
          onClick={onStart}
          disabled={questions.length === 0}
          className='flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        >
          <Play className='size-4' />
          Start Practice
        </button>
      </div>
    </div>
  )
}
