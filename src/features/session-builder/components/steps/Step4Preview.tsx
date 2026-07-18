'use client'

import { Eye, List, ListChecks, Shuffle, Trash2 } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'
import { Label } from '@/components/common/Label'
import { StepHeader } from '@/components/common/StepHeader'
import { Switch } from '@/components/common/Switch/Switch'
import {
  LoadingState,
  QuestionItem,
  SessionSummary,
  TimeLimitSelect,
} from '@/features/session-builder/components/preview'
import { useStep4Preview } from '@/features/session-builder/hooks'
import type { Step4PreviewProps } from '@/features/session-builder/types'

export function Step4Preview({
  preset,
  config,
  source,
  questions,
  onBack,
  onConfigChange,
  onQuestionsChange,
  isGenerating = false,
  generationError = '',
  practiceMode = 'quiz',
  onPracticeModeChange,
}: Step4PreviewProps) {
  const {
    showAnswers,
    setShowAnswers,
    showCorrect,
    setShowCorrect,
    localQuestions,
    shuffled,
    shuffle,
    resetOrder,
    removeQuestion,
    restoreAll,
  } = useStep4Preview(questions, onQuestionsChange)
  const total = localQuestions.length

  if (isGenerating || generationError) {
    return (
      <LoadingState isGenerating={isGenerating} generationError={generationError} onBack={onBack} />
    )
  }

  if (localQuestions.length === 0) {
    return (
      <div className='space-y-6'>
        <StepHeader
          title='Preview'
          description='Review your practice session before starting'
          icon={<Eye className='w-6 h-6 text-green-teal dark:text-pale-teal' />}
        />
        <SessionSummary
          preset={preset}
          source={source}
          total={total}
          questions={localQuestions}
          timeLimit={config.timeLimit}
        />
        <div className='flex flex-col items-center justify-center py-16 text-center space-y-4'>
          <Trash2 className='size-12 text-muted-foreground/40' />
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-foreground'>No questions remaining</p>
            <p className='text-xs text-muted-foreground'>
              You have removed all questions. Click below to restore them or go back.
            </p>
          </div>
          <div className='flex gap-3'>
            <Button buttonType='outline' onClick={restoreAll}>
              Restore all questions
            </Button>
            <Button buttonType='outline' onClick={onBack}>
              Back to source
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <StepHeader
        title='Preview'
        description='Review your practice session before starting'
        icon={<Eye className='w-6 h-6 text-green-teal dark:text-pale-teal' />}
      />

      <SessionSummary
        preset={preset}
        source={source}
        total={total}
        questions={localQuestions}
        timeLimit={config.timeLimit}
      />

      <div className='space-y-3'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <h4 className='text-sm font-bold text-primary-teal dark:text-pale-light'>
            Questions ({localQuestions.length})
          </h4>
          <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 bg-green-bright/20 dark:bg-neutral-90/40 px-2 sm:px-3 py-1.5 rounded-xl border border-green-teal-10/50 dark:border-neutral-80/10'>
            <button
              type='button'
              onClick={shuffle}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                shuffled
                  ? 'bg-green-teal text-white shadow-xs'
                  : 'text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-10 dark:hover:bg-neutral-80/20'
              }`}
            >
              <Shuffle className='size-3 sm:size-3.5' />
              Shuffle
            </button>
            <button
              type='button'
              onClick={resetOrder}
              className='flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-10 dark:hover:bg-neutral-80/20 transition-all'
            >
              Reset
            </button>
            <div className='h-3 w-px bg-green-teal-10 dark:bg-neutral-80/10' />
            <Label className='flex items-center gap-1.5 text-[10px] sm:text-xs text-subtext-90 dark:text-neutral-30 cursor-pointer select-none'>
              <Switch
                checked={showAnswers}
                onCheckedChange={setShowAnswers}
                className='data-[state=checked]:bg-green-teal scale-75 sm:scale-100 origin-left'
              />
              <span className='hidden sm:inline'>Show Answers</span>
              <span className='sm:hidden'>Answers</span>
            </Label>
            <div className='h-3 w-px bg-green-teal-10 dark:bg-neutral-80/10' />
            <Label className='flex items-center gap-1.5 text-[10px] sm:text-xs text-subtext-90 dark:text-neutral-30 cursor-pointer select-none'>
              <Switch
                checked={showCorrect}
                onCheckedChange={setShowCorrect}
                className='data-[state=checked]:bg-green-teal scale-75 sm:scale-100 origin-left'
              />
              <span className='hidden sm:inline'>Show Correct</span>
              <span className='sm:hidden'>Correct</span>
            </Label>
            <div className='h-3 w-px bg-green-teal-10 dark:bg-neutral-80/10' />
            <TimeLimitSelect config={config} onConfigChange={onConfigChange} />
            <div className='h-3 w-px bg-green-teal-10 dark:bg-neutral-80/10' />
            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={() => onPracticeModeChange?.('quiz')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                  practiceMode === 'quiz'
                    ? 'bg-green-teal text-white shadow-xs'
                    : 'text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-10 dark:hover:bg-neutral-80/20'
                }`}
              >
                <ListChecks className='size-3 sm:size-3.5' />
                <span className='hidden sm:inline'>Quiz</span>
              </button>
              <button
                type='button'
                onClick={() => onPracticeModeChange?.('list')}
                className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                  practiceMode === 'list'
                    ? 'bg-green-teal text-white shadow-xs'
                    : 'text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-10 dark:hover:bg-neutral-80/20'
                }`}
              >
                <List className='size-3 sm:size-3.5' />
                <span className='hidden sm:inline'>List</span>
              </button>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          {localQuestions.map((q, i) => (
            <QuestionItem
              key={q.tempId}
              question={q}
              index={i}
              showAnswers={showAnswers}
              showCorrect={showCorrect}
              onRemove={removeQuestion}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
