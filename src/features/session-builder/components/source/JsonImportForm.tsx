'use client'

import { AlertTriangle, CheckCircle2, Eraser, XCircle } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'
import { Label } from '@/components/common/Label'
import { JsonSchemaHelp } from '@/features/session-builder/components/source/JsonSchemaHelp'

interface JsonImportFormProps {
  localText: string
  onTextChange: (value: string) => void
  onValidate: () => void
  onReset: () => void
  onClearRemoved?: () => void
  hasExtraneousParts?: boolean
  isValidating: boolean
  validationErrors: string[]
  successMessage: string
}

export function JsonImportForm({
  localText,
  onTextChange,
  onValidate,
  onReset,
  onClearRemoved,
  hasExtraneousParts = false,
  isValidating,
  validationErrors,
  successMessage,
}: JsonImportFormProps) {
  return (
    <div className='space-y-4'>
      <div>
        <div className='flex items-center gap-1.5 mb-1'>
          <Label htmlFor='import-json' className='text-sm font-medium text-foreground'>
            Nhập dữ liệu JSON
          </Label>
          <JsonSchemaHelp />
        </div>
        <p className='text-xs text-muted-foreground mb-3'>
          Paste JSON array of questions hoặc object có trường &quot;questions&quot;. Click &quot;Đặt
          lại mẫu&quot; để xem format.
        </p>
        <textarea
          id='import-json'
          value={localText}
          onChange={(e) => {
            onTextChange(e.target.value)
          }}
          className='w-full h-40 sm:h-52 md:h-64 border border-border rounded-xl p-3 sm:p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-muted/50'
          placeholder='Paste JSON vào đây...'
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
        <Button
          buttonType='fill'
          onClick={onValidate}
          disabled={!localText.trim() || isValidating}
          loading={isValidating}
          loadingText='Đang kiểm tra...'
          className='w-full sm:w-auto'
        >
          Xác thực & Sử dụng
        </Button>
        <Button buttonType='outline' onClick={onReset} className='w-full sm:w-auto'>
          Đặt lại mẫu
        </Button>
        <div className='sm:ml-auto'>
          <Button
            buttonType='outline'
            icon={<Eraser className='size-4' />}
            onClick={onClearRemoved}
            disabled={!hasExtraneousParts}
            className='w-full sm:w-auto'
          >
            Xóa part đã hủy
          </Button>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className='bg-error-soft/20 rounded-xl border border-error/20 p-4 space-y-2'>
          <div className='flex items-start gap-2.5'>
            <div className='mt-0.5 shrink-0'>
              {successMessage ? (
                <AlertTriangle className='size-4 text-warning' />
              ) : (
                <XCircle className='size-4 text-error' />
              )}
            </div>
            <div className='space-y-1.5 min-w-0'>
              <p className='text-sm font-semibold text-error'>
                {successMessage ? 'Import có cảnh báo' : 'Lỗi xác thực'}
              </p>
              {validationErrors.map((err) => (
                <p key={err} className='text-sm text-error/80 leading-relaxed'>
                  {err}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {successMessage && !validationErrors.length && (
        <div className='bg-success-soft rounded-xl border border-success/20 p-4'>
          <div className='flex items-start gap-2.5'>
            <CheckCircle2 className='size-4 text-success shrink-0 mt-0.5' />
            <p className='text-sm font-medium text-success'>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}
