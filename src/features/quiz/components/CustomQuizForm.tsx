'use client'

import { useState } from 'react'
import { TYPE_LABEL_MAP_VIETNAM } from '@/constants/index.constants'
import { fetchQuestions } from '@/features/quiz/client/quiz.client'
import { QuizEngine } from '@/features/quiz/components/QuizEngine'
import { VALID_QUIZ_TYPES } from '@/features/quiz/constants'
import type { Question } from '@/features/quiz/types'

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30]
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const
const TOPICS = Array.from(VALID_QUIZ_TYPES)

interface CustomConfig {
  limit: number
  types: string[]
  difficulties: string[]
  balance: boolean
}

function TopicCheckbox({
  value,
  checked,
  onChange,
}: {
  value: string
  checked: boolean
  onChange: (v: string, checked: boolean) => void
}) {
  return (
    <label className='flex items-center gap-2 px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-steel-blue has-[:checked]:bg-steel-blue-5'>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className='accent-steel-blue'
      />
      <span className='text-sm text-foreground'>{TYPE_LABEL_MAP_VIETNAM[value] ?? value}</span>
    </label>
  )
}

export function CustomQuizForm() {
  const [config, setConfig] = useState<CustomConfig>({
    limit: 20,
    types: [...TOPICS],
    difficulties: [...DIFFICULTIES],
    balance: true,
  })
  const [sessionKey, setSessionKey] = useState(0)
  const [questions, setQuestions] = useState<Question[] | null>(null)

  if (questions) {
    return (
      <QuizEngine
        key={sessionKey}
        type='custom'
        initialQuestions={questions}
        onStatsUpdate={() => {}}
      />
    )
  }

  const updateTypes = (value: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      types: checked ? [...prev.types, value] : prev.types.filter((t) => t !== value),
    }))
  }

  const updateDifficulties = (value: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      difficulties: checked
        ? [...prev.difficulties, value]
        : prev.difficulties.filter((d) => d !== value),
    }))
  }

  const handleStart = async () => {
    if (config.types.length === 0 || config.difficulties.length === 0) return
    const result = await fetchQuestions({
      types: config.types,
      difficulties: config.difficulties,
      limit: config.limit,
      balance: config.balance,
    })
    if (result.questions.length > 0) {
      setSessionKey((k) => k + 1)
      setQuestions(result.questions)
    }
  }

  const allDiffSelected = config.difficulties.length === DIFFICULTIES.length
  const allTopicsSelected = config.types.length === TOPICS.length

  return (
    <div className='max-w-2xl mx-auto space-y-8 py-8'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-foreground'>Custom Practice</h2>
        <p className='text-muted-foreground'>Tùy chỉnh bài luyện Part 5 theo nhu cầu</p>
      </div>

      <div className='space-y-6 bg-card p-6 rounded-2xl border border-border'>
        <div>
          <span className='block text-sm font-semibold text-foreground mb-3'>Số câu hỏi</span>
          <div className='flex gap-2 flex-wrap'>
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                type='button'
                onClick={() => setConfig((prev) => ({ ...prev, limit: n }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  config.limit === n
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-neutral-5'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm font-semibold text-foreground'>Độ khó</span>
            <button
              type='button'
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  difficulties: allDiffSelected ? [] : [...DIFFICULTIES],
                }))
              }
              className='text-xs text-steel-blue hover:underline'
            >
              {allDiffSelected ? 'Bỏ chọn' : 'Chọn tất cả'}
            </button>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {DIFFICULTIES.map((d) => (
              <label
                key={d}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-colors text-sm font-medium ${
                  config.difficulties.includes(d)
                    ? 'border-steel-blue bg-steel-blue-5 text-steel-blue'
                    : 'border-border text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <input
                  type='checkbox'
                  checked={config.difficulties.includes(d)}
                  onChange={(e) => updateDifficulties(d, e.target.checked)}
                  className='sr-only'
                />
                {d === 'EASY' ? 'Dễ' : d === 'MEDIUM' ? 'Trung bình' : 'Khó'}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm font-semibold text-foreground'>Chủ điểm</span>
            <button
              type='button'
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  types: allTopicsSelected ? [] : [...TOPICS],
                }))
              }
              className='text-xs text-steel-blue hover:underline'
            >
              {allTopicsSelected ? 'Bỏ chọn' : 'Chọn tất cả'}
            </button>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
            {TOPICS.map((t) => (
              <TopicCheckbox
                key={t}
                value={t}
                checked={config.types.includes(t)}
                onChange={updateTypes}
              />
            ))}
          </div>
        </div>

        <div>
          <span className='block text-sm font-semibold text-foreground mb-3'>Chế độ phân bổ</span>
          <div className='flex gap-2'>
            {[
              { value: true, label: 'Cân bằng', desc: 'Chia đều số câu cho mỗi chủ điểm' },
              { value: false, label: 'Ngẫu nhiên', desc: 'Random hoàn toàn, không đảm bảo đều' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type='button'
                onClick={() => setConfig((prev) => ({ ...prev, balance: opt.value }))}
                className={`flex-1 px-4 py-3 rounded-xl border text-left transition-colors ${
                  config.balance === opt.value
                    ? 'border-steel-blue bg-steel-blue-5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <span className='block text-sm font-medium text-foreground'>{opt.label}</span>
                <span className='block text-xs text-muted-foreground mt-0.5'>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type='button'
          onClick={handleStart}
          disabled={config.types.length === 0 || config.difficulties.length === 0}
          className='w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Bắt đầu {config.limit} câu
        </button>
      </div>
    </div>
  )
}
