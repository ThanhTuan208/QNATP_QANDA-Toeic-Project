'use client'

import { useCallback, useMemo, useState } from 'react'
import { IMPORT_TEMPLATE } from '@/features/session-builder/constants/import-template'
import { processImportedSessionJSON } from '@/features/session-builder/utils/validation'
import type { SessionConfig, SessionQuestion } from '@/features/temp-session/types'

export function useStep3Source(
  source: 'system' | 'imported',
  config: Partial<SessionConfig>,
  importJson: string,
  validationErrors: string[],
  onSourceChange: (source: 'system' | 'imported') => void,
  onImportJsonChange: (json: string) => void,
  onValidationErrorsChange: (errors: string[]) => void,
  onQuestionsChange?: (questions: SessionQuestion[]) => void,
) {
  const [localText, setLocalText] = useState(importJson)
  const [isValidating, setIsValidating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const selectedParts = new Set(config.parts ?? [])

  const hasExtraneousParts = useMemo(() => {
    if (!localText.trim()) return false
    try {
      const parsed = JSON.parse(localText)
      const items = Array.isArray(parsed) ? parsed : parsed?.questions
      if (!Array.isArray(items)) return false
      return items.some((q: Record<string, unknown>) => {
        const part = q.part
        return typeof part === 'number' && !selectedParts.has(part)
      })
    } catch {
      return false
    }
  }, [localText, selectedParts])

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
    onQuestionsChange?.(result.questions)

    const countLabel = `${result.questions.length} câu hỏi`
    setSuccessMessage(
      result.warnings.length > 0
        ? `✓ Import thành công ${countLabel} (có cảnh báo)`
        : `✓ Import thành công ${countLabel}`,
    )
    setIsValidating(false)
  }, [localText, onImportJsonChange, onValidationErrorsChange, config, onQuestionsChange])

  const handleResetTemplate = useCallback(() => {
    setLocalText(IMPORT_TEMPLATE)
    onImportJsonChange('')
    onValidationErrorsChange([])
    setSuccessMessage('')
  }, [onImportJsonChange, onValidationErrorsChange])

  const handleClearRemoved = useCallback(() => {
    try {
      const parsed = JSON.parse(localText)
      const isArray = Array.isArray(parsed)
      const items = isArray ? parsed : (parsed as Record<string, unknown>).questions
      if (!Array.isArray(items)) return

      const filtered = items.filter(
        (q: Record<string, unknown>) => typeof q.part === 'number' && selectedParts.has(q.part),
      )

      const newJson = isArray
        ? JSON.stringify(filtered, null, 2)
        : JSON.stringify({ ...(parsed as Record<string, unknown>), questions: filtered }, null, 2)

      handleTextChange(newJson)
    } catch {
      // ignore parse errors
    }
  }, [localText, handleTextChange, selectedParts])

  return {
    localText,
    isValidating,
    successMessage,
    hasExtraneousParts,
    handleSelectSource,
    handleTextChange,
    handleValidate,
    handleResetTemplate,
    handleClearRemoved,
  }
}
