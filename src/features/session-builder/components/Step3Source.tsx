'use client'

import { FileJson, FileText, Library, Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { IMPORT_TEMPLATE } from '@/features/session-builder/constants/import-template'
import { processImportedSessionJSON } from '@/features/session-builder/utils/validation'
import type { SessionConfig } from '@/features/temp-session/types'

interface Step3SourceProps {
  source: 'system' | 'imported'
  config: Partial<SessionConfig>
  importJson: string
  validationErrors: string[]
  onSourceChange: (source: 'system' | 'imported') => void
  onImportJsonChange: (json: string) => void
  onValidationErrorsChange: (errors: string[]) => void
}

export function Step3Source({
  source,
  config,
  importJson,
  validationErrors,
  onSourceChange,
  onImportJsonChange,
  onValidationErrorsChange,
}: Step3SourceProps) {
  const [localText, setLocalText] = useState(importJson)
  const [isValidating, setIsValidating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSelectSource = useCallback(
    (newSource: 'system' | 'imported') => {
      onSourceChange(newSource)
      if (newSource === 'system') {
        setSuccessMessage('')
      }
    },
    [onSourceChange],
  )

  const handleValidate = useCallback(() => {
    setIsValidating(true)
    setSuccessMessage('')

    const result = processImportedSessionJSON(localText, config)

    if (!result.success) {
      onImportJsonChange('')
      onValidationErrorsChange(result.errors)
      setIsValidating(false)
      return
    }

    onImportJsonChange(result.importJson)
    onValidationErrorsChange(result.warnings)

    const countLabel = `${result.questions.length} câu hỏi`
    setSuccessMessage(
      result.warnings.length > 0
        ? `✓ Import thành công ${countLabel} (có cảnh báo)`
        : `✓ Import thành công ${countLabel}`,
    )
    setIsValidating(false)
  }, [localText, onImportJsonChange, onValidationErrorsChange, config])

  const handleResetTemplate = useCallback(() => {
    setLocalText(IMPORT_TEMPLATE)
    onImportJsonChange('')
    onValidationErrorsChange([])
    setSuccessMessage('')
  }, [onImportJsonChange, onValidationErrorsChange])

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-bold text-foreground mb-1'>Chọn nguồn câu hỏi</h3>
        <p className='text-sm text-muted-foreground'>
          Chọn cách thức lấy câu hỏi cho bài luyện tập
        </p>
      </div>

      <div className='grid gap-3'>
        <button
          type='button'
          onClick={() => handleSelectSource('system')}
          className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
            source === 'system'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-steel-blue-10 text-steel-blue'>
            <FileText className='size-5' />
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-foreground'>System Bank</span>
              <span className='rounded-full bg-steel-blue-10 px-2 py-0.5 text-xs font-medium text-steel-blue'>
                Mặc định
              </span>
            </div>
            <p className='mt-0.5 text-sm text-muted-foreground'>
              Sử dụng ngân hàng câu hỏi có sẵn trong hệ thống
            </p>
          </div>
          <div
            className={`mt-1 size-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
              source === 'system' ? 'border-primary' : 'border-muted-foreground'
            }`}
          >
            {source === 'system' && <div className='size-2.5 rounded-full bg-primary' />}
          </div>
        </button>

        <button
          type='button'
          onClick={() => handleSelectSource('imported')}
          className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
            source === 'imported'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-10 text-amber'>
            <FileJson className='size-5' />
          </div>
          <div className='flex-1'>
            <span className='font-bold text-foreground'>Practice Now</span>
            <p className='mt-0.5 text-sm text-muted-foreground'>
              Tự nhập câu hỏi bằng JSON (dùng cho AI sinh câu hỏi)
            </p>
          </div>
          <div
            className={`mt-1 size-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
              source === 'imported' ? 'border-primary' : 'border-muted-foreground'
            }`}
          >
            {source === 'imported' && <div className='size-2.5 rounded-full bg-primary' />}
          </div>
        </button>

        <button
          type='button'
          disabled
          className='flex items-start gap-4 rounded-xl border-2 border-border p-4 text-left opacity-50 cursor-not-allowed'
        >
          <div className='mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
            <Library className='size-5' />
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-muted-foreground'>My Library</span>
              <span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
                Coming soon
              </span>
            </div>
            <p className='mt-0.5 text-sm text-muted-foreground'>
              Chọn từ bộ câu hỏi đã lưu trước đó
            </p>
          </div>
        </button>
      </div>

      {source === 'imported' && (
        <div className='space-y-4'>
          <div>
            <label htmlFor='import-json' className='block text-sm font-medium text-foreground mb-1'>
              Nhập dữ liệu JSON
            </label>
            <p className='text-xs text-muted-foreground mb-3'>
              Paste JSON array of questions hoặc object có trường &quot;questions&quot;. Click
              &quot;Đặt lại mẫu&quot; để xem format.
            </p>
            <textarea
              id='import-json'
              value={localText}
              onChange={(e) => {
                setLocalText(e.target.value)
                onImportJsonChange('')
                onValidationErrorsChange([])
                setSuccessMessage('')
              }}
              className='w-full h-64 border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-muted/50'
              placeholder='Paste JSON vào đây...'
            />
          </div>

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={handleValidate}
              disabled={!localText.trim() || isValidating}
              className='flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isValidating ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  Đang kiểm tra...
                </>
              ) : (
                'Xác thực & Sử dụng'
              )}
            </button>
            <button
              type='button'
              onClick={handleResetTemplate}
              className='bg-muted text-muted-foreground px-6 py-3 rounded-xl font-bold hover:bg-neutral-5 transition-all'
            >
              Đặt lại mẫu
            </button>
          </div>

          {validationErrors.length > 0 && (
            <div className='bg-error-soft text-error rounded-xl p-4 text-sm border border-error/20 space-y-1'>
              <p className='font-semibold mb-1'>
                {successMessage ? '⚠️ Cảnh báo' : '❌ Lỗi xác thực'}
              </p>
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
      )}
    </div>
  )
}
