'use client'
import { Button } from '@/components/ui/actions/button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  size?: 'sm' | 'default' | 'lg'
}

export const EmptyState = ({
  icon,
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có dữ liệu nào để hiển thị.',
  actionLabel,
  onAction,
  size = 'default',
  className,
  ...props
}: EmptyStateProps) => {
  const iconSize = size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-20 w-20' : 'h-16 w-16'

  return (
    <div
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
      {...props}
    >
      {icon ? (
        <div className={cn('mb-6 text-muted-foreground', iconSize)}>{icon}</div>
      ) : (
        <div className={cn('mb-6 text-muted-foreground', iconSize)}>
          <svg
            aria-label='image svg '
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M2.25 13.5h3.86a3 3 0 002.76-2.19l.75-3.75a3 3 0 012.94-2.31h7.5a3 3 0 012.94 2.31l.75 3.75a3 3 0 002.76 2.19h3.86M12 3v2.25m0 13.5V21m-9-9h18'
            />
          </svg>
        </div>
      )}

      {title && <h3 className='text-xl font-medium text-foreground mb-2'>{title}</h3>}
      {description && <p className='max-w-sm text-muted-foreground mb-6'>{description}</p>}

      {actionLabel && onAction && (
        <Button onClick={onAction} variant='outline'>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

/// code template
// <EmptyState
//   icon={<Inbox size={64} />}
//   title="Chưa có đơn hàng"
//   description="Bạn chưa có đơn hàng nào. Hãy tạo đơn hàng đầu tiên."
//   actionLabel="Tạo đơn hàng mới"
//   onAction={() => router.push('/orders/new')}
// />
///
