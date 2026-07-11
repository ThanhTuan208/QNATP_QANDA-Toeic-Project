'use client'

import { useQuery } from '@tanstack/react-query'
import { AttemptHistorySection } from '@/features/dashboard/components/Sections/AttemptHistorySection'
import { DashboardHeaderSection } from '@/features/dashboard/components/Sections/DashboardHeaderSection'
import { DashboardStatsGridSection } from '@/features/dashboard/components/Sections/DashboardStatsGridSection'
import { fetchStats } from '@/features/quiz/client/quiz.client'
import type { StatsData } from '@/features/quiz/types'

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ['stats'],
    queryFn: fetchStats,
    staleTime: 30_000,
    retry: 2,
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-100'>
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
