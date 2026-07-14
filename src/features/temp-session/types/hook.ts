import type { PracticeSession, SessionAttempt } from '@/features/temp-session/types'

export interface UseTempSessionReturn {
  session: PracticeSession | null
  isLoading: boolean
  save: (session: PracticeSession) => Promise<void>
  load: (id: string) => Promise<void>
  clear: (id: string) => Promise<void>
  updateAttempt: (attempt: SessionAttempt) => Promise<void>
  updateIndex: (index: number) => Promise<void>
  getAll: () => Promise<PracticeSession[]>
}
