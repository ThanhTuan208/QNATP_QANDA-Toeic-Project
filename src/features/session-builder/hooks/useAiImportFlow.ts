'use client'

import { useState } from 'react'
import { buildAiPrompt } from '@/features/session-builder/utils/buildAiPrompt'
import type { SessionConfig } from '@/features/temp-session/types'

type GenerationMode = 'custom' | 'random'

interface UseAiImportFlowOptions {
  config: Partial<SessionConfig>
  onPromptGenerated: (prompt: string) => void
}

export function useAiImportFlow({ config, onPromptGenerated }: UseAiImportFlowOptions) {
  const [mode, setMode] = useState<GenerationMode | null>(null)
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [passageSets, setPassageSets] = useState({ single: 0, double: 0, triple: 0 })
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [copied, setCopied] = useState(false)

  const toggleFormat = (id: string) => {
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }

  const adjustSet = (type: 'single' | 'double' | 'triple', delta: number) => {
    setPassageSets((prev) => ({
      ...prev,
      [type]: Math.max(0, Math.min(10, prev[type] + delta)),
    }))
  }

  const buildPromptString = () =>
    buildAiPrompt({
      mode: mode!,
      config,
      formats: selectedFormats,
      passageSets: mode === 'custom' ? passageSets : undefined,
      additionalNotes,
    })

  const handleGenerate = () => onPromptGenerated(buildPromptString())

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPromptString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return {
    mode,
    setMode,
    selectedFormats,
    toggleFormat,
    passageSets,
    adjustSet,
    additionalNotes,
    setAdditionalNotes,
    copied,
    buildPrompt: buildPromptString,
    handleGenerate,
    handleCopy,
  }
}
