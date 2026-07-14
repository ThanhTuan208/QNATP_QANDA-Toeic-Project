'use client'

import { useCallback, useState } from 'react'
import { JsonImportForm, SourceSelector } from '@/features/session-builder/components/source'
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

  const handleTextChange = useCallback(
    (value: string) => {
      setLocalText(value)
      onImportJsonChange('')
      onValidationErrorsChange([])
      setSuccessMessage('')
    },
    [onImportJsonChange, onValidationErrorsChange],
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

      <SourceSelector source={source} onSourceChange={handleSelectSource} />

      {source === 'imported' && (
        <JsonImportForm
          localText={localText}
          onTextChange={handleTextChange}
          onValidate={handleValidate}
          onReset={handleResetTemplate}
          isValidating={isValidating}
          validationErrors={validationErrors}
          successMessage={successMessage}
        />
      )}
    </div>
  )
}
