'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PracticeSession, SessionAttempt } from '@/features/temp-session/types'
import { UseTempSessionReturn } from '@/features/temp-session/types/hook'
import {
  deleteSession as idbDelete,
  getAllSessions as idbGetAll,
  loadSession as idbLoad,
  saveSession as idbSave,
} from '@/lib/idb'

function isExpired(session: PracticeSession): boolean {
  return Date.now() > session.expiresAt
}

export function useTempSession(sessionId?: string): UseTempSessionReturn {
  const [session, setSession] = useState<PracticeSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (sessionId) {
      setIsLoading(true)
      idbLoad(sessionId)
        .then((loaded) => {
          if (loaded && !isExpired(loaded)) {
            setSession(loaded)
          } else {
            if (loaded) idbDelete(sessionId)
            setSession(null)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [sessionId])

  const save = useCallback(async (newSession: PracticeSession) => {
    await idbSave(newSession)
    setSession(newSession)
  }, [])

  const load = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const loaded = await idbLoad(id)
      if (loaded && !isExpired(loaded)) {
        setSession(loaded)
      } else {
        if (loaded) await idbDelete(id)
        setSession(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clear = useCallback(async (id: string) => {
    await idbDelete(id)
    setSession(null)
  }, [])

  const updateAttempt = useCallback(
    async (attempt: SessionAttempt) => {
      if (!session) return
      const updated: PracticeSession = {
        ...session,
        attempts: [...session.attempts, attempt],
      }
      await idbSave(updated)
      setSession(updated)
    },
    [session],
  )

  const updateIndex = useCallback(
    async (index: number) => {
      if (!session) return
      const updated: PracticeSession = { ...session, currentIndex: index }
      await idbSave(updated)
      setSession(updated)
    },
    [session],
  )

  const getAll = useCallback(async () => {
    if (!session) return []
    return idbGetAll(session.userId)
  }, [session])

  return {
    session,
    isLoading,
    save,
    load,
    clear,
    updateAttempt,
    updateIndex,
    getAll,
  }
}
