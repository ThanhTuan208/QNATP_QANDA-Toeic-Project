import { TYPE_LABEL_MAP_FULL } from '../constants'
import type { Question } from '../types'

const SAMPLE_QUESTIONS: Record<string, string> = {
  comparison: 'The new system is ______ than the previous version.',
  'word-form': 'She has a strong ______ of financial principles.',
  vocabulary: 'The company decided to ______ the new product line.',
  'verb-tense': 'The report ______ by the end of last week.',
  preposition: 'We apologize ______ any inconvenience caused.',
  conjunction: '______ the delay, the project was completed on time.',
  participle: 'The ______ manager will present the results.',
  voice: 'Customers will ______ notified by email.',
  'relative-clause': 'The consultant ______ we hired is very experienced.',
  agreement: 'Each employee ______ required to attend the training.',
}

export function generateTemplate(type: string): string {
  return JSON.stringify(
    [
      {
        question: SAMPLE_QUESTIONS[type] ?? 'Câu hỏi có ______ để điền',
        type,
        difficulty: 'medium',
        options: [
          { text: 'Đáp án A', isCorrect: true, rationale: 'Giải thích tại sao đúng' },
          { text: 'Đáp án B', isCorrect: false, rationale: 'Giải thích tại sao sai' },
          { text: 'Đáp án C', isCorrect: false, rationale: 'Giải thích tại sao sai' },
          { text: 'Đáp án D', isCorrect: false, rationale: 'Giải thích tại sao sai' },
        ],
        hint: 'Gợi ý cho người học',
      },
    ],
    null,
    2,
  )
}

export function generatePrompt(type: string): string {
  const typeLabel = TYPE_LABEL_MAP_FULL[type] ?? type
  return `Bạn là chuyên gia TOEIC. Hãy tạo 5 câu hỏi Part 5 (Incomplete Sentences) dạng "${typeLabel}" cho kỳ thi TOEIC.

YÊU CẦU:
- Mỗi câu hỏi có 4 lựa chọn A-B-C-D
- Đúng 1 đáp án đúng duy nhất
- Có giải thích (rationale) cho từng đáp án bằng tiếng Việt
- Có hint (gợi ý) bằng tiếng Việt
- Ngữ cảnh: môi trường công sở, kinh doanh, thương mại quốc tế
- Độ khó: đa dạng (easy, medium, hard)

ĐẦU RA (JSON array, không thêm text nào khác):
[
  {
    "question": "Câu hỏi có ______ để điền",
    "type": "${type}",
    "difficulty": "medium",
    "options": [
      { "text": "Đáp án A", "isCorrect": false, "rationale": "Giải thích" },
      { "text": "Đáp án B", "isCorrect": true, "rationale": "Giải thích" },
      { "text": "Đáp án C", "isCorrect": false, "rationale": "Giải thích" },
      { "text": "Đáp án D", "isCorrect": false, "rationale": "Giải thích" }
    ],
    "hint": "Gợi ý bằng tiếng Việt"
  }
]`
}

export function parseImportedJSON(raw: string, type: string): Question[] {
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('Dữ liệu phải là một array')
  return parsed.map((item: Record<string, unknown>, i: number) => {
    if (!item.question || !item.options || !Array.isArray(item.options)) {
      throw new Error(`Câu ${i + 1}: thiếu "question" hoặc "options"`)
    }
    return {
      id: `custom_${i}_${Date.now()}`,
      questionText: String(item.question),
      type: String(item.type ?? type),
      difficulty: String(item.difficulty ?? 'medium'),
      hint: item.hint ? String(item.hint) : null,
      options: (item.options as Array<Record<string, unknown>>).map((o, j: number) => ({
        id: `opt_custom_${i}_${j}`,
        text: String(o.text),
        order: j,
      })),
    }
  })
}

export function calculateAccuracy(correct: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((correct / total) * 100)}%`
}
