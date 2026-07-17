'use client'

import { Button, type ButtonProps } from '@/components/common/Button/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog'
import { DialogFooter } from '@/components/ui/overlay/dialog'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
  className?: string
  headerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  footerClassName?: string
  confirmClassName?: string
  cancelClassName?: string
  confirmButtonType?: ButtonProps['buttonType']
  cancelButtonType?: ButtonProps['buttonType']
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  onConfirm,
  variant = 'default',
  loading = false,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  footerClassName,
  confirmClassName,
  cancelClassName,
  confirmButtonType,
  cancelButtonType,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    if (!loading) onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('sm:max-w-md', className)}
        showCloseButton={false}
      >
        <DialogHeader className={headerClassName}>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={cn('text-sm leading-relaxed', descriptionClassName)}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children && <div className='py-2'>{children}</div>}

        <DialogFooter className={cn('gap-2 sm:gap-0', footerClassName)}>
          <Button
            buttonType={cancelButtonType ?? 'outline'}
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className={cancelClassName}
          >
            {cancelLabel}
          </Button>
          <Button
            buttonType={
              confirmButtonType ?? (variant === 'destructive' ? 'danger' : 'fill')
            }
            onClick={handleConfirm}
            loading={loading}
            className={confirmClassName}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
