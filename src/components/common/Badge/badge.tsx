'use client'
import type { VariantProps } from 'class-variance-authority'
import { badgeVariants } from '@/components/ui/layout/badge'
import { cn } from '@/lib/utils'

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  badgeType?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  icon?: React.ReactNode
}

const Badge = ({ badgeType = 'default', icon, className, children, ...props }: BadgeProps) => {
  const variantMap: Record<
    NonNullable<BadgeProps['badgeType']>,
    VariantProps<typeof badgeVariants>['variant']
  > = {
    default: 'default',
    secondary: 'secondary',
    destructive: 'destructive',
    outline: 'outline',
    success: 'default',
    warning: 'default',
    info: 'default',
  }

  return (
    <div
      className={cn(
        badgeVariants({ variant: variantMap[badgeType] }),
        {
          'bg-success text-white hover:bg-success': badgeType === 'success',
          'bg-warning text-white hover:bg-warning': badgeType === 'warning',
          'bg-info text-white hover:bg-info': badgeType === 'info',
        },
        className,
      )}
      {...props}
    >
      {icon && <span className='mr-1'>{icon}</span>}
      {children}
    </div>
  )
}

export default Badge

/// code template
// <Badge badgeType="success" icon={<Check size={14} />}>
//   Đã xác nhận
// </Badge>
///
