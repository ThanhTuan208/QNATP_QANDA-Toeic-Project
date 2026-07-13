'use client'

import { Clock, Play, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { PART_LABELS } from '@/features/session-builder/constants/knowledge-groups'
import { PRESETS } from '@/features/session-builder/constants/presets-data'
import type { PracticeSession } from '@/features/temp-session/types'
import { deleteSession, getAllSessions } from '@/lib/idb'

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

interface SessionCardProps {
  session: PracticeSession
  onDelete: (id: string) => void
  onContinue: (id: string) => void
}

function SessionCard({ session, onDelete, onContinue }: SessionCardProps) {
  const presetInfo = PRESETS.find((p) => p.id === session.config.preset)
  const PresetIcon = presetInfo?.icon
  const isActive = session.status === 'active' || session.status === 'preview'
  const answeredCount = session.attempts.length

  return (
    <div className='bg-card border border-border rounded-xl p-4 space-y-3 hover:shadow-sm transition-shadow'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {PresetIcon && <PresetIcon className='size-4 text-muted-foreground' />}
          <span className='text-sm font-semibold text-foreground'>
            {presetInfo?.label ?? session.config.preset}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isActive ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground'
          }`}
        >
          {isActive ? 'Active' : 'Completed'}
        </span>
      </div>

      <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
        <span>
          Parts:{' '}
          {session.config.parts
            .sort()
            .map((p) => PART_LABELS[p]?.replace('Part ', '') ?? p)
            .join(', ')}
        </span>
        <span>Total: {session.config.totalQuestions} questions</span>
        {answeredCount > 0 && <span>Answered: {answeredCount}</span>}
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <Clock className='size-3' />
          <span>{relativeTime(session.createdAt)}</span>
        </div>
        <div className='flex gap-2'>
          {isActive ? (
            <button
              type='button'
              onClick={() => onContinue(session.id)}
              className='flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all'
            >
              <Play className='size-3' />
              Continue
            </button>
          ) : (
            <button
              type='button'
              onClick={() => onContinue(session.id)}
              className='flex items-center gap-1 bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-neutral-5 transition-all'
            >
              View Result
            </button>
          )}
          <button
            type='button'
            onClick={() => onDelete(session.id)}
            className='flex items-center gap-1 text-muted-foreground hover:text-destructive px-2 py-1.5 rounded-lg text-xs transition-colors'
          >
            <Trash2 className='size-3' />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SessionList() {
  const router = useRouter()
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    try {
      const all = await getAllSessions('anonymous')
      const now = Date.now()
      const valid = all.filter((s) => now <= s.expiresAt)
      setSessions(valid.sort((a, b) => b.createdAt - a.createdAt))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const handleDelete = useCallback(async (id: string) => {
    await deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const handleContinue = useCallback(
    (id: string) => {
      router.push(`/practice/mixed-practice/create-session?session=${id}`)
    },
    [router],
  )

  const activeSessions = sessions.filter((s) => s.status === 'active' || s.status === 'preview')
  const completedSessions = sessions.filter((s) => s.status === 'completed')

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[30vh]'>
        <div className='size-6 border-2 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4'>
        <div className='size-16 rounded-2xl bg-muted flex items-center justify-center'>
          <Clock className='size-8 text-muted-foreground' />
        </div>
        <h2 className='text-xl font-bold text-foreground'>My Sessions</h2>
        <p className='text-muted-foreground max-w-md'>
          Bạn chưa có bài luyện tập nào. Hãy tạo một session mới để bắt đầu.
        </p>
        <button
          type='button'
          onClick={() => router.push('/practice/mixed-practice/create-session')}
          className='bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all'
        >
          Create Session
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-bold text-foreground mb-1'>My Sessions</h2>
        <p className='text-sm text-muted-foreground'>
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} — chỉ hiển thị session trong
          24h
        </p>
      </div>

      {activeSessions.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-foreground'>Active</h3>
          {activeSessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onDelete={handleDelete}
              onContinue={handleContinue}
            />
          ))}
        </div>
      )}

      {completedSessions.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-sm font-semibold text-foreground'>Completed</h3>
          {completedSessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onDelete={handleDelete}
              onContinue={handleContinue}
            />
          ))}
        </div>
      )}
    </div>
  )
}
