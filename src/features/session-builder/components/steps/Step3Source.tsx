'use client'

import { Database, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { StepHeader } from '@/components/common/StepHeader'
import {
  AiImportFlow,
  JsonImportForm,
  SourceSelector,
} from '@/features/session-builder/components/source'
import { useStep3Source } from '@/features/session-builder/hooks/useStep3Source'
import type { SessionConfig, SessionQuestion } from '@/features/temp-session/types'
import { cn } from '@/lib/utils'

interface Step3SourceProps {
  source: 'system' | 'imported'
  config: Partial<SessionConfig>
  importJson: string
  validationErrors: string[]
  onSourceChange: (source: 'system' | 'imported') => void
  onImportJsonChange: (json: string) => void
  onValidationErrorsChange: (errors: string[]) => void
  onQuestionsChange?: (questions: SessionQuestion[]) => void
}

type ImportTab = 'json' | 'ai'

export function Step3Source({
  source,
  config,
  importJson,
  validationErrors,
  onSourceChange,
  onImportJsonChange,
  onValidationErrorsChange,
  onQuestionsChange,
}: Step3SourceProps) {
  const [importTab, setImportTab] = useState<ImportTab>('json')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const {
    localText,
    isValidating,
    successMessage,
    hasExtraneousParts,
    handleSelectSource,
    handleTextChange,
    handleValidate,
    handleResetTemplate,
    handleClearRemoved,
  } = useStep3Source(
    source,
    config,
    importJson,
    validationErrors,
    onSourceChange,
    onImportJsonChange,
    onValidationErrorsChange,
    onQuestionsChange,
  )

  const handlePromptGenerated = (prompt: string) => {
    onImportJsonChange('')
    onValidationErrorsChange([])
    handleTextChange(`/* 
=== PROMPT CHO AI (Gemini/Claude...) ===
Copy đoạn dưới đây và gửi cho AI, sau đó paste JSON kết quả vào textarea bên dưới.

${prompt}
*/\n\n`)
  }

  return (
    <div className='space-y-6'>
      <StepHeader
        title='Chọn nguồn câu hỏi'
        description='Chọn cách thức lấy câu hỏi cho bài luyện tập'
        icon={<Database className='w-6 h-6' />}
      />

      <SourceSelector source={source} onSourceChange={handleSelectSource} />

      {source === 'imported' && (
        <div className='space-y-4'>
          <div className='flex gap-1 p-1 rounded-lg bg-muted w-fit'>
            <button
              type='button'
              onClick={() => setImportTab('json')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                importTab === 'json'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Import JSON
            </button>
            <button
              type='button'
              onClick={() => setImportTab('ai')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5',
                importTab === 'ai'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Sparkles className='size-3.5' />
              Tạo với AI
            </button>
          </div>

          {importTab === 'ai' ? (
            <AiImportFlow config={config} onPromptGenerated={handlePromptGenerated} />
          ) : (
            <JsonImportForm
              localText={localText}
              onTextChange={handleTextChange}
              onValidate={handleValidate}
              onReset={handleResetTemplate}
              onClearRemoved={handleClearRemoved}
              hasExtraneousParts={hasExtraneousParts}
              isValidating={isValidating}
              validationErrors={validationErrors}
              successMessage={successMessage}
            />
          )}
        </div>
      )}
    </div>
  )
}
