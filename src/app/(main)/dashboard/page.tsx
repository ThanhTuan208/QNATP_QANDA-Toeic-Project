'use client'

import { useEffect, useState } from 'react'
import { AttemptHistorySection } from '@/features/dashboard/components/sections/AttemptHistorySection'
import { DashboardHeaderSection } from '@/features/dashboard/components/sections/DashboardHeaderSection'
import { DashboardStatsGridSection } from '@/features/dashboard/components/sections/DashboardStatsGridSection'

interface StatsData {
  totalAttempts: number
  correctAttempts: number
  accuracy: number
  typeStats: Record<string, { total: number; correct: number }>
  recentAttempts: Array<{
    id: string
    isCorrect: boolean
    createdAt: string
    question: { type: string; difficulty: string }
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>Đang tải...</div>
      </div>
    )
  }

  const completed = stats?.totalAttempts ?? 0
  const correct = stats?.correctAttempts ?? 0
  const total = Math.max(completed, 10)

  return (
    <div className='space-y-8'>
      <DashboardHeaderSection />
      <DashboardStatsGridSection completed={completed} total={total} correct={correct} />
      <AttemptHistorySection attempts={stats?.recentAttempts ?? []} />
    </div>
  )
}
