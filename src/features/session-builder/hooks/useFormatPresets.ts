'use client'

import { useCallback, useEffect, useState } from 'react'
import type { DistributionItem } from '@/features/session-builder/presets'

const STORAGE_KEY = 'qanda-user-format-presets'

export interface UserPreset {
  id: string
  name: string
  part: number
  distribution: DistributionItem<string>[]
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

  const addPreset = useCallback((name: string, part: number, distribution: DistributionItem<string>[]) => {
    const newPreset: UserPreset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      part,
      distribution,
    }
    setPresets((prev) => [...prev, newPreset])
  }, [])

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { presets, addPreset, deletePreset }
}
