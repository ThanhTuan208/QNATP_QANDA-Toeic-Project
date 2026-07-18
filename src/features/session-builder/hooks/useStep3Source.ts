'use client'

import { useCallback, useMemo, useState } from 'react'
import { IMPORT_TEMPLATE } from '@/features/session-builder/constants/import-template'
import { TutorialPromptForUserCopy } from '@/features/session-builder/utils/prompt-suggest'
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
    const selected = config.difficulty ?? []
    const normSelected = selected.map((d) => d.toUpperCase())
    const levelList = normSelected.join(', ') || 'EASY, MEDIUM, HARD'

    const parts = config.parts ?? []
    const groups = config.knowledgeGroups ?? {}
    const totalQ = config.totalQuestions ?? 0

    const partsLine = parts.length > 0 ? parts.join(', ') : '5, 6, 7'
    const countLines = Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([partNum, typeList]) => {
        const lines = typeList.map((g) => `     - ${g.type}: ${g.count} câu`).join('\n')
        return `   Part ${partNum}:\n${lines}`
      })
      .join('\n')
    const countSection =
      countLines.trim().length > 0
        ? `3. SỐ LƯỢNG CẦN TẠO:\n${countLines}\n   Tổng: ${totalQ} câu\n\n`
        : ''

    const prompt = TutorialPromptForUserCopy(partsLine, countSection, levelList, countLines)
    try {
      const parsed = JSON.parse(IMPORT_TEMPLATE)
      const isArray = Array.isArray(parsed)
      const items = isArray ? parsed : (parsed as Record<string, unknown>).questions
      if (!Array.isArray(items)) {
        setLocalText(IMPORT_TEMPLATE)
        return
      }
      const filtered =
        normSelected.length > 0
          ? items.filter(
              (q: Record<string, unknown>) =>
                typeof q.difficulty === 'string' &&
                normSelected.includes(q.difficulty.toUpperCase()),
            )
          : items
      const result = isArray
        ? filtered
        : { ...(parsed as Record<string, unknown>), _prompt: prompt, questions: filtered }
      setLocalText(JSON.stringify(result, null, 2))
    } catch {
      setLocalText(IMPORT_TEMPLATE)
    }
    onImportJsonChange('')
    onValidationErrorsChange([])
    setSuccessMessage('')
  }, [
    onImportJsonChange,
    onValidationErrorsChange,
    config.difficulty,
    config.parts,
    config.knowledgeGroups,
    config.totalQuestions,
  ])

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
