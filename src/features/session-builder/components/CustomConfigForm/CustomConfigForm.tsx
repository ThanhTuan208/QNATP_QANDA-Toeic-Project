'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Zap } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { useCustomConfig } from '@/features/session-builder/hooks/useCustomConfig'
import type { SessionConfig } from '@/features/temp-session/types'
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
  const {
    configIssues,
    knowledgeGroups,
    difficulties,
    total,
    showQuickFormat,
    setShowQuickFormat,
    handleDeltaChange,
    handleCountChange,
    applyPreset,
    handleDifficultyToggle,
    applyAllPresets,
  } = useCustomConfig(parts, config, onConfigChange)

  const quickFormatButton = (
    <Button
      buttonType='ghost'
      icon={
        <Zap className='size-4 text-green-teal dark:text-pale-teal fill-green-teal-10 dark:fill-pale-teal/10' />
      }
      className='text-xs sm:text-sm h-7 px-2.5 rounded-lg border border-green-teal-10 dark:border-neutral-80/10 text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-5 dark:hover:bg-green-teal-20/20 hover:text-primary-teal dark:hover:text-pale-light hover:border-green-teal-20 transition-all duration-300'
    >
      Định dạng nhanh
    </Button>
  )

  return (
    <div className='space-y-6 bg-card p-5 sm:p-6 rounded-3xl border border-border/80 shadow-sm'>
      <div className='flex items-center justify-between pb-3 border-b border-border/40'>
        <div className='flex items-center gap-2'>
          <div className='w-1.5 h-4 rounded bg-green-teal' />
          <h3 className='font-bold text-foreground text-base lg:text-lg'>Tùy chỉnh</h3>
        </div>

        <div className='hidden lg:block'>
          <Button
            buttonType='ghost'
            icon={
              <Zap className='size-4 text-green-teal dark:text-pale-teal fill-green-teal-10 dark:fill-pale-teal/10' />
            }
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
          <AnimatePresence mode='popLayout'>
            {configIssues.length > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='flex items-start gap-3 p-3 rounded-xl border border-warning-foreground/30 bg-warning-soft/50 dark:bg-warning-soft/10'
              >
                <AlertTriangle className='size-5 text-warning-foreground shrink-0 mt-0.5' />
                <div className='text-xs sm:text-sm text-warning-foreground space-y-1'>
                  <p className='font-semibold'>Cần cấu hình thêm</p>
                  <ul className='list-disc list-inside space-y-0.5 opacity-90'>
                    {configIssues.map((issue) => (
                      <li key={issue.part}>
                        Part {issue.part} hiện có <strong>{issue.total}</strong> câu, tối thiểu{' '}
                        <strong>5</strong> câu
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {parts.map((part) => (
            <motion.div
              key={part}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PartSection
                part={part}
                knowledgeGroups={knowledgeGroups}
                onDeltaChange={handleDeltaChange}
                onCountChange={handleCountChange}
              />
            </motion.div>
          ))}

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DifficultySection difficulties={difficulties} onToggle={handleDifficultyToggle} />
          </motion.div>

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TotalBanner total={total} />
          </motion.div>
        </div>

        <div className='hidden lg:flex lg:flex-col gap-3'>
          <QuickFormat
            parts={parts}
            knowledgeGroups={knowledgeGroups}
            onApply={applyPreset}
            onApplyAll={applyAllPresets}
            show={showQuickFormat}
            onClose={() => setShowQuickFormat(true)}
          />
        </div>
      </div>
    </div>
  )
}
