'use client'

import { useState } from 'react'
import { Button } from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog'
import { Label } from '@/components/common/Label'

interface QuestionImport {
  question: string
  type: string
  difficulty: string
  options: {
    text: string
    isCorrect: boolean
    rationale: string
  }[]
  hint?: string
}

export function JsonImporter() {
  const [open, setOpen] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [status, setStatus] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  function handleLoad() {
    if (!jsonInput.trim()) {
      setStatus({
        message: 'Vui lòng paste JSON vào ô bên trên.',
        type: 'error',
      })
      return
    }
    try {
      const data = JSON.parse(jsonInput) as QuestionImport[]
      if (!Array.isArray(data)) throw new Error('Phải là một array')
      if (data.length === 0) throw new Error('Array rỗng')
      setStatus({
        message: `Đã parse ${data.length} câu hỏi.`,
        type: 'success',
      })
    } catch (e) {
      setStatus({
        message: `Lỗi parse JSON: ${e instanceof Error ? e.message : 'Invalid'}`,
        type: 'error',
      })
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setJsonInput(text)
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type='button'
          className='fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-xl hover:opacity-90 transition-all flex items-center justify-center text-2xl'
          title='Import JSON'
        >
          <span>+</span>
        </button>
      </DialogTrigger>
      <DialogContent size='lg' className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle subtitle='Paste JSON array theo format chuẩn'>
            Import câu hỏi (JSON)
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className='w-full h-64 border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='[{ "question": "...", "options": [...], "hint": "..." }]'
          />
          <div className='flex gap-3'>
            <Button
              onClick={handleLoad}
              className='flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90'
            >
              Load câu hỏi
            </Button>
            <Label className='bg-muted text-muted-foreground px-6 py-3 rounded-xl font-bold hover:bg-neutral-5 cursor-pointer text-center'>
              Chọn file .json
              <input type='file' accept='.json' className='hidden' onChange={handleFileSelect} />
            </Label>
          </div>
          {status && (
            <div
              className={`p-3 rounded-xl text-sm ${
                status.type === 'success'
                  ? 'bg-green-teal-10 text-green-dark border border-green-teal-20'
                  : status.type === 'error'
                    ? 'bg-error-soft text-error border border-error/20'
                    : 'bg-safety-orange-10 text-safety-orange border border-safety-orange-20'
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
