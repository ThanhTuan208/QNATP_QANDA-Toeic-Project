'use client'

import { useCallback, useState } from 'react'
import type { Question } from '@/features/quiz/types'
import {
  generatePrompt,
  generateTemplate,
  parseImportedJSON,
} from '@/features/quiz/utils/quiz.utils'

interface UseQuizImportOptions {
  type?: string
  onImportQuestions: (questions: Question[]) => void
}

interface UseQuizImportReturn {
  showImport: boolean
  importJson: string
  importError: string
  promptText: string
  openImport: () => void
  submitImport: () => void
  setImportJson: (value: string) => void
  closeImport: () => void
}

export function useQuizImport(options: UseQuizImportOptions): UseQuizImportReturn {
  const [showImport, setShowImport] = useState(false)
  const [importJson, setImportJson] = useState('')
  const [importError, setImportError] = useState('')
  const [promptText, setPromptText] = useState('')

  const openImport = useCallback(() => {
    const currentType = options.type ?? 'word-form'
    setImportJson(generateTemplate(currentType))
    setPromptText(generatePrompt(currentType))
    setImportError('')
    setShowImport(true)
  }, [options.type])

  const submitImport = useCallback(() => {
    setImportError('')
    try {
      const parsed = parseImportedJSON(importJson, options.type ?? 'word-form')
      if (parsed.length === 0) {
        setImportError('Không tìm thấy câu hỏi nào trong dữ liệu.')
        return
      }
      options.onImportQuestions(parsed)
      setShowImport(false)
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Lỗi parse JSON')
    }
  }, [importJson, options.type, options.onImportQuestions])

  const closeImport = useCallback(() => {
    setShowImport(false)
  }, [])

  return {
    showImport,
    importJson,
    importError,
    promptText,
    openImport,
    submitImport,
    setImportJson,
    closeImport,
  }
}
