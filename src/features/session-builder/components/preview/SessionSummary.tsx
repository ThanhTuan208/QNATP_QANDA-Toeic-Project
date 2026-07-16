'use client'

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

  return (
    <div className='bg-card border border-green-teal-10/40 dark:border-neutral-80/10 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm shadow-green-teal-5/5'>

      {/* 1. TOP HEADER: Thông tin Preset cốt lõi */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='p-2 rounded-xl bg-green-teal-10/40 dark:bg-neutral-80/10 text-green-teal dark:text-pale-teal shrink-0'>
            {PresetIcon && <PresetIcon className='size-4.5' />}
          </div>
          <div className='min-w-0 flex flex-col'>
            <span className='text-[10px] uppercase font-bold tracking-wider text-subtext-50 dark:text-neutral-45 mb-0.5'>
              Cấu hình đang chọn
            </span>
            <span className='text-sm md:text-base font-extrabold text-foreground truncate'>
              {presetInfo?.label ?? preset}
            </span>
          </div>
        </div>

        <span className={`text-[9px] md:text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-lg border shrink-0 ${source === 'system'
          ? 'bg-green-teal-10/50 text-green-teal border-green-teal-15 dark:bg-green-teal-20/10'
          : 'bg-neutral-5 dark:bg-neutral-90/20 text-subtext-50 dark:text-neutral-40 border-transparent'
          }`}>
          {source === 'system' ? 'Ngân hàng hệ thống' : 'Tự luyện tập'}
        </span>
      </div>

      {/* Đường cắt ngang tinh tế */}
      <div className='h-px bg-green-teal-10/20 dark:bg-neutral-80/10' />

      {/* 2. DETAILED BREAKDOWN: Tách biệt rạch ròi Parts & Levels theo hàng dọc dọc */}
      <div className='space-y-4'>
        {/* Hàng hiển thị Levels */}
        <div className='flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-subtext-50 dark:text-neutral-45 sm:w-16 sm:pt-1'>
            Độ khó:
          </span>
          <div className='flex flex-wrap gap-1.5 flex-1'>
            {DIFFICULTY_ORDER.filter((d) => stats.byDifficulty[d]).length === 0 ? (
              <span className='text-xs text-subtext-90/60 dark:text-neutral-40 italic'>Trống</span>
            ) : (
              DIFFICULTY_ORDER.filter((d) => stats.byDifficulty[d]).map((d) => (
                <span
                  key={d}
                  className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold text-green-teal dark:text-pale-teal bg-green-teal-10 dark:bg-green-teal-20/10 border border-green-teal-10/20'
                >
                  {DIFFICULTY_LABELS[d] ?? d}
                  <span className='text-[10px] opacity-60 font-medium'>({stats.byDifficulty[d]})</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Hàng hiển thị Parts */}
        <div className='flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-4'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-subtext-50 dark:text-neutral-45 sm:w-20 sm:pt-1'>
            Phần luyện:
          </span>
          <div className='flex flex-wrap gap-1.5 flex-1'>
            {PART_ORDER.filter((p) => stats.byPart[p]).length === 0 ? (
              <span className='text-xs text-subtext-90/60 dark:text-neutral-40 italic'>Chưa chọn phần nào</span>
            ) : (
              PART_ORDER.filter((p) => stats.byPart[p]).map((p) => (
                <span
                  key={p}
                  className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold text-primary-teal dark:text-pale-light bg-pale-teal-10/40 dark:bg-pale-teal-20/10 border border-pale-teal-20/10'
                >
                  {PART_LABELS[p] ?? `Part ${p}`}
                  <span className='text-[10px] opacity-60 font-medium'>({stats.byPart[p]})</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. GRID STATS FOOTER: Khối tổng quan dữ liệu dạng lưới lớn, thoáng đãng */}
      <div className='grid grid-cols-2 gap-4 pt-2'>
        {/* Ô Tổng câu hỏi */}
        <div className='bg-green-bright/5 dark:bg-neutral-90/10 border border-green-teal-10/20 p-3.5 rounded-2xl flex flex-col justify-between min-h-[76px]'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-subtext-50 dark:text-neutral-45'>
            Tổng số câu hỏi
          </span>
          <span className='text-lg md:text-xl font-black text-primary-teal dark:text-pale-teal leading-none mt-2'>
            {total} <span className='text-xs font-bold text-subtext-90 dark:text-neutral-30 opacity-70'>câu</span>
          </span>
        </div>

        {/* Ô Ước tính thời gian */}
        <div className='bg-green-bright/5 dark:bg-neutral-90/10 border border-green-teal-10/20 p-3.5 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[76px]'>
          <div className='flex items-start justify-between gap-2 w-full'>
            <span className='text-[10px] font-bold uppercase tracking-wider text-subtext-50 dark:text-neutral-45'>
              Thời gian dự tính
            </span>

            {/* Nhãn cảnh báo Time Limit (Gọn gàng đặt góc phải) */}
            {timeLimit != null && (
              <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${timeLimit < estimated
                ? 'text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 border-amber-200/20 animate-pulse'
                : 'text-success dark:text-success/80 bg-success-soft/20 border-success/15'
                }`}>
                {timeLimit < estimated ? '🔥 Quá giờ' : '👍 An toàn'}
              </span>
            )}
          </div>

          <span className='text-lg md:text-xl font-black text-primary-teal dark:text-pale-teal leading-none mt-2'>
            ~{estimated} <span className='text-xs font-bold text-subtext-90 dark:text-neutral-30 opacity-70'>phút</span>
          </span>
        </div>
      </div>

    </div>
  )
}