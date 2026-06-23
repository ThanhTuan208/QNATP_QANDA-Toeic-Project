'use client'

import type { VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { buttonVariants, Button as ShadcnButton } from '@/components/ui/actions/button'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ComponentProps<typeof ShadcnButton>,
    VariantProps<typeof buttonVariants> {
  buttonType?: 'fill' | 'outline' | 'ghost' | 'cancel' | 'danger' | 'success' | 'none'
  loading?: boolean
  loadingText?: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = ({
  buttonType = 'fill',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  loadingText,
  ...props
}: ButtonProps) => {
  const variantMap: Record<
    NonNullable<ButtonProps['buttonType']>,
    VariantProps<typeof buttonVariants>['variant']
  > = {
    fill: 'default',
    outline: 'outline',
    ghost: 'ghost',
    cancel: 'outline',
    danger: 'destructive',
    success: 'default',
    none: 'none',
  }

  return (
    <ShadcnButton
      variant={variantMap[buttonType]}
      className={cn(className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {!loading && icon && iconPosition === 'left' && <span className='mr-2'>{icon}</span>}

      {loading ? loadingText || children : children}

      {!loading && icon && iconPosition === 'right' && <span className='ml-2'>{icon}</span>}
    </ShadcnButton>
  )
}

export { Button, buttonVariants }
export default Button

/* <Button
        buttonType={'danger'}
        icon={<Badge />}
        // loading={true}
        iconPosition='left'
        onClick={() => alert('Clicked')}
        className='uppercase'
      >
        Submit
      </Button>
 */
