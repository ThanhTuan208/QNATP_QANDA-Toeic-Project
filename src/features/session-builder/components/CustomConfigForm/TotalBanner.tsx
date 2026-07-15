'use client'

interface TotalBannerProps {
  total: number
}

export function TotalBanner({ total }: TotalBannerProps) {
  return (
    <div className='pt-4 border-t border-border/40'>
      <div className='flex items-center justify-between px-4 py-3 bg-steel-blue-5 border border-steel-blue-10 rounded-xl'>
        <span className='text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground'>
          Tổng số câu
        </span>
        <span className='text-sm lg:text-base font-extrabold text-steel-blue tabular-nums'>
          {total} câu
        </span>
      </div>
    </div>
  )
}
