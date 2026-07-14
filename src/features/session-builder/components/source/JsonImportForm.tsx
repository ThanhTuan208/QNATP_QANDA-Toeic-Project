'use client'

import { Button } from '@/components/common/Button/Button'

interface JsonImportFormProps {
  localText: string
  onTextChange: (value: string) => void
  onValidate: () => void
  onReset: () => void
  isValidating: boolean
  validationErrors: string[]
  successMessage: string
}

export function JsonImportForm({
  localText,
  onTextChange,
  onValidate,
  onReset,
  isValidating,
  validationErrors,
  successMessage,
}: JsonImportFormProps) {
  return (
    <div className='space-y-4'>
      <div>
        <label htmlFor='import-json' className='block text-sm font-medium text-foreground mb-1'>
          Nhập dữ liệu JSON
        </label>
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
          className='w-full h-64 border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-muted/50'
          placeholder='Paste JSON vào đây...'
        />
      </div>

      <div className='flex gap-3'>
        <Button
          buttonType='fill'
          onClick={onValidate}
          disabled={!localText.trim() || isValidating}
          loading={isValidating}
          loadingText='Đang kiểm tra...'
        >
          Xác thực & Sử dụng
        </Button>
        <Button buttonType='outline' onClick={onReset}>
          Đặt lại mẫu
        </Button>
      </div>

      {validationErrors.length > 0 && (
        <div className='bg-error-soft text-error rounded-xl p-4 text-sm border border-error/20 space-y-1'>
          <p className='font-semibold mb-1'>{successMessage ? '⚠️ Cảnh báo' : '❌ Lỗi xác thực'}</p>
          {validationErrors.map((err) => (
            <p key={err} className='text-xs'>
              {err}
            </p>
          ))}
        </div>
      )}

      {successMessage && !validationErrors.length && (
        <div className='bg-success-soft text-success rounded-xl p-3 text-sm border border-success/20'>
          {successMessage}
        </div>
      )}
    </div>
  )
}
