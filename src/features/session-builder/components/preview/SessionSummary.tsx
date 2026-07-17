'use client'

import { Clock, HelpCircle, Layers, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { DIFFICULTY_LABELS, PART_LABELS } from '@/features/session-builder/constants'
import { PRESETS } from '@/features/session-builder/constants/presets-data'
import { DIFFICULTY_ORDER, PART_ORDER } from '@/features/session-builder/constants/preview'
import type { PresetType } from '@/features/session-builder/types'
import { estimateTime } from '@/features/session-builder/utils/estimate-time'
import { computeQuestionStats } from '@/features/session-builder/utils/question-stats'
import type { SessionQuestion } from '@/features/temp-session/types'

interface SessionSummaryProps {
  preset: PresetType
  source: 'system' | 'imported'
  total: number
  questions: SessionQuestion[]
  timeLimit?: number
}

export function SessionSummary({
  preset,
  source,
  total,
  questions,
  timeLimit,
}: SessionSummaryProps) {
  const presetInfo = PRESETS.find((p) => p.id === preset)
  const PresetIcon = presetInfo?.icon
  const stats = useMemo(() => computeQuestionStats(questions), [questions])
  const estimated = useMemo(() => estimateTime(stats.byPart), [stats])

  const isOverTime = timeLimit != null && timeLimit < estimated

  return (
    <div className='relative overflow-hidden bg-linear-to-r from-steel-blue/15 via-pale-teal/10 to-transparent dark:from-neutral-90 dark:bg-neutral-95 dark:border-neutral-90/40 rounded-3xl p-6 shadow-xl dark:shadow-none space-y-6 transition-all duration-300'>
      <div className='absolute top-0 left-1/4 -translate-x-1/2 w-48 h-48 bg-green-teal-5 blur-3xl rounded-full pointer-events-none' />
      <div className='relative flex items-center justify-between gap-4 bg-linear-to-r from-green-teal-5 to-transparent dark:from-green-teal-10 dark:to-transparent p-3.5 rounded-2xl'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='p-2.5 rounded-xl bg-linear-to-br from-green-teal to-green-dark text-white shrink-0 shadow-lg shadow-green-teal/20 dark:shadow-none'>
            {PresetIcon ? <PresetIcon className='size-5' /> : <Sparkles className='size-5' />}
          </div>
          <div className='min-w-0 flex flex-col'>
            <span className='text-[10px] uppercase font-black tracking-wider text-green-teal/80 dark:text-pale-teal/80 mb-0.5'>
              Cấu hình phiên
            </span>
            <span className='text-base font-black text-foreground tracking-tight truncate'>
              {presetInfo?.label ?? preset}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-xl border-2 transition-all shadow-sm ${
            source === 'system'
              ? 'bg-green-teal-10 text-green-teal border-green-teal-20 dark:bg-green-teal-10 dark:text-pale-teal dark:border-green-teal-20'
              : 'bg-green-teal-10 text-green-teal border-green-teal-20 dark:bg-green-teal-10 dark:text-pale-teal dark:border-green-teal-20'
          }`}
        >
          {source === 'system' ? 'Hệ thống' : 'Tự luyện'}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-4 relative z-10'>
        {/* CARD 1: TỔNG SỐ CÂU HỎI (Tone Purple) */}
        <div className='relative overflow-hidden bg-gradient-to-br from-purple-5 to-transparent dark:from-purple-10 dark:to-transparent border-2 border-purple-20 dark:border-purple-20 p-4 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple/10'>
          <div className='flex items-center justify-between text-purple dark:text-purple-80'>
            <span className='text-[10px] font-extrabold uppercase tracking-widest opacity-80'>
              Tổng số câu hỏi
            </span>
            <HelpCircle className='size-4 opacity-75' />
          </div>
          <div className='flex items-baseline gap-1 mt-4'>
            <span className='text-3xl font-black tracking-tight text-purple dark:text-purple-60'>
              {total}
            </span>
            <span className='text-xs font-bold text-purple/60 dark:text-purple-80/60'>câu</span>
          </div>
        </div>

        {/* CARD 2: THỜI LƯỢNG DỰ TÍNH (Safety Orange nếu vượt hạn / Green Teal nếu an toàn) */}
        <div
          className={`relative overflow-hidden border-2 p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
            isOverTime
              ? 'bg-gradient-to-br from-safety-orange-5 to-transparent dark:from-safety-orange-10 dark:to-transparent border-safety-orange-20 dark:border-safety-orange-20 hover:shadow-safety-orange/10'
              : 'bg-gradient-to-br from-green-teal-5 to-transparent dark:from-green-teal-10 dark:to-transparent border-green-teal-20 dark:border-green-teal-20 hover:shadow-green-teal/10'
          }`}
        >
          <div className='flex items-center justify-between w-full'>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-widest ${
                isOverTime
                  ? 'text-safety-orange dark:text-safety-orange-80'
                  : 'text-green-teal dark:text-green-teal-80'
              }`}
            >
              Thời lượng dự tính
            </span>
            <Clock
              className={`size-4 ${
                isOverTime
                  ? 'text-safety-orange dark:text-safety-orange-80'
                  : 'text-green-teal dark:text-green-teal-80'
              }`}
            />
          </div>

          <div className='flex items-baseline justify-between gap-1 mt-4'>
            <div className='flex items-baseline gap-1'>
              <span
                className={`text-3xl font-black tracking-tight ${
                  isOverTime
                    ? 'text-safety-orange dark:text-safety-orange-60'
                    : 'text-green-dark dark:text-green-teal-60'
                }`}
              >
                ~{estimated}
              </span>
              <span
                className={`text-xs font-bold ${
                  isOverTime
                    ? 'text-safety-orange/60 dark:text-safety-orange-80/60'
                    : 'text-green-teal/60 dark:text-green-teal-80/60'
                }`}
              >
                phút
              </span>
            </div>

            {timeLimit != null && (
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border shadow-xs ${
                  isOverTime
                    ? 'text-safety-orange bg-safety-orange-10 border-safety-orange-20 dark:text-safety-orange-80 dark:bg-safety-orange-5 dark:border-safety-orange-10'
                    : 'text-green-teal bg-green-teal-10 border-green-teal-20 dark:text-green-teal-80 dark:bg-green-teal-5 dark:border-green-teal-10'
                }`}
              >
                {isOverTime ? 'Tuyệt vời' : 'Cố lên'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='border-t-2 border-dashed border-neutral-100 dark:border-neutral-90/30' />

      <div className='space-y-4 text-sm relative z-10'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500'>
            <Layers className='size-3.5' />
            <span className='text-[10px] font-black uppercase tracking-widest'>Độ khó phân bổ</span>
          </div>

          <div className='flex flex-wrap gap-2'>
            {DIFFICULTY_ORDER.filter((d) => stats.byDifficulty[d]).length === 0 ? (
              <span className='text-xs text-neutral-400 dark:text-neutral-500 italic pl-1'>
                Mặc định
              </span>
            ) : (
              DIFFICULTY_ORDER.filter((d) => stats.byDifficulty[d]).map((d) => {
                return (
                  <span
                    key={d}
                    className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border
                       text-neutral-100 bg-pale-teal-5 dark:bg-pale-teal-10/30 border-pale-teal-20 dark:border-pale-teal-20'
                  >
                    {DIFFICULTY_LABELS[d] ?? d}
                    <span className='text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-5 text-center shadow-inner text-white bg-pale-teal dark:bg-pale-teal'>
                      {stats.byDifficulty[d]}
                    </span>
                  </span>
                )
              })
            )}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500'>
            <Layers className='size-3.5' />
            <span className='text-[10px] font-black uppercase tracking-widest'>
              Cấu trúc bài luyện
            </span>
          </div>

          <div className='flex flex-wrap gap-2'>
            {PART_ORDER.filter((p) => stats.byPart[p]).length === 0 ? (
              <span className='text-xs text-neutral-400 dark:text-neutral-500 italic pl-1'>
                Chưa chọn phần
              </span>
            ) : (
              PART_ORDER.filter((p) => stats.byPart[p]).map((p) => (
                <span
                  key={p}
                  className='inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-100 dark:text-pale-teal bg-linear-to-r from-steel-blue-5 to-pale-teal-5 dark:from-steel-blue-10 dark:to-pale-teal-10 border border-steel-blue-20 dark:border-pale-teal-20 shadow-sm'
                >
                  {PART_LABELS[p] ?? `Part ${p}`}
                  <span className='text-[10px] font-black text-white bg-pale-teal dark:bg-pale-teal px-1.5 py-0.2 rounded-md min-w-5 text-center shadow-sm'>
                    {stats.byPart[p]}
                  </span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
