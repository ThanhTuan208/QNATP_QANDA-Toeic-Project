'use client'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  fullScreen?: boolean
  inline?: boolean
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

export const Loading = ({
  size = 'md',
  text,
  fullScreen = false,
  inline = false,
  className,
  ...props
}: LoadingProps) => {
  const spinner = (
    <Loader2
      className={cn(
        'w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin',
        sizeMap[size],
      )}
    />
  )

  if (fullScreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
          className,
        )}
        {...props}
      >
        {spinner}
        {text && <p className='mt-4 text-sm text-muted-foreground'>{text}</p>}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-screen bg-background gap-3 py-8',
        inline && 'flex-row gap-2 py-0',
        className,
      )}
      {...props}
    >
      {spinner}
      {text && <p className={cn('text-sm text-muted-foreground', inline && 'text-base')}>{text}</p>}
    </div>
  )
}

/// code template
// <Loading size="lg" text="Đang tải dữ liệu..." />
// <Loading inline text="Đang xử lý..." />
// <Loading fullScreen text="Đang tải..." />
///
