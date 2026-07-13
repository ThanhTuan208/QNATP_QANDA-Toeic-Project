'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTimerOptions {
  totalSeconds: number
  onExpire: () => void
}

interface UseTimerReturn {
  remaining: number
  formatted: string
  isExpired: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

export function useTimer({ totalSeconds, onExpire }: UseTimerOptions): UseTimerReturn {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
    clearTimer()
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    setRemaining(totalSeconds)
  }, [clearTimer, totalSeconds])

  useEffect(() => {
    if (!isRunning) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer()
          setIsRunning(false)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clearTimer
  }, [isRunning, clearTimer])

  const formatted = formatTime(remaining)
  const isExpired = remaining <= 0

  return { remaining, formatted, isExpired, start, pause, reset }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
