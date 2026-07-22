'use client'

import { Copy, Info, Minus, Plus, Sparkles, WandSparkles } from 'lucide-react'
import { Button } from '@/components/common/Button/Button'
import { useAiImportFlow } from '@/features/session-builder/hooks/useAiImportFlow'
import type { SessionConfig } from '@/features/temp-session/types'
import { cn } from '@/lib/utils'

interface AiImportFlowProps {
  config: Partial<SessionConfig>
  onPromptGenerated: (prompt: string) => void
}

const PASSAGE_FORMATS = [
  { id: 'email', label: 'Email' },
  { id: 'memo', label: 'Memo / Notice' },
  { id: 'letter', label: 'Letter' },
  { id: 'article', label: 'Article / Report' },
  { id: 'advertisement', label: 'Advertisement' },
  { id: 'schedule', label: 'Schedule / Itinerary' },
  { id: 'form', label: 'Form / Table' },
  { id: 'text-message', label: 'Text Message / Chat' },
  { id: 'review', label: 'Review / Feedback' },
  { id: 'announcement', label: 'Announcement' },
] as const

const PASSAGE_SET_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  single: { label: 'Single', desc: '1 passage, 2-4 câu', color: 'text-green-teal border-green-teal/30 bg-green-teal-10' },
  double: { label: 'Double', desc: '2 passages, 5-6 câu', color: 'text-steel-blue border-steel-blue/30 bg-steel-blue-10' },
  triple: { label: 'Triple', desc: '3 passages, 8-12 câu', color: 'text-safety-orange border-safety-orange/30 bg-safety-orange-10' },
}

export function AiImportFlow({ config, onPromptGenerated }: AiImportFlowProps) {
  const {
    mode,
    setMode,
    selectedFormats,
    toggleFormat,
    passageSets,
    adjustSet,
    additionalNotes,
    setAdditionalNotes,
    copied,
    handleGenerate,
    handleCopy,
  } = useAiImportFlow({ config, onPromptGenerated })

  if (!mode) {
    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>Chọn cách bạn muốn AI tạo câu hỏi:</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={() => setMode('custom')}
            className='rounded-xl border-2 border-border p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all group'
          >
            <div className='flex items-center gap-3 mb-2'>
              <div className='size-9 rounded-lg bg-amber-10 text-amber flex items-center justify-center group-hover:scale-105 transition-transform'>
                <WandSparkles className='size-4' />
              </div>
              <span className='font-bold text-sm'>Tùy chỉnh</span>
            </div>
            <p className='text-xs text-muted-foreground'>
              Chọn format passage, số lượng từng loại passage set (single/double/triple), và ghi
              chú thêm. AI sẽ tạo theo đúng yêu cầu của bạn.
            </p>
          </button>

          <button
            type='button'
            onClick={() => setMode('random')}
            className='rounded-xl border-2 border-border p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all group'
          >
            <div className='flex items-center gap-3 mb-2'>
              <div className='size-9 rounded-lg bg-purple-10 text-purple flex items-center justify-center group-hover:scale-105 transition-transform'>
                <Sparkles className='size-4' />
              </div>
              <span className='font-bold text-sm'>Ngẫu nhiên</span>
            </div>
            <p className='text-xs text-muted-foreground'>
              Để AI tự chọn format, số lượng passage và nội dung. Phù hợp khi bạn muốn tạo nhanh mà
              không cần tùy chỉnh nhiều.
            </p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium text-foreground'>
          {mode === 'custom' ? 'Tùy chỉnh tạo câu hỏi' : 'Tạo ngẫu nhiên'}
        </p>
        <button
          type='button'
          onClick={() => setMode(null)}
          className='text-xs text-muted-foreground hover:text-foreground transition-colors underline'
        >
          Quay lại
        </button>
      </div>

      {mode === 'custom' && (
        <div className='space-y-4'>
          <div>
            <div className='flex items-center gap-1.5 mb-2'>
              <p className='text-xs font-semibold text-foreground'>Allowed formats</p>
              <span className='group relative inline-flex'>
                <Info className='size-3.5 text-muted-foreground/50 cursor-help' />
                <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 p-2 rounded-lg bg-popover border border-border text-[10px] leading-relaxed text-muted-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10'>
                  Chọn các format passage AI được phép dùng. AI sẽ tự phân bổ format vào các passage set.
                </span>
              </span>
            </div>
            <div className='flex gap-1.5 flex-wrap'>
              {PASSAGE_FORMATS.map((fmt) => {
                const isSelected = selectedFormats.includes(fmt.id)
                return (
                  <button
                    key={fmt.id}
                    type='button'
                    onClick={() => toggleFormat(fmt.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      isSelected
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80',
                    )}
                  >
                    {fmt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className='flex items-center gap-1.5 mb-2'>
              <p className='text-xs font-semibold text-foreground'>Passage sets</p>
              <span className='group relative inline-flex'>
                <Info className='size-3.5 text-muted-foreground/50 cursor-help' />
                <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 p-2 rounded-lg bg-popover border border-border text-[10px] leading-relaxed text-muted-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10'>
                  Mỗi passage set là 1 nhóm passage có liên quan. Single=1 passage, Double=2, Triple=3. AI tự phân bổ format và câu hỏi vào các set.
                </span>
              </span>
            </div>
            <div className='flex flex-wrap gap-2'>
              {(Object.entries(PASSAGE_SET_LABELS) as [string, typeof PASSAGE_SET_LABELS[keyof typeof PASSAGE_SET_LABELS]][]).map(([type, info]) => {
                const value = passageSets[type as keyof typeof passageSets]
                return (
                  <div
                    key={type}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                      value > 0
                        ? info.color
                        : 'border-transparent bg-muted text-muted-foreground',
                    )}
                  >
                    <div className='flex flex-col leading-tight'>
                      <span className='font-semibold'>{info.label}</span>
                      <span className='text-[10px] opacity-60'>{info.desc}</span>
                    </div>
                    <div className='flex items-center gap-1 ml-2'>
                      <button
                        type='button'
                        onClick={() => adjustSet(type as 'single' | 'double' | 'triple', -1)}
                        className='size-5 rounded flex items-center justify-center hover:bg-black/10 transition-colors disabled:opacity-30'
                        disabled={value <= 0}
                      >
                        <Minus className='size-3' />
                      </button>
                      <span className='w-5 text-center font-mono text-sm font-bold'>{value}</span>
                      <button
                        type='button'
                        onClick={() => adjustSet(type as 'single' | 'double' | 'triple', 1)}
                        className='size-5 rounded flex items-center justify-center hover:bg-black/10 transition-colors disabled:opacity-30'
                        disabled={value >= 10}
                      >
                        <Plus className='size-3' />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <p className='text-xs font-semibold text-foreground mb-2'>
              Ghi chú thêm (không bắt buộc)
            </p>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder='VD: Tạo passage về chủ đề công nghệ, khó MEDIUM, có bảng biểu...'
              className='w-full h-20 border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-muted/50 resize-none'
            />
          </div>
        </div>
      )}

      {mode === 'random' && (
        <div className='rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground leading-relaxed'>
          AI sẽ tự động chọn format passage, số lượng passage, và nội dung phù hợp với phần thi
          TOEIC. Câu hỏi sẽ được phân bổ đều theo các part và độ khó bạn đã chọn ở bước trước.
        </div>
      )}

      <div className='flex gap-2'>
        <Button buttonType='fill' onClick={handleGenerate} className='flex-1 sm:flex-none'>
          <WandSparkles className='size-4' />
          Tạo prompt cho AI
        </Button>
        <Button buttonType='outline' onClick={handleCopy} className='flex-1 sm:flex-none'>
          <Copy className='size-4' />
          {copied ? 'Đã copy!' : 'Copy prompt'}
        </Button>
      </div>
    </div>
  )
}
