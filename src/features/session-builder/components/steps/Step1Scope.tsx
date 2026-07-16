'use client'

import { AlertTriangle, CheckCircle, ClipboardList } from 'lucide-react'
import { useEffect } from 'react'
import { StepHeader } from '@/components/common/StepHeader'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PartGroup } from '@/features/session-builder/components/scope'
import { PART_GROUPS, PART_LABELS } from '@/features/session-builder/constants'
import type { ScopeConfig } from '@/features/session-builder/types'
import type { SessionQuestion } from '@/features/temp-session/types'
import { useStep1Scope } from '@/features/session-builder/hooks/useStep1Scope'

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
    <div className='max-w-3xl mx-auto space-y-8 lg:py-2'>
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

      <div className='pt-4 border-t border-border/50'>
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
        description={`Part ${pendingPart} (${PART_LABELS[pendingPart ?? 0] ?? ''}) đang có ${pendingPartQuestionCount} câu hỏi đã import. Bạn có chắc chắn muốn bỏ chọn part này không? Các câu hỏi của part này sẽ bị xóa.`}
        confirmLabel='Xóa & Tiếp tục'
        cancelLabel='Giữ lại'
        variant='destructive'
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
