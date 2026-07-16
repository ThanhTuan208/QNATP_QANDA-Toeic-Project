'use client'

import { Label } from '@/components/common/Label'
import { generatePrompt, generateTemplate } from '@/features/quiz/utils/quiz.utils'

interface ImportDialogProps {
  type: string
  importJson: string
  importError: string
  onImportJsonChange: (value: string) => void
  onSubmitImport: () => void
  onClose: () => void
}

export function ImportDialog({
  type,
  importJson,
  importError,
  onImportJsonChange,
  onSubmitImport,
  onClose,
}: ImportDialogProps) {
  const promptText = generatePrompt(type)

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-100/40 backdrop-blur-sm'>
      <div className='bg-card w-full max-w-2xl rounded-2xl border border-border shadow-lg mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold text-foreground'>Tự nhập câu hỏi</h2>
            <button
              type='button'
              onClick={onClose}
              className='text-muted-foreground hover:text-foreground text-xl leading-none'
            >
              ✕
            </button>
          </div>

          <div className='bg-steel-blue-10 border border-steel-blue-20 rounded-xl p-4 text-sm space-y-2'>
            <p className='font-semibold text-steel-blue'>🤖 Dùng AI để tạo câu hỏi</p>
            <p className='text-muted-foreground'>
              Copy prompt bên dưới, paste vào ChatGPT, Claude hoặc Gemini để AI sinh câu hỏi TOEIC
              Part 5 dạng này. Sau đó paste kết quả JSON vào ô bên dưới.
            </p>
            <pre className='bg-muted rounded-xl p-4 text-xs text-left whitespace-pre-wrap select-all cursor-pointer border border-border'>
              {promptText}
            </pre>
            <p className='text-xs text-muted-foreground'>
              Click vào prompt để copy (Ctrl+C / Cmd+C).
            </p>
          </div>

          <div>
            <Label htmlFor='import-json' className='block text-sm font-medium text-foreground mb-1'>
              Template JSON
            </Label>
            <textarea
              id='import-json'
              value={importJson}
              onChange={(e) => onImportJsonChange(e.target.value)}
              className='w-full h-64 border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-muted/50'
              placeholder='Paste JSON vào đây...'
            />
          </div>

          {importError && (
            <div className='bg-error-soft text-error rounded-xl p-3 text-sm border border-error/20'>
              {importError}
            </div>
          )}

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={onSubmitImport}
              className='flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all'
            >
              Sử dụng câu hỏi này
            </button>
            <button
              type='button'
              onClick={() => onImportJsonChange(generateTemplate(type))}
              className='bg-muted text-muted-foreground px-6 py-3 rounded-xl font-bold hover:bg-neutral-5 transition-all'
            >
              Đặt lại mẫu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
