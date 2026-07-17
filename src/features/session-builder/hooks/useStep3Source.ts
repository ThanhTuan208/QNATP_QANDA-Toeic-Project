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

    const prompt = `___ HƯỚNG DẪN CHO AI ___

Bạn là chuyên gia ra đề thi TOEIC Reading. Hãy tạo câu hỏi theo các yêu cầu sau:

1. PART CẦN TẠO: ${partsLine}

2. CẤU TRÚC JSON: Mỗi câu hỏi là một object với các trường sau:
   - "part": số phần (5, 6, hoặc 7)
   - "type": loại câu hỏi
   - "difficulty": độ khó (${levelList})
   - "questionText": nội dung câu hỏi (tiếng Anh)
    - "options": mảng 4 đối tượng, mỗi đối tượng có:
        • "id": ký tự A, B, C, hoặc D
        • "text": nội dung lựa chọn (tiếng Anh)
        • "order": số thứ tự 1-4
        • "isCorrect": true nếu là đáp án đúng, false nếu sai
        • "rationale": giải thích bằng tiếng Việt (2-3 câu) tại sao đáp án này đúng hoặc sai
    - "correctOptionId": id của đáp án đúng (ví dụ: "A")

${countSection}4. YÊU CẦU CHI TIẾT THEO TỪNG PART:

   PART 5 (Incomplete Sentences) - câu điền từ, mỗi câu có 1 chỗ trống "______":
   - "word-form": Chọn dạng đúng của từ (danh từ, động từ, tính từ, trạng từ). Ví dụ: "implement" vs "implementation" vs "implemented"
   - "comparison": So sánh hơn/kém với tính từ/trạng từ. Ví dụ: "more efficient than", "the best"
   - "vocabulary": Chọn từ vựng/collocation đúng. Ví dụ: "launch a product", "attend a meeting"
   - "verb-tense": Chọn thì đúng của động từ. Ví dụ: "has completed", "was developed"
   - "preposition": Chọn giới từ đúng. Ví dụ: "depend on", "responsible for", "interested in"
   - "conjunction": Chọn liên từ/từ nối đúng. Ví dụ: "however", "therefore", "in addition"
   - "participle": Chọn phân từ V-ing hoặc V3. Ví dụ: "the manager approving..." vs "the proposal approved..."
   - "voice": Câu bị động/causative. Ví dụ: "was notified", "had the report reviewed"
   - "relative-clause": Mệnh đề quan hệ. Ví dụ: "the consultant whom we hired"
   - "agreement": Hòa hợp chủ ngữ-động từ. Ví dụ: "Each employee is...", "The team has..."

   PART 6 (Text Completion) - questionText phải bao gồm CẢ đoạn văn (2-3 câu), có chỗ trống "______" ở vị trí cần điền, và câu hỏi. Ví dụ:
   "questionText": "Dear employees, the annual company picnic has been scheduled for next Saturday. ______ Please bring your own refreshments.\n\nWhat word best fits the blank?"
   - "sentence-insertion": Chọn câu thích hợp để điền vào chỗ trống giữa đoạn
   - "grammar": Chọn cấu trúc ngữ pháp đúng trong ngữ cảnh đoạn văn
   - "vocabulary": Chọn từ vựng phù hợp với ngữ cảnh đoạn văn

   PART 7 (Reading Comprehension) - questionText phải bao gồm CẢ đoạn văn (email, thông báo, bài báo ngắn) lẫn câu hỏi, cách nhau bởi "\\n\\n". Ví dụ:
   "questionText": "Memo from HR:\\nAll employees are reminded that the annual health insurance enrollment period ends on November 30.\\n\\nWhat is the main purpose of this memo?"
   - "single-passage": Câu hỏi về một đoạn văn
   - "double-passage": Câu hỏi về hai đoạn văn liên quan (cả 2 đoạn trong questionText)
   - "triple-passage": Câu hỏi về ba đoạn văn liên quan (cả 3 đoạn trong questionText)

5. ĐỘ KHÓ YÊU CẦU: ${levelList}
   Trường "difficulty" của mỗi câu phải là một trong các giá trị: ${levelList}.

6. YÊU CẦU KHÁC:
   - Đúng 1 đáp án đúng duy nhất (isCorrect: true)
   - Các đáp án sai (distractors) phải hợp lý, dễ gây nhầm lẫn
   - Mỗi option phải có "rationale": giải thích bằng tiếng Việt (2-3 câu) nêu rõ quy tắc ngữ pháp/ngữ nghĩa, giải thích tại sao đáp án đó đúng hoặc sai
   - KHÔNG thêm text nào khác ngoài JSON (không markdown, không code block)${countLines.trim().length > 0 ? '\n   - Đảm bảo đúng số lượng câu hỏi cho mỗi part/type như yêu cầu ở mục 3' : ''}`

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
