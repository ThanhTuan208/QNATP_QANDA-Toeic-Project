import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-40 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-neutral-90 text-neutral-0 shadow-sm hover:bg-neutral-80',
        secondary: 'border-transparent bg-muted text-foreground hover:bg-neutral-5',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-error-hover',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
