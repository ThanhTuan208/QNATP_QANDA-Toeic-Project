'use client'

import { useCallback, useEffect, useState } from 'react'
import type { KnowledgeGroupConfig } from '@/features/temp-session/types'

const STORAGE_KEY = 'qanda-user-format-presets'

export interface UserPreset {
  id: string
  name: string
  part: number
  groups: KnowledgeGroupConfig[]
}

function loadPresets(): UserPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePresets(presets: UserPreset[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  } catch {}
}

export function useFormatPresets() {
  const [presets, setPresets] = useState<UserPreset[]>(loadPresets)

  useEffect(() => {
    savePresets(presets)
  }, [presets])

  const addPreset = useCallback((name: string, part: number, groups: KnowledgeGroupConfig[]) => {
    const newPreset: UserPreset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      part,
      groups,
    }
    setPresets((prev) => [...prev, newPreset])
  }, [])

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { presets, addPreset, deletePreset }
}
