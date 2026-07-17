'use client'

import { AlertTriangle, CheckCircle, ClipboardList } from 'lucide-react'
import { useEffect } from 'react'
import { StepHeader } from '@/components/common/StepHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PartGroup } from '@/features/session-builder/components/scope'
import { PART_GROUPS, PART_LABELS } from '@/features/session-builder/constants'
import type { ScopeConfig } from '@/features/session-builder/types'
import type { SessionQuestion } from '@/features/temp-session/types'
import { useStep1Scope } from '@/features/session-builder/hooks/useStep1Scope'
import { cn } from '@/lib/utils'

interface Step1ScopeProps {
  scope: ScopeConfig
  onScopeChange: (scope: ScopeConfig) => void
  questions?: SessionQuestion[]
}

export function Step1Scope({ scope, onScopeChange, questions = [] }: Step1ScopeProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const {
    pendingPart,
    setPendingPart,
    pendingPartQuestionCount,
    hasSelected,
    handleToggle,
    handleConfirmRemove,
  } = useStep1Scope(scope, questions, onScopeChange)

  return (
    <div className='max-w-3xl mx-auto space-y-8'>
      <StepHeader
        title='Select Parts'
        description='Choose which TOEIC parts you want to practice in this session'
        icon={<ClipboardList className='w-6 h-6' />}
      />

      <div className='grid md:grid-cols-2 gap-8 items-start'>
        <PartGroup
          title='Listening'
          parts={PART_GROUPS.listening}
          selectedParts={[]}
          onToggle={() => { }}
          disabled
        />

        <PartGroup
          title='Reading'
          parts={PART_GROUPS.reading}
          selectedParts={scope.parts}
          onToggle={handleToggle}
        />
      </div>

      <div className='border-t border-border/50'>
        <div
          className={`flex items-center justify-center gap-2 text-xs font-medium transition-all duration-200 ${hasSelected ? 'text-green-teal' : 'text-destructive animate-pulse'
            }`}
        >
          {hasSelected ? (
            <>
              <CheckCircle className='w-4 h-4' />
              <span>{scope.parts.length} part(s) selected</span>
            </>
          ) : (
            <>
              <AlertTriangle className='w-4 h-4' />
              <span>Please select at least one part to continue</span>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={pendingPart !== null}
        onOpenChange={(open) => {
          if (!open) setPendingPart(null)
        }}
        title={`Xác nhận bỏ chọn Part ${pendingPart}`}

        className={cn(
          "fixed z-50",
          "w-[90vw] sm:w-full sm:max-w-md", // Đảm bảo responsive không bị tràn viền trên mobile
          "relative overflow-hidden rounded-3xl p-6 md:p-7 border border-red-500/15 dark:border-red-500/10",
          "bg-white dark:bg-neutral-95 shadow-[0_20px_50px_rgba(239,68,68,0.08)] dark:shadow-black/40",
          "before:absolute before:top-0 before:right-0 before:w-32 before:h-32",
          "before:bg-linear-to-br before:from-red-500/10 before:to-transparent before:blur-2xl before:pointer-events-none"
        )}

        headerClassName="space-y-3 relative z-10"
        titleClassName="text-base md:text-lg font-black text-foreground tracking-tight"

        description={
          `Part ${pendingPart} (${PART_LABELS[pendingPart ?? 0] ?? ''}) đang có ${pendingPartQuestionCount} câu hỏi đã import. Bạn có chắc chắn muốn bỏ chọn part này không? Các câu hỏi của part này sẽ bị xóa.`
        }
        descriptionClassName="text-xs md:text-sm text-subtext-90/90 dark:text-neutral-30 leading-relaxed font-medium"

        footerClassName="flex items-center gap-3 mt-5 pt-1 relative z-10"

        cancelLabel="Giữ lại"
        cancelClassName={cn(
          "rounded-2xl font-bold text-xs md:text-sm h-10.5 px-5 transition-all duration-300",
          "border-neutral-20/60 dark:border-neutral-80/30 text-foreground bg-white dark:bg-transparent",
          "hover:bg-neutral-5 dark:hover:bg-neutral-90/40 hover:border-neutral-30 active:scale-[0.98]"
        )}

        confirmLabel="Xóa & Tiếp tục"
        confirmClassName={cn(
          "rounded-2xl font-bold text-xs md:text-sm h-10.5 px-5 text-white transition-all duration-300 active:scale-[0.98]",
          "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
          "shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/25"
        )}

        variant="destructive"
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
