'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

interface SidebarContextType {
  isHidden: boolean
  setHidden: (hidden: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  isHidden: false,
  setHidden: () => {},
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isHidden, setHidden] = useState(false)

  return (
    <SidebarContext.Provider value={{ isHidden, setHidden }}>{children}</SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  return useContext(SidebarContext)
}
