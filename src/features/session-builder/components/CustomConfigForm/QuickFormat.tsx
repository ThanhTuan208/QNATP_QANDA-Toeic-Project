'use client'

import { Save, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog'
import { SYSTEM_PRESETS } from '@/features/session-builder/constants/format-presets'
import { useFormatPresets } from '@/features/session-builder/hooks/useFormatPresets'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'

interface QuickFormatProps {
  parts: number[]
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  onApply: (groups: KnowledgeGroupConfig[], part: number) => void
}

type Tab = 'system' | 'mine'

export function QuickFormat({ parts, knowledgeGroups, onApply }: QuickFormatProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('system')
  const [selectedPart, setSelectedPart] = useState<number>(parts[0] ?? 5)
  const { presets, addPreset, deletePreset } = useFormatPresets()
  const [saveName, setSaveName] = useState('')
  const [savePart, _setSavePart] = useState<number>(parts[0] ?? 5)

  const activeParts = parts.filter((p) => getKnowledgeGroupsForPart(p).length > 0)

  const systemPresetsForPart = SYSTEM_PRESETS.filter((p) => p.part === selectedPart)

  const userPresetsForPart = presets.filter((p) => p.part === selectedPart)

  const handleApply = (groups: KnowledgeGroupConfig[], part: number) => {
    onApply(groups, part)
    setOpen(false)
  }

  const handleSavePreset = () => {
    if (!saveName.trim()) return
    const groups = getKnowledgeGroupsForPart(savePart).map((g) => ({
      type: g.type,
      count: (knowledgeGroups[savePart] ?? []).find((kg) => kg.type === g.type)?.count ?? 0,
    }))
    addPreset(saveName.trim(), savePart, groups)
    setSaveName('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          buttonType='ghost'
          icon={<Sparkles className='size-3.5' />}
          className='text-xs h-7 px-2'
        >
          Quick Format
        </Button>
      </DialogTrigger>
      <DialogContent
        size='sm'
        className='max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden duration-700 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-top-0'
      >
        <DialogHeader showDivider>
          <DialogTitle subtitle='Choose a preset format for each part'>Quick Format</DialogTitle>
        </DialogHeader>

        {/* Part tabs */}
        <div className='flex gap-1'>
          {activeParts.map((p) => (
            <button
              key={p}
              type='button'
              onClick={() => setSelectedPart(p)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedPart === p
                  ? 'bg-steel-blue text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Part {p}
            </button>
          ))}
        </div>

        {/* System / Mine tabs */}
        <div className='flex gap-1 border-b border-border/40'>
          <button
            type='button'
            onClick={() => setTab('system')}
            className={`pb-2 text-xs font-semibold transition-colors relative ${
              tab === 'system'
                ? 'text-steel-blue after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-steel-blue'
                : 'text-muted-foreground'
            }`}
          >
            System
          </button>
          <button
            type='button'
            onClick={() => setTab('mine')}
            className={`pb-2 text-xs font-semibold transition-colors relative ${
              tab === 'mine'
                ? 'text-steel-blue after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-steel-blue'
                : 'text-muted-foreground'
            }`}
          >
            My Presets
          </button>
        </div>

        {tab === 'system' ? (
          <div className='space-y-2'>
            {systemPresetsForPart.length === 0 ? (
              <p className='text-xs text-muted-foreground text-center py-4'>
                No presets available for this part
              </p>
            ) : (
              systemPresetsForPart.map((preset) => (
                <div
                  key={preset.id}
                  className='p-3 rounded-xl border border-border/50 bg-muted/10 space-y-2'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-semibold text-foreground'>{preset.name}</span>
                    <Button
                      buttonType='fill'
                      className='text-xs h-6 px-3'
                      onClick={() => handleApply(preset.groups, preset.part)}
                    >
                      Apply
                    </Button>
                  </div>
                  <div className='grid grid-cols-2 gap-1'>
                    {preset.groups.map((g) => {
                      const label =
                        getKnowledgeGroupsForPart(preset.part).find((kg) => kg.type === g.type)
                          ?.label ?? g.type
                      return (
                        <span key={g.type} className='text-[10px] text-muted-foreground'>
                          {label}: <strong className='text-foreground'>{g.count}</strong>
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className='space-y-2'>
            {/* Save new preset form */}
            <div className='flex gap-2 items-center'>
              <input
                type='text'
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder='Preset name...'
                className='flex-1 h-8 px-2 text-xs rounded-lg border border-border bg-background outline-none focus:border-steel-blue'
              />
              <Button
                buttonType='fill'
                icon={<Save className='size-3' />}
                className='text-xs h-8 px-2'
                disabled={!saveName.trim()}
                onClick={handleSavePreset}
              >
                Save Current
              </Button>
            </div>

            {userPresetsForPart.length === 0 ? (
              <p className='text-xs text-muted-foreground text-center py-4'>No saved presets yet</p>
            ) : (
              userPresetsForPart.map((preset) => (
                <div
                  key={preset.id}
                  className='p-3 rounded-xl border border-border/50 bg-muted/10 space-y-2'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-semibold text-foreground'>{preset.name}</span>
                    <div className='flex gap-1'>
                      <Button
                        buttonType='fill'
                        className='text-xs h-6 px-3'
                        onClick={() => handleApply(preset.groups, preset.part)}
                      >
                        Apply
                      </Button>
                      <button
                        type='button'
                        onClick={() => deletePreset(preset.id)}
                        className='size-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive transition-colors'
                      >
                        <Trash2 className='size-3.5' />
                      </button>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-1'>
                    {preset.groups.map((g) => {
                      const label =
                        getKnowledgeGroupsForPart(preset.part).find((kg) => kg.type === g.type)
                          ?.label ?? g.type
                      return (
                        <span key={g.type} className='text-[10px] text-muted-foreground'>
                          {label}: <strong className='text-foreground'>{g.count}</strong>
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
