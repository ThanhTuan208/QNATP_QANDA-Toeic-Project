import type { ValidationResult } from '@/features/session-builder/types'
import type {
  ContentBlock,
  KnowledgeGroupConfig,
  SessionConfig,
  SessionPassage,
  SessionQuestion,
} from '@/features/temp-session/types'

export interface ParseResult {
  questions: SessionQuestion[]
  errors: ParseError[]
}

export interface ParseError {
  index: number
  message: string
}

function isValidPart(part: unknown): part is number {
  return typeof part === 'number' && [5, 6, 7].includes(part)
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

interface RawOption {
  id?: unknown
  text?: unknown
  order?: unknown
  isCorrect?: unknown
  rationale?: unknown
}

function isValidOption(value: unknown): value is RawOption {
  if (typeof value !== 'object' || value === null) return false
  const opt = value as Record<string, unknown>
  return isValidString(opt.id) && isValidString(opt.text) && typeof opt.order === 'number'
}

function isValidContentBlock(value: unknown): value is ContentBlock {
  if (typeof value !== 'object' || value === null) return false
  const block = value as Record<string, unknown>
  if (block.type === 'blank') return true
  if (block.type === 'text' && isValidString(block.value)) return true
  if (block.type === 'image' && isValidString(block.value)) return true
  return false
}

function isValidPassage(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  if (!Array.isArray(p.content) || p.content.length === 0) return false
  for (const block of p.content) {
    if (!isValidContentBlock(block)) return false
  }
  return true
}

function contentBlocksToString(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === 'blank') return '______'
      if (b.type === 'image') return `[Image: ${b.value ?? ''}]`
      return b.value ?? ''
    })
    .join(' ')
}

function rawPassageToSessionPassage(
  raw: Record<string, unknown>,
  index: number,
  passageType?: unknown,
): SessionPassage | undefined {
  if (!Array.isArray(raw.content) || raw.content.length === 0) return undefined
  for (const block of raw.content) {
    if (!isValidContentBlock(block)) return undefined
  }
  const blocks = raw.content as ContentBlock[]
  return {
    id: isValidString(raw.id) ? String(raw.id) : `p_${index}`,
    title: isValidString(raw.title) ? String(raw.title) : undefined,
    content: contentBlocksToString(blocks),
    contentBlocks: blocks,
    passageFormat: isValidString(passageType) ? String(passageType) : undefined,
    order: typeof raw.order === 'number' ? raw.order : undefined,
  }
}

export function parseImportedSessionJSON(raw: string): ParseResult {
  const errors: ParseError[] = []
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    return {
      questions: [],
      errors: [{ index: -1, message: 'JSON không hợp lệ. Vui lòng kiểm tra cú pháp.' }],
    }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return {
      questions: [],
      errors: [{ index: -1, message: 'Dữ liệu phải là một object.' }],
    }
  }

  const root = parsed as Record<string, unknown>

  // Parse root-level passages map (new format)
  const passagesMap = new Map<string, SessionPassage[]>()
  const rawPassages = root.passages
  if (typeof rawPassages === 'object' && rawPassages !== null && !Array.isArray(rawPassages)) {
    for (const [groupId, groupPassages] of Object.entries(rawPassages as Record<string, unknown>)) {
      if (Array.isArray(groupPassages)) {
        const parsedGroup: SessionPassage[] = []
        for (let pIdx = 0; pIdx < groupPassages.length; pIdx++) {
          const rawP = groupPassages[pIdx] as Record<string, unknown>
          if (typeof rawP === 'object' && rawP !== null) {
            const sp = rawPassageToSessionPassage(rawP, pIdx)
            if (sp) parsedGroup.push(sp)
          }
        }
        if (parsedGroup.length > 0) {
          passagesMap.set(groupId, parsedGroup)
        }
      }
    }
  }

  // Parse questions array
  let items: unknown[] = []

  if (Array.isArray(parsed)) {
    items = parsed
  } else if (Array.isArray(root.questions)) {
    items = root.questions
  } else {
    return {
      questions: [],
      errors: [{ index: -1, message: 'Dữ liệu phải chứa trường "questions" là một array.' }],
    }
  }

  if (items.length === 0) {
    return {
      questions: [],
      errors: [{ index: -1, message: 'Không có câu hỏi nào trong dữ liệu.' }],
    }
  }

  const questions: SessionQuestion[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown> | undefined

    if (typeof item !== 'object' || item === null) {
      errors.push({ index: i, message: `Câu ${i + 1}: dữ liệu không hợp lệ.` })
      continue
    }

    const part = item.part
    if (!isValidPart(part)) {
      errors.push({ index: i, message: `Câu ${i + 1}: "part" phải là 5, 6 hoặc 7.` })
      continue
    }

    if (!isValidString(item.type)) {
      errors.push({ index: i, message: `Câu ${i + 1}: thiếu "type".` })
      continue
    }

    if (!isValidString(item.questionText)) {
      errors.push({ index: i, message: `Câu ${i + 1}: thiếu "questionText".` })
      continue
    }

    if (!item.difficulty) {
      errors.push({ index: i, message: `Câu ${i + 1}: thiếu "difficulty".` })
      continue
    }

    const rawOptions = item.options
    if (!Array.isArray(rawOptions) || rawOptions.length < 2) {
      errors.push({
        index: i,
        message: `Câu ${i + 1}: "options" phải là array có ít nhất 2 lựa chọn.`,
      })
      continue
    }

    const options: SessionQuestion['options'] = []
    let hasCorrectOption = false

    for (let j = 0; j < rawOptions.length; j++) {
      if (!isValidOption(rawOptions[j])) {
        errors.push({
          index: i,
          message: `Câu ${i + 1}: option ${j + 1} thiếu "id", "text" hoặc "order".`,
        })
        continue
      }
      const rOpt = rawOptions[j] as RawOption
      options.push({
        id: String(rOpt.id),
        text: String(rOpt.text),
        order: Number(rOpt.order),
        isCorrect: Boolean(rOpt.isCorrect),
        rationale: isValidString(rOpt.rationale) ? String(rOpt.rationale) : '',
      })
      if (rOpt.isCorrect) hasCorrectOption = true
    }

    if (!hasCorrectOption) {
      errors.push({
        index: i,
        message: `Câu ${i + 1}: không có đáp án đúng (isCorrect = true) nào trong options.`,
      })
      continue
    }

    const correctOptionId = isValidString(item.correctOptionId)
      ? String(item.correctOptionId)
      : (options.find((o) => o.isCorrect)?.id ?? '')

    if (!correctOptionId) {
      errors.push({ index: i, message: `Câu ${i + 1}: thiếu "correctOptionId".` })
      continue
    }

    // Resolve passage data
    let passageData: SessionQuestion['passage'] | undefined
    const passageGroupId = isValidString(item.passageGroupId) ? String(item.passageGroupId) : undefined
    const passageId = isValidString(item.passageId) ? String(item.passageId) : undefined

    let allPassagesData: SessionQuestion['passages'] | undefined

    if (passageGroupId && passagesMap.has(passageGroupId)) {
      // New format: look up from root-level passages map
      const groupPassages = passagesMap.get(passageGroupId)!
      allPassagesData = groupPassages
      const matched = passageId
        ? groupPassages.find((p) => p.id === passageId)
        : groupPassages[0]
      if (matched) {
        passageData = matched
      }
    } else {
      // Backward compat: parse inline passages array or passageText
      const rawInlinePassages = item.passages
      if (Array.isArray(rawInlinePassages) && rawInlinePassages.length > 0) {
        const firstP = rawInlinePassages[0] as Record<string, unknown>
        if (typeof firstP === 'object' && firstP !== null) {
          passageData = rawPassageToSessionPassage(firstP, i, item.passageType)
        }
      } else if (isValidString(item.passageText)) {
        passageData = {
          id: `p_${i}`,
          content: String(item.passageText),
          passageFormat: isValidString(item.passageType) ? String(item.passageType) : undefined,
        }
      }
    }

    questions.push({
      tempId: `import_${i}_${Date.now()}`,
      part,
      type: String(item.type),
      difficulty: String(item.difficulty).toUpperCase(),
      questionText: String(item.questionText),
      passageText: isValidString(item.passageText) ? String(item.passageText) : undefined,
      passage: passageData,
      passages: allPassagesData,
      passageGroupId,
      passageId,
      options,
      correctOptionId,
      rationale: isValidString(item.rationale) ? String(item.rationale) : '',
    })
  }

  return { questions, errors }
}

export function validateImportedQuestions(
  questions: SessionQuestion[],
  config: Partial<SessionConfig>,
): ValidationResult {
  const errors: ValidationResult['errors'] = []
  const warnings: ValidationResult['warnings'] = []

  const parts = config.parts ?? []
  const knowledgeGroups = config.knowledgeGroups ?? {}

  if (questions.length === 0) {
    errors.push({ field: 'questions', message: 'Không có câu hỏi nào để validate.' })
    return { valid: false, errors, warnings }
  }

  const selectedDifficulties = config.difficulty ?? []
  const hasDifficultyFilter = selectedDifficulties.length > 0 && selectedDifficulties.length < 3

  const qUpper = (d: string) => d.toUpperCase()
  const normSelected = selectedDifficulties.map(qUpper)

  for (const question of questions) {
    const isPartSelected = parts.length === 0 || parts.includes(question.part)

    if (!isPartSelected) {
      warnings.push({
        field: `question_${question.tempId}`,
        message: `Câu hỏi Part ${question.part} không thuộc Part đã chọn (${parts.join(', ')}).`,
      })
    }

    if (
      isPartSelected &&
      hasDifficultyFilter &&
      !normSelected.includes(qUpper(question.difficulty))
    ) {
      warnings.push({
        field: `question_${question.tempId}`,
        message: `Câu hỏi "${question.questionText.slice(0, 40)}..." có độ khó "${question.difficulty}" không nằm trong lựa chọn (${selectedDifficulties.join(', ')}).`,
      })
    }
  }

  if (hasDifficultyFilter) {
    const selectedQuestions =
      parts.length > 0 ? questions.filter((q) => parts.includes(q.part)) : questions
    const importedDifficulties = [...new Set(selectedQuestions.map((q) => qUpper(q.difficulty)))]
    const missing = normSelected.filter((d) => !importedDifficulties.includes(d))
    if (missing.length > 0) {
      warnings.push({
        field: 'difficulty',
        message: `Không có câu hỏi nào cho độ khó: ${missing.join(', ')}. Import chỉ bao gồm: ${importedDifficulties.join(', ')}.`,
      })
    }
  }

  for (const [partStr, groups] of Object.entries(knowledgeGroups)) {
    const partNum = Number(partStr)
    if (parts.length > 0 && !parts.includes(partNum)) continue
    for (const group of groups as KnowledgeGroupConfig[]) {
      if (group.count === 0) continue
      const actualCount = questions.filter(
        (q) => q.part === partNum && q.type === group.type,
      ).length
      if (actualCount < group.count) {
        warnings.push({
          field: `part_${partNum}_${group.type}`,
          message: `Part ${partNum} "${group.type}": cần ${group.count} câu nhưng chỉ có ${actualCount} câu.`,
        })
      } else if (actualCount > group.count) {
        warnings.push({
          field: `part_${partNum}_${group.type}`,
          message: `Part ${partNum} "${group.type}": có ${actualCount} câu (dư ${actualCount - group.count} câu so với cấu hình ${group.count}). Chỉ lấy ${group.count} câu đầu.`,
        })
      }
    }
  }

  const selectedQuestions =
    parts.length > 0 ? questions.filter((q) => parts.includes(q.part)) : questions
  const totalExpected = config.totalQuestions ?? 0
  if (totalExpected > 0 && selectedQuestions.length > totalExpected) {
    warnings.push({
      field: 'questions',
      message: `Tổng số câu hỏi (${selectedQuestions.length}) vượt quá cấu hình (${totalExpected}). Chỉ lấy ${totalExpected} câu đầu.`,
    })
  } else if (totalExpected > 0 && selectedQuestions.length < totalExpected) {
    warnings.push({
      field: 'questions',
      message: `Tổng số câu hỏi (${selectedQuestions.length}) ít hơn cấu hình (${totalExpected}).`,
    })
  }

  return { valid: errors.length === 0, errors, warnings }
}

export interface ProcessResult {
  success: boolean
  questions: SessionQuestion[]
  importJson: string
  errors: string[]
  warnings: string[]
}

export function processImportedSessionJSON(
  raw: string,
  config: Partial<SessionConfig>,
): ProcessResult {
  const parseResult = parseImportedSessionJSON(raw)

  if (parseResult.errors.length > 0) {
    return {
      success: false,
      questions: [],
      importJson: '',
      errors: parseResult.errors.map((e) => e.message),
      warnings: [],
    }
  }

  const validationResult = validateImportedQuestions(parseResult.questions, config)

  if (validationResult.errors.length > 0) {
    return {
      success: false,
      questions: [],
      importJson: '',
      errors: validationResult.errors.map((e) => e.message),
      warnings: [],
    }
  }

  return {
    success: true,
    questions: parseResult.questions,
    importJson: raw,
    errors: [],
    warnings: validationResult.warnings.map((w) => w.message),
  }
}
