import { useCallback, useEffect, useRef, useState } from 'react'

interface UsePracticeTimerOptions {
  totalSeconds: number
  onTimeUp?: () => void
  autoStart?: boolean
}

interface UsePracticeTimerReturn {
  timeLeft: number
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
}

export function usePracticeTimer({
  totalSeconds,
  onTimeUp,
  autoStart = false,
}: UsePracticeTimerOptions): UsePracticeTimerReturn {
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTimeUpRef = useRef(onTimeUp)

  onTimeUpRef.current = onTimeUp

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
    setTimeLeft(totalSeconds)
    setIsRunning(false)
  }, [clearTimer, totalSeconds])

  useEffect(() => {
    if (!isRunning) {
      clearTimer()
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer()
          setIsRunning(false)
          onTimeUpRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return clearTimer
  }, [isRunning, clearTimer])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  return { timeLeft, isRunning, start, pause, reset }
}
