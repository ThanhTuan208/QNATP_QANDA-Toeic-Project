'use client'

import { HelpCircle, X } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlay/dialog'
import { IMPORT_SCHEMA_FIELDS } from '@/features/session-builder/constants'

export function JsonSchemaHelp() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary-teal transition-colors'
        title='Xem hướng dẫn định dạng JSON'
      >
        <HelpCircle className='size-3.5' />
      </button>
      <DialogContent
        className='sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-2xl border border-border bg-background shadow-xl [&::-webkit-scrollbar]:hidden'
        showCloseButton={false}
      >
        <DialogHeader className='sticky top-0 z-10 bg-card border-b border-border px-6 py-4 rounded-t-2xl'>
          <div className='flex items-center justify-between'>
            <DialogTitle className='text-base font-bold text-foreground'>
              Hướng dẫn định dạng JSON
            </DialogTitle>
            <button
              type='button'
              onClick={() => setOpen(false)}
              className='rounded-full p-1 hover:bg-muted transition-colors'
            >
              <X className='size-4' />
            </button>
          </div>
        </DialogHeader>

        <div className='p-6 space-y-5'>
          <div className='space-y-1'>
            <h3 className='text-sm font-bold text-primary-teal dark:text-pale-light'>
              Học kiến thức IT cùng cậu em dev 🧑‍💻
            </h3>
            <p className='text-xs md:text-sm text-subtext-90 dark:text-neutral-30 leading-relaxed opacity-80'>
              Vui lòng chuẩn bị file dữ liệu khớp chính xác với các thuộc tính bên dưới để hệ thống phân tách và import câu hỏi tự động.
            </p>
          </div>

          <div className='space-y-0.5'>
            {IMPORT_SCHEMA_FIELDS.map((field) => (
              <div
                key={field.key}
                className='grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-x-4 gap-y-1 sm:gap-y-0.5 py-2.5 border-b border-border/40 last:border-0 text-sm'
              >
                <div>
                  <code className='text-xs font-semibold text-primary-teal dark:text-pale-teal bg-primary-teal/5 dark:bg-pale-teal/10 px-1.5 py-0.5 rounded'>
                    {field.key}
                  </code>
                  <span className='ml-1.5 text-[10px] text-muted-foreground'>{field.type}</span>
                  {field.required && (
                    <span className='ml-1 text-[10px] text-error'>*bắt buộc</span>
                  )}
                </div>
                <div className='space-y-0.5'>
                  <p className='text-xs text-foreground leading-relaxed'>{field.desc}</p>
                  <p className='text-[11px] text-muted-foreground font-mono'>{field.values}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200/40 dark:border-amber-700/30 rounded-xl p-3.5 text-xs text-amber-800 dark:text-amber-200 space-y-1'>
            <p className='font-semibold'>⚠️ Lưu ý quan trọng:</p>
            <ul className='list-disc list-inside space-y-0.5 opacity-80'>
              <li>File JSON có thể là một mảng các câu hỏi, hoặc một đối tượng có trường <code className='text-xs font-mono'>questions</code> chứa mảng câu hỏi.</li>
              <li>Độ khó của câu hỏi nên đặt theo đúng level bạn đã chọn ở bước trước, nếu không câu hỏi sẽ bị loại hoặc báo lỗi.</li>
              <li>Mỗi câu chỉ có duy nhất một đáp án đúng. Hãy đảm bảo chỉ một lựa chọn có <code className='text-xs font-mono'>isCorrect: true</code> hoặc <code className='text-xs font-mono'>correctOptionId</code> trỏ đúng.</li>
              <li>Các trường không nằm trong danh sách trên (ví dụ <code className='text-xs font-mono'>_prompt</code>) sẽ được bỏ qua khi xử lý.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
