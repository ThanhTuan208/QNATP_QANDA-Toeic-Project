import { useEffect, useState } from 'react'

export function useStep5Practice() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false)

  const hasLocalStoragePref =
    typeof window !== 'undefined' ? localStorage.getItem('practice-mode') !== null : false

  useEffect(() => {
    if (!hasLocalStoragePref) {
      setShowFirstTimeModal(true)
    }
  }, [hasLocalStoragePref])

  return {
    showFirstTimeModal,
    setShowFirstTimeModal,
  }
}
