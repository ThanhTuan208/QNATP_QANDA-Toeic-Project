'use client'

import { Database } from 'lucide-react'
import { useEffect } from 'react'
import { StepHeader } from '@/components/common/StepHeader'
import { JsonImportForm, SourceSelector } from '@/features/session-builder/components/source'
import { useStep3Source } from '@/features/session-builder/hooks/useStep3Source'
import type { SessionConfig, SessionQuestion } from '@/features/temp-session/types'

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

  return (
    <div className='space-y-6'>
      <StepHeader
        title='Chọn nguồn câu hỏi'
        description='Chọn cách thức lấy câu hỏi cho bài luyện tập'
        icon={<Database className='w-6 h-6' />}
      />

      <SourceSelector source={source} onSourceChange={handleSelectSource} />

      {source === 'imported' && (
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
  )
}
