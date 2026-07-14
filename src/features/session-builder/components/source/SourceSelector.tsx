'use client'

import { FileJson, FileText, Library } from 'lucide-react'

interface SourceSelectorProps {
  source: 'system' | 'imported'
  onSourceChange: (source: 'system' | 'imported') => void
}

export function SourceSelector({ source, onSourceChange }: SourceSelectorProps) {
  return (
    <div className='grid gap-3'>
      <button
        type='button'
        onClick={() => onSourceChange('system')}
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
        onClick={() => onSourceChange('imported')}
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
          <p className='mt-0.5 text-sm text-muted-foreground'>Chọn từ bộ câu hỏi đã lưu trước đó</p>
        </div>
      </button>
    </div>
  )
}
