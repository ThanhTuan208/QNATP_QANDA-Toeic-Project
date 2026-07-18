'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import type { OptionStatus } from '@/features/quiz/types'
import { cn } from '@/lib/utils'

interface OptionButtonProps {
  text: string
  label: string
  status: OptionStatus
  rationale?: string
  onSelect: () => void
}

export const STATUS_STYLES: Record<OptionStatus, string> = {
  idle: 'border-border bg-card hover:border-green-teal hover:bg-green-teal-5',
  selected: 'border-green-teal bg-green-teal-5',
  correct: 'border-green-teal bg-green-teal-5',
  wrong: 'border-error bg-error-soft/15',
  disabled: 'border-input bg-muted opacity-60 cursor-not-allowed',
}

export function OptionButton({ text, label, status, rationale, onSelect }: OptionButtonProps) {
  const isRevealed = status === 'correct' || status === 'wrong' || status === 'disabled'

  return (
    <button
      type='button'
      onClick={status === 'disabled' ? undefined : onSelect}
      disabled={status === 'disabled'}
      className={cn(
        'group relative flex w-full flex-col items-start gap-1 sm:gap-1.5 rounded-xl border-2 p-3 sm:p-4 text-left transition-all duration-200',
        STATUS_STYLES[status],
      )}
    >
      <div className='flex w-full items-start gap-2 sm:gap-3'>
        <span
          className={cn(
            // Base layout & Typography: Thêm border ẩn và bóng đổ nhẹ tạo độ nổi khối
            'flex h-7 sm:h-8 w-7 sm:w-8 shrink-0 items-center justify-center rounded-lg text-xs sm:text-sm font-bold border transition-all duration-200 shadow-sm',

            // 1. Trạng thái IDLE (Chờ chọn)
            // Nền gradient xám nhẹ sang trắng thanh lịch, hover lên sẽ chuyển sang gradient xanh lục
            status === 'idle' && [
              'bg-gradient-to-b from-neutral-0 to-neutral-5 dark:from-neutral-80 dark:to-neutral-90 border-neutral-2 dark:border-border text-muted-foreground',
              'group-hover:scale-105 group-hover:border-green-teal/30 group-hover:bg-gradient-green group-hover:text-white dark:group-hover:text-neutral-90'
            ],

            // 2. Trạng thái SELECTED (Đã chọn - Chưa check kết quả)
            // Sử dụng gradient thương hiệu đầy năng lượng từ mã màu gốc
            status === 'selected' &&
            'bg-gradient-green border-primary text-white dark:text-neutral-90 font-extrabold scale-105 shadow-md shadow-green-teal/20',

            // 3. Trạng thái CORRECT (Đáp án chính xác)
            // Gradient từ xanh lục Teal sang Mint ngả sáng, đem lại cảm giác tươi mát, thành công
            status === 'correct' &&
            'bg-gradient-to-br from-green-teal to-pale-light border-success text-white dark:text-neutral-90 font-extrabold scale-105 shadow-md shadow-success/30',

            // 4. Trạng thái WRONG (Đáp án chọn sai)
            // Gradient từ đỏ thẫm sang cam đỏ cá tính, không bị quá chói mắt nhưng vẫn rõ ràng
            status === 'wrong' &&
            'bg-gradient-to-br from-error-hover to-error-default border-error text-white font-extrabold scale-105 shadow-md shadow-error/30',

            // 5. Trạng thái DISABLED (Bị khóa khi đã nộp bài)
            status === 'disabled' &&
            'bg-neutral-5 dark:bg-muted/40 border-neutral-2/30 dark:border-border/30 text-neutral-40/50 cursor-not-allowed shadow-none'
          )}
        >
          {label}
        </span>

        <span
          className={cn(
            'flex-1 pt-1 sm:pt-1.5 text-xs sm:text-sm font-bold leading-4 sm:leading-5',
            status === 'correct' && 'text-green-dark',
            status === 'wrong' && 'text-error',
            status === 'disabled' && 'text-neutral-40',
          )}
        >
          {text}
        </span>

        {status === 'correct' && (
          <CheckCircle2 className='shrink-0 h-4 sm:h-5 w-4 sm:w-5 text-green-teal' />
        )}
        {status === 'wrong' && <XCircle className='shrink-0 h-4 sm:h-5 w-4 sm:w-5 text-error' />}
      </div>

      {isRevealed && rationale && (
        <div
          className={cn(
            'ml-9 sm:ml-11 text-[11px] sm:text-xs leading-relaxed border-l-2 pl-2.5 sm:pl-3',
            status === 'correct' && 'border-green-teal text-green-teal',
            status === 'wrong' && 'border-error text-error',
            status === 'disabled' && 'border-neutral-30 text-neutral-40',
          )}
        >
          {rationale}
        </div>
      )}
    </button>
  )
}
