'use client'

import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

export type PassageViewMode = 'single' | 'all'

interface PracticeOptionsContextType {
  showExplanations: boolean
  setShowExplanations: (v: boolean) => void
  passageViewMode: PassageViewMode
  setPassageViewMode: (v: PassageViewMode) => void
  hasMultiplePassages: boolean
  setHasMultiplePassages: (v: boolean) => void
}

const PracticeOptionsContext = createContext<PracticeOptionsContextType>({
  showExplanations: true,
  setShowExplanations: () => {},
  passageViewMode: 'single',
  setPassageViewMode: () => {},
  hasMultiplePassages: false,
  setHasMultiplePassages: () => {},
})

export function PracticeOptionsProvider({ children }: { children: ReactNode }) {
  const [showExplanations, setShowExplanations] = useState(true)
  const [passageViewMode, setPassageViewMode] = useState<PassageViewMode>('single')
  const [hasMultiplePassages, setHasMultiplePassages] = useState(false)

  return (
    <PracticeOptionsContext.Provider
      value={useMemo(
        () => ({
          showExplanations,
          setShowExplanations,
          passageViewMode,
          setPassageViewMode,
          hasMultiplePassages,
          setHasMultiplePassages,
        }),
        [showExplanations, passageViewMode, hasMultiplePassages],
      )}
    >
      {children}
    </PracticeOptionsContext.Provider>
  )
}

export function usePracticeOptions() {
  return useContext(PracticeOptionsContext)
}
