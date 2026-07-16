'use client'

import { useCallback, useMemo, useState } from 'react'
import { useFormatPresets } from '@/features/session-builder/hooks/useFormatPresets'
import { SYSTEM_PRESETS } from '@/features/session-builder/presets'
import { getKnowledgeGroupsForPart } from '@/features/session-builder/utils/knowledge-groups'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'

interface UseQuickFormatOptions {
  parts: number[]
  knowledgeGroups: Record<number, KnowledgeGroupConfig[]>
  onApply: (groups: KnowledgeGroupConfig[], part: number) => void
  onApplyAll?: (allGroups: Record<number, KnowledgeGroupConfig[]>) => void
}

export type Tab = 'system' | 'mine'

export function useQuickFormat({
  parts,
  knowledgeGroups,
  onApply,
  onApplyAll,
}: UseQuickFormatOptions) {
  const [tab, setTab] = useState<Tab>('system')
  const [selectedPart, setSelectedPart] = useState<number>(parts[0] ?? 5)
  const [saveName, setSaveName] = useState('')
  const [selectedPresets, setSelectedPresets] = useState<Record<number, KnowledgeGroupConfig[]>>({})
  const { presets, addPreset, deletePreset } = useFormatPresets()

  const activeParts = useMemo(
    () => parts.filter((p) => getKnowledgeGroupsForPart(p).length > 0),
    [parts],
  )

  const systemPresetsForPart = useMemo(
    () => SYSTEM_PRESETS.filter((p) => p.part === selectedPart),
    [selectedPart],
  )

  const userPresetsForPart = useMemo(
    () => presets.filter((p) => p.part === selectedPart),
    [presets, selectedPart],
  )

  const hasSelection = useMemo(() => Object.keys(selectedPresets).length > 0, [selectedPresets])

  const selectPreset = useCallback((part: number, groups: KnowledgeGroupConfig[]) => {
    setSelectedPresets((prev) => {
      const current = prev[part]
      if (current && JSON.stringify(current) === JSON.stringify(groups)) {
        const next = { ...prev }
        delete next[part]
        return next
      }
      return { ...prev, [part]: groups }
    })
  }, [])

  const handleApplyAll = useCallback(() => {
    if (onApplyAll) {
      onApplyAll(selectedPresets)
    } else {
      for (const [part, groups] of Object.entries(selectedPresets)) {
        onApply(groups, Number(part))
      }
    }
    setSelectedPresets({})
  }, [onApply, onApplyAll, selectedPresets])

  const handleSavePreset = useCallback(() => {
    if (!saveName.trim()) return
    const distribution = getKnowledgeGroupsForPart(selectedPart).map((g) => ({
      type: g.type,
      count: (knowledgeGroups[selectedPart] ?? []).find((kg) => kg.type === g.type)?.count ?? 0,
    }))
    addPreset(saveName.trim(), selectedPart, distribution)
    setSaveName('')
  }, [saveName, selectedPart, knowledgeGroups, addPreset])

  return {
    tab,
    setTab,
    selectedPart,
    setSelectedPart,
    saveName,
    setSaveName,
    activeParts,
    systemPresetsForPart,
    userPresetsForPart,
    selectedPresets,
    selectPreset,
    hasSelection,
    handleApplyAll,
    handleSavePreset,
    deletePreset,
  }
}
