import { ProgressChart } from '@/features/dashboard/components/ProgressChart'
import { StatsSummary } from '@/features/dashboard/components/StatsSummary'

interface DashboardStatsGridSectionProps {
  completed: number
  total: number
  correct: number
}

export function DashboardStatsGridSection({
  completed,
  total,
  correct,
}: DashboardStatsGridSectionProps) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-1'>
        <div className='bg-card p-6 rounded-2xl shadow-sm border border-border'>
          <h3 className='text-lg font-semibold mb-4 border-b pb-2'>Thống kê</h3>
          <ProgressChart correct={correct} total={total} />
          <div className='mt-6'>
            <StatsSummary completed={completed} total={total} correct={correct} />
          </div>
        </div>
      </div>

      <div className='lg:col-span-2'>
        <div className='bg-card p-6 rounded-2xl shadow-sm border border-border'>
          <h3 className='text-lg font-semibold mb-4 border-b pb-2'>Mẹo làm bài</h3>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            Hãy luôn xác định <strong>Động từ chính</strong> trước khi chọn. Nếu là động từ nối (be,
            seem), hãy chọn tính từ. Nếu là động từ thường, hãy chọn trạng từ.
          </p>
        </div>
      </div>
    </div>
  )
}
