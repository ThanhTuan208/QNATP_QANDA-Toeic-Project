'use client'

import { XIcon } from 'lucide-react'
import type * as React from 'react'
import { Button } from '@/components/common/Button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog as ShadcnDialog,
} from '@/components/ui/overlay/dialog'
import { cn } from '@/lib/utils'

export interface DialogProps extends React.ComponentProps<typeof ShadcnDialog> {
  /** Hiển thị nút đóng */
  showCloseButton?: boolean
  /** Kích thước dialog */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Close on outside click */
  closeOnOutsideClick?: boolean
}

const Dialog = ({
  children,
  showCloseButton = true,
  size = 'md',
  closeOnOutsideClick = true,
  ...props
}: DialogProps) => {
  return <ShadcnDialog {...props}>{children}</ShadcnDialog>
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

export interface DialogContentProps extends React.ComponentProps<typeof DialogContent> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  showCloseIcon?: boolean
}

const DialogContentCustom = ({
  children,
  className,
  size = 'md',
  showCloseButton = true,
  showCloseIcon = true,
  ...props
}: DialogContentProps) => {
  return (
    <DialogContent className={cn(sizeClasses[size], className)} {...props}>
      {children}
      {showCloseButton && (
        <button
          type='button'
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'
        >
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </button>
      )}
    </DialogContent>
  )
}

export interface DialogHeaderProps extends React.ComponentProps<typeof DialogHeader> {
  /** Hiển thị divider ở dưới */
  showDivider?: boolean
}

const DialogHeaderCustom = ({ className, showDivider = false, ...props }: DialogHeaderProps) => {
  return (
    <DialogHeader
      className={cn(
        'flex flex-col gap-1.5 text-center sm:text-left',
        showDivider && 'pb-4 border-b',
        className,
      )}
      {...props}
    />
  )
}

export interface DialogTitleProps extends React.ComponentProps<typeof DialogTitle> {
  /** Subtitle hiển thị bên dưới title */
  subtitle?: string
}

const DialogTitleCustom = ({ children, className, subtitle, ...props }: DialogTitleProps) => {
  return (
    <DialogTitle
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
      {subtitle && <p className='text-sm font-normal text-muted-foreground mt-1'>{subtitle}</p>}
    </DialogTitle>
  )
}

const DialogDescriptionCustom = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) => {
  return <DialogDescription className={cn('text-sm text-muted-foreground', className)} {...props} />
}

const DialogTriggerCustom = DialogTrigger

// Confirm Dialog
export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger' | 'warning'
  onConfirm?: () => void
  loading?: boolean
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title = 'Xác nhận',
  description = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  onConfirm,
  loading = false,
}: ConfirmDialogProps) => {
  const buttonType = variant === 'danger' ? 'danger' : 'fill'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentCustom size='sm' showCloseButton={false}>
        <DialogHeaderCustom showDivider>
          <DialogTitleCustom>{title}</DialogTitleCustom>
        </DialogHeaderCustom>
        <div className='py-4'>
          <DialogDescriptionCustom>{description}</DialogDescriptionCustom>
        </div>
        <div className='flex justify-end gap-3 pt-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelText}
          </Button>
          <Button buttonType={buttonType} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </DialogContentCustom>
    </Dialog>
  )
}

// Delete Dialog
export interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  itemName?: string
  onDelete?: () => void
  loading?: boolean
}

const DeleteDialog = ({
  open,
  onOpenChange,
  title = 'Xóa bản ghi',
  description = 'Hành động này không thể hoàn tác.',
  itemName,
  onDelete,
  loading = false,
}: DeleteDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={itemName ? `${description}\n\n"${itemName}"` : description}
      confirmText='Xóa'
      variant='danger'
      onConfirm={onDelete}
      loading={loading}
    />
  )
}

export {
  ConfirmDialog,
  DeleteDialog,
  Dialog,
  DialogContentCustom as DialogContent,
  DialogDescriptionCustom as DialogDescription,
  DialogHeaderCustom as DialogHeader,
  DialogTitleCustom as DialogTitle,
  DialogTriggerCustom as DialogTrigger,
}

// code template
// const [open, setOpen] = useState(false)

// <Dialog open={open} onOpenChange={setOpen}>
//   <DialogTrigger asChild>
//     <Button>Mở Dialog</Button>
//   </DialogTrigger>
//   <DialogContent size="md">
//     <DialogHeader showDivider>
//       <DialogTitle subtitle="Subtitle here">Tiêu đề</DialogTitle>
//       <DialogDescription>Mô tả chi tiết</DialogDescription>
//     </DialogHeader>
//     <div>Nội dung</div>
//   </DialogContent>
// </Dialog>

// Confirm Dialog
// const [confirmOpen, setConfirmOpen] = useState(false)
// <ConfirmDialog
//   open={confirmOpen}
//   onOpenChange={setConfirmOpen}
//   title="Xác nhận xóa"
//   description="Bạn có chắc muốn xóa?"
//   onConfirm={() => handleDelete()}
// />

// Delete Dialog
// const [deleteOpen, setDeleteOpen] = useState(false)
// <DeleteDialog
//   open={deleteOpen}
//   onOpenChange={setDeleteOpen}
//   itemName="Sản phẩm A"
//   onDelete={() => handleDelete()}
// />
