'use client'

import { useState } from 'react'
import { Check, Info, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/common/Button'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'
import { PresetCard } from './PresetCard'
import { SavePresetForm } from './SavePresetForm'

export type Tab = 'system' | 'mine'

interface QuickFormatContentProps {
  tab: Tab
  setTab: (tab: Tab) => void
  selectedPart: number
  setSelectedPart: (part: number) => void
  activeParts: number[]
  selectedPresets: Record<number, KnowledgeGroupConfig[]>
  systemPresetsForPart: Array<{ id: string; title: string; part: number; distribution: KnowledgeGroupConfig[] }>
  userPresetsForPart: Array<{ id: string; name: string; part: number; distribution: KnowledgeGroupConfig[] }>
  saveName: string
  setSaveName: (name: string) => void
  selectPreset: (part: number, groups: KnowledgeGroupConfig[]) => void
  hasSelection: boolean
  handleApplyAll: () => void
  handleSavePreset: () => void
  deletePreset: (id: string) => void
}

function MyPresetsTutorial() {
  const [dismissed, setDismissed] = useState(
    typeof window !== 'undefined' && localStorage.getItem('quickformat_mine_tutorial') === '1',
  )

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('quickformat_mine_tutorial', '1')
    }
  }

  return (
    <div className='relative bg-steel-blue-5 dark:bg-steel-blue-20/15 border border-steel-blue/20 dark:border-steel-blue/30 rounded-xl p-3 pr-8 mb-3'>
      <button
        type='button'
        onClick={handleDismiss}
        className='absolute top-2 right-2 rounded-full p-0.5 text-steel-blue/60 hover:text-steel-blue hover:bg-steel-blue-10 dark:hover:bg-steel-blue-20/30 transition-all'
      >
        <X className='size-3.5' />
      </button>
      <div className='flex gap-2.5'>
        <Info className='size-4 text-steel-blue shrink-0 mt-0.5' />
        <div className='space-y-1.5 text-xs sm:text-sm'>
          <p className='font-semibold text-steel-blue dark:text-pale-teal'>
            Hướng dẫn sử dụng
          </p>
          <ol className='text-subtext-90 dark:text-neutral-30 space-y-1 list-decimal list-inside marker:text-steel-blue/60'>
            <li>Cấu hình từng part trong form, sau đó lưu lại thành preset tại đây</li>
            <li>Chọn preset cho tất cả các part (5, 6, 7) trong panel này</li>
            <li>Nhấn <strong>Apply All</strong> để áp dụng toàn bộ cùng lúc</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export function QuickFormatContent({
  tab,
  setTab,
  selectedPart,
  setSelectedPart,
  activeParts,
  selectedPresets,
  systemPresetsForPart,
  userPresetsForPart,
  saveName,
  setSaveName,
  selectPreset,
  hasSelection,
  handleApplyAll,
  handleSavePreset,
  deletePreset,
}: QuickFormatContentProps) {
  return (
    <>
      {/* System / Mine tabs */}
      <div className='flex gap-4 mt-4 border-b border-green-teal-10/50 dark:border-neutral-80/20 px-1'>
        {(['system', 'mine'] as const).map((t) => (
          <button
            key={t}
            type='button'
            onClick={() => setTab(t)}
            className={`pb-2 text-xs sm:text-sm font-bold relative transition-colors duration-500 ease-in-out ${tab === t
              ? 'text-primary-teal dark:text-pale-teal'
              : 'text-subtext-50 dark:text-neutral-40 hover:text-primary-teal dark:hover:text-pale-teal'
              }`} 
          >
            {t === 'system' ? 'Hệ thống' : 'Của tôi'}

            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-green-teal transition-all duration-500 ease-in-out ${tab === t
                ? 'opacity-100 scale-x-100'
                : 'opacity-0 scale-x-0 pointer-events-none'
                }`}
            />
          </button>
        ))}
      </div>

      {/* Part Tabs with selection badge */}
      <div className='bg-green-teal-20/40 dark:bg-neutral-90/50 p-1 rounded-xl flex gap-1 mt-2'>
        {activeParts.map((p) => {
          const hasPartSelection = !!selectedPresets[p]
          return (
            <button
              key={p}
              type='button'
              onClick={() => setSelectedPart(p)}
              className={`flex-1 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${selectedPart === p
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-subtext-90 dark:text-neutral-30 hover:bg-green-teal-5 dark:hover:bg-neutral-80/10'
                }`}
            >
              Part {p}
              {hasPartSelection && (
                <Check className={`size-3 ${selectedPart === p ? 'text-primary-foreground' : 'text-green-teal'}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Scrollable content area */}
      <div className='flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden pt-2 min-h-0'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={`${tab}-${selectedPart}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {tab === 'system' ? (
              <div className='space-y-2'>
                {systemPresetsForPart.length === 0 ? (
                  <p className='text-xs sm:text-sm text-subtext-50 dark:text-neutral-40 text-center py-6 bg-green-bright/10 dark:bg-neutral-95/5 rounded-xl border border-dashed border-green-teal-10'>
                    Không có preset nào cho part này
                  </p>
                ) : (
                  systemPresetsForPart.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      name={preset.title}
                      part={preset.part}
                      distribution={preset.distribution}
                      isSelected={
                        !!selectedPresets[preset.part] &&
                        JSON.stringify(selectedPresets[preset.part]) === JSON.stringify(preset.distribution)
                      }
                      onSelect={() => selectPreset(preset.part, preset.distribution)}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className='space-y-2'>
                <MyPresetsTutorial />
                <SavePresetForm value={saveName} onChange={setSaveName} onSave={handleSavePreset} />
                {userPresetsForPart.length === 0 ? (
                  <p className='text-xs sm:text-sm text-subtext-50 dark:text-neutral-40 text-center py-6 bg-green-bright/10 dark:bg-neutral-95/5 rounded-xl border border-dashed border-green-teal-10'>
                    Chưa có preset nào được lưu
                  </p>
                ) : (
                  userPresetsForPart.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      name={preset.name}
                      part={preset.part}
                      distribution={preset.distribution}
                      isSelected={
                        !!selectedPresets[preset.part] &&
                        JSON.stringify(selectedPresets[preset.part]) === JSON.stringify(preset.distribution)
                      }
                      onSelect={() => selectPreset(preset.part, [...preset.distribution])}
                      onDelete={() => deletePreset(preset.id)}
                    />
                  ))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Apply All Footer */}
      <div className='pt-2 pb-1'>
        <Button
          buttonType='fill'
          disabled={!hasSelection}
          onClick={handleApplyAll}
            className='w-full text-sm lg:text-base h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all'
        >
          <span className='flex items-center gap-2'>
            <Check className='size-4' />
            Áp dụng{hasSelection ? ` (${Object.keys(selectedPresets).length})` : ''}
          </span>
        </Button>
      </div>
    </>
  )
}
