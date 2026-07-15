'use client'

import { useState, useCallback, useMemo } from 'react'
import { AlertTriangle, Zap } from 'lucide-react'
import { useCustomConfig } from '@/features/session-builder/hooks/useCustomConfig'
import { calculateTotalQuestions } from '@/features/session-builder/utils/presets'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'
import { Button } from '@/components/common/Button'
import type { KnowledgeGroupConfig, SessionConfig } from '@/features/temp-session/types'
import { DifficultySection } from './DifficultySection'
import { PartSection } from './PartSection'
import { QuickFormat } from './QuickFormat'
import { QuickFormatModal } from './QuickFormatModal'
import { TotalBanner } from './TotalBanner'

interface CustomConfigFormProps {
  parts: number[]
  config: Partial<SessionConfig>
  onConfigChange: (config: Partial<SessionConfig>) => void
}

export function CustomConfigForm({ parts, config, onConfigChange }: CustomConfigFormProps) {
  const [showQuickFormat, setShowQuickFormat] = useState(false)
  const {
    knowledgeGroups,
    difficulties,
    total,
    handleDeltaChange,
    handleCountChange,
    applyPreset,
    handleDifficultyToggle,
  } = useCustomConfig(config, onConfigChange)

  const configIssues = useMemo(() => {
    const issues: { part: number; total: number }[] = []
    for (const part of parts) {
      const hasGroups = getKnowledgeGroupsForPart(part).length > 0
      if (!hasGroups) continue
      const total = (knowledgeGroups[part] ?? []).reduce((s, g) => s + g.count, 0)
      if (total < 5) issues.push({ part, total })
    }
    return issues
  }, [parts, knowledgeGroups])

  const applyAllPresets = useCallback(
    (allGroups: Record<number, KnowledgeGroupConfig[]>) => {
      const merged = { ...knowledgeGroups, ...allGroups }
      onConfigChange({
        ...config,
        knowledgeGroups: merged,
        totalQuestions: calculateTotalQuestions(merged),
      })
    },
    [knowledgeGroups, config, onConfigChange],
  )

  const quickFormatButton = (
    <Button
      buttonType='ghost'
      icon={<Zap className='size-4 text-green-teal dark:text-pale-teal fill-green-teal-10 dark:fill-pale-teal/10' />}
      className='text-xs sm:text-sm h-7 px-2.5 rounded-lg border border-green-teal-10 dark:border-neutral-80/10 text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-5 dark:hover:bg-green-teal-20/20 hover:text-primary-teal dark:hover:text-pale-light hover:border-green-teal-20 transition-all duration-300'
    >
      Định dạng nhanh
    </Button>
  )

  return (
    <div className='space-y-6 bg-card p-5 sm:p-6 rounded-3xl border border-border/80 shadow-sm'>
      <div className='flex items-center justify-between pb-3 border-b border-border/40'>
        <div className='flex items-center gap-2'>
          <div className='w-1.5 h-4 rounded bg-steel-blue' />
          <h3 className='font-bold text-foreground text-base lg:text-lg'>Tùy chỉnh</h3>
        </div>

        <div className='hidden lg:block'>
          <Button
            buttonType='ghost'
            icon={<Zap className='size-4 text-green-teal dark:text-pale-teal fill-green-teal-10 dark:fill-pale-teal/10' />}
            className='text-xs sm:text-sm h-7 px-2.5 rounded-lg border border-green-teal-10 dark:border-neutral-80/10 text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-5 dark:hover:bg-green-teal-20/20 hover:text-primary-teal dark:hover:text-pale-light hover:border-green-teal-20 transition-all duration-300'
            onClick={() => setShowQuickFormat((v) => !v)}
          >
            Định dạng nhanh
          </Button>
        </div>

        <div className='lg:hidden'>
          <QuickFormatModal
            parts={parts}
            knowledgeGroups={knowledgeGroups}
            onApply={applyPreset}
            onApplyAll={applyAllPresets}
            trigger={quickFormatButton}
          />
        </div>
      </div>

      <div className='flex gap-0'>
        <div className='flex-1 min-w-0 space-y-5'>
          {configIssues.length > 0 && (
            <div className='lg:hidden flex items-start gap-3 p-3 rounded-xl border border-warning-foreground/30 bg-warning-soft/50 dark:bg-warning-soft/10'>
              <AlertTriangle className='size-5 text-warning-foreground shrink-0 mt-0.5' />
              <div className='text-xs sm:text-sm text-warning-foreground space-y-1'>
                <p className='font-semibold'>Cần cấu hình thêm</p>
                <ul className='list-disc list-inside space-y-0.5 opacity-90'>
                  {configIssues.map((issue) => (
                    <li key={issue.part}>
                      Part {issue.part} hiện có <strong>{issue.total}</strong> câu, tối thiểu <strong>5</strong> câu
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {parts.map((part) => (
            <PartSection
              key={part}
              part={part}
              knowledgeGroups={knowledgeGroups}
              onDeltaChange={handleDeltaChange}
              onCountChange={handleCountChange}
            />
          ))}

          <DifficultySection difficulties={difficulties} onToggle={handleDifficultyToggle} />
          <TotalBanner total={total} />
        </div>

        <div className='hidden lg:flex lg:flex-col gap-3'>
          <QuickFormat
            parts={parts}
            knowledgeGroups={knowledgeGroups}
            onApply={applyPreset}
            onApplyAll={applyAllPresets}
            show={showQuickFormat}
            onClose={() => setShowQuickFormat(false)}
          />
          {configIssues.length > 0 && (
            <div className='flex items-start gap-3 p-3 ml-5 rounded-xl border border-warning-foreground/30 bg-warning-soft/50 dark:bg-warning-soft/10'>
              <AlertTriangle className='size-5 text-warning-foreground shrink-0 mt-0.5' />
              <div className='text-xs sm:text-sm text-warning-foreground space-y-1'>
                <p className='font-semibold'>Cần cấu hình thêm</p>
                <ul className='list-disc list-inside space-y-0.5 opacity-90'>
                  {configIssues.map((issue) => (
                    <li key={issue.part}>
                      Part {issue.part} hiện có <strong>{issue.total}</strong> câu, tối thiểu <strong>5</strong> câu
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
