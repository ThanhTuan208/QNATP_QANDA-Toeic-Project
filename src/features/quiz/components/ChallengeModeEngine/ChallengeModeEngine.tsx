'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { AnimatedLoader } from '@/components/common/AnimatedLoader'
import { QuestionCard } from '@/features/quiz/components/QuestionCard'
import { ResultBreakdown } from '@/features/quiz/components/ResultBreakdown'
import { ReviewPanel } from '@/features/quiz/components/ReviewPanel'
import { useQuizEngine } from '@/features/quiz/hooks/useQuizEngine'
import { useTimer } from '@/features/quiz/hooks/useTimer'
import type { Question } from '@/features/quiz/types'

const CHALLENGE_TIME = 15 * 60

function estimateToeicScore(correct: number, total: number): number {
  if (total === 0) return 0
  const pct = correct / total
  return Math.round(150 + pct * 345)
}

function getScoreBand(score: number): string {
  if (score >= 400) return 'Xuất sắc'
  if (score >= 350) return 'Tốt'
  if (score >= 300) return 'Khá'
  if (score >= 250) return 'Trung bình'
  return 'Cần cải thiện'
}

interface ChallengeModeEngineProps {
  initialQuestions: Question[]
}

export function ChallengeModeEngine({ initialQuestions }: ChallengeModeEngineProps) {
  const {
    currentQuestion,
    selectedOptionId,
    submitting,
    result,
    currentIdx,
    totalQuestions,
    isLoading,
    isComplete,
    isEmpty,
    typeStats,
    questions,
    attemptHistory,
    handleSelect,
    handleNext,
    reset,
    retryIncorrect,
    incorrectCount,
  } = useQuizEngine({
    type: 'challenge',
    initialQuestions,
  })

  const timer = useTimer({
    totalSeconds: CHALLENGE_TIME,
    onExpire: () => {},
  })

  useEffect(() => {
    if (!isLoading && !isEmpty && !isComplete) {
      timer.start()
    }
  }, [isLoading, isEmpty, isComplete])

  useEffect(() => {
    if (timer.isExpired && !isComplete && !isLoading && !isEmpty) {
      handleNext()
    }
  }, [timer.isExpired])

  useEffect(() => {
    if (result && !isComplete) {
      const timeout = setTimeout(() => {
        handleNext()
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [result, isComplete, handleNext])

  if (isLoading) {
    return <AnimatedLoader fullScreen={false} />
  }

  if (isEmpty) {
    return (
      <div className='py-20 text-center space-y-4'>
        <p className='text-muted-foreground'>Chưa có câu hỏi nào.</p>
      </div>
    )
  }

  if (isComplete || timer.isExpired) {
    const correctCount = Object.values(typeStats).reduce((sum, s) => sum + s.correct, 0)
    const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const estimatedScore = estimateToeicScore(correctCount, totalQuestions)
    const scoreBand = getScoreBand(estimatedScore)

    return (
      <div className='space-y-6 py-10'>
        <div className='text-center space-y-2'>
          <p className='text-lg font-semibold text-foreground'>
            {timer.isExpired ? 'Hết giờ!' : 'Hoàn thành!'}
          </p>
          <p className='text-4xl font-bold text-foreground'>
            {correctCount}
            <span className='text-lg font-normal text-muted-foreground'>/{totalQuestions}</span>
          </p>
          <p className='text-sm text-muted-foreground'>
            {pct >= 80 ? 'Xuất sắc! 🎉' : pct >= 60 ? 'Khá tốt! 👍' : 'Cần cố gắng hơn 💪'}
          </p>
          <div className='mt-4 p-4 bg-card rounded-2xl border border-border inline-block'>
            <p className='text-xs text-muted-foreground uppercase tracking-wide'>TOEIC Reading ước tính</p>
            <p className='text-3xl font-bold text-foreground'>{estimatedScore}</p>
            <p className='text-xs text-muted-foreground'>{scoreBand}</p>
          </div>
        </div>

        <ResultBreakdown typeStats={typeStats} />

        <ReviewPanel questions={questions} attemptHistory={attemptHistory} />

        <div className='flex justify-center gap-3'>
          {incorrectCount > 0 && (
            <button
              type='button'
              onClick={retryIncorrect}
              className='rounded-xl bg-amber-100 px-6 py-3 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-200'
            >
              Làm lại {incorrectCount} câu sai
            </button>
          )}
          <button
            type='button'
            onClick={reset}
            className='rounded-xl bg-neutral-90 px-6 py-3 text-sm font-semibold text-neutral-0 transition-colors hover:bg-neutral-80'
          >
            Làm lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-2xl space-y-6 py-8'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          <span>
            Câu {currentIdx + 1} / {totalQuestions}
          </span>
          {submitting && (
            <span className='ml-3 flex items-center gap-1 text-green-dark'>
              <Loader2 className='h-3 w-3 animate-spin' />
              Đang kiểm tra...
            </span>
          )}
        </div>
      </div>

      {currentQuestion && (
        <div className='space-y-2'>
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedOptionId={selectedOptionId}
            correctOptionId={result?.correctOptionId ?? null}
            onSelect={handleSelect}
          />
        </div>
      )}

      {result && (
        <div className='text-center py-4'>
          <p className='text-sm text-muted-foreground'>
            {result.isCorrect ? 'Đúng!' : 'Sai!'}
          </p>
        </div>
      )}
    </div>
  )
}