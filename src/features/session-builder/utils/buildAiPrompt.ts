import { KNOWLEDGE_GROUPS } from '@/features/session-builder/constants'
import type { SessionConfig } from '@/features/temp-session/types'

interface BuildAiPromptOptions {
  mode: 'custom' | 'random'
  config: Partial<SessionConfig>
  formats?: string[]
  passageSets?: { single: number; double: number; triple: number }
  additionalNotes?: string
}

const PASSAGE_SET_LABEL: Record<string, string> = {
  single: 'Single (1 passage, 2-4 câu hỏi)',
  double: 'Double (2 passages liên quan, 5-6 câu hỏi)',
  triple: 'Triple (3 passages liên quan, 8-12 câu hỏi)',
}

export function buildAiPrompt(opts: BuildAiPromptOptions): string {
  const { mode, config, formats, passageSets, additionalNotes } = opts
  const parts = config.parts ?? []
  const difficulty = config.difficulty ?? []
  const totalQ = config.totalQuestions ?? 0
  const groups = config.knowledgeGroups ?? {}

  const partsLine = parts.length > 0 ? parts.join(', ') : '5, 6, 7'
  const levelList =
    difficulty.length > 0 ? difficulty.map((d) => d.toUpperCase()).join(', ') : 'EASY, MEDIUM, HARD'

  const countLines = Object.entries(groups)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([partNum, typeList]) => {
      const lines = typeList.map((g) => `     - ${g.type}: ${g.count} câu`).join('\n')
      return `   Part ${partNum}:\n${lines}`
    })
    .join('\n')

  const hasCountSection = countLines.trim().length > 0

  let prompt = `Bạn là chuyên gia ra đề thi TOEIC Reading. Hãy tạo câu hỏi theo các yêu cầu sau:

## 1. PART CẦN TẠO: ${partsLine}

## 2. ĐỘ KHÓ: ${levelList}

## 3. CẤU TRÚC JSON ĐẦU RA
Trả về JSON object duy nhất dạng:
{ "passages": { "groupKey": [ { "id": "...", "title": "...", "passageFormat": "email|table|memo|letter|article|...", "content": [ { "type": "text"|"blank"|"table", "value": "..." } ] } ] }, "questions": [ ... ] }

Mỗi passage có thể có:
- passageFormat: loại format ("email", "table", "form", "memo", "letter", "article", "advertisement", "schedule", "announcement", "review")
- content: mảng block với type "text", "blank", "image", hoặc "table"
- Với type "table": cần có headers (string[]) và rows (string[][])

Mỗi question object gồm:
- part (5|6|7), type, difficulty
- passageGroupId (Part 6/7)
- passageId (Part 6/7)
- questionText: nội dung câu hỏi (tiếng Anh)
- options: mảng 4 object { id: "A"|"B"|"C"|"D", text, order, isCorrect, rationale }
- correctOptionId: đáp án đúng (A/B/C/D)

Ví dụ passage dạng table (nhiều table + text block trong một passage):
{ "id": "F1", "title": "Order Form", "passageFormat": "table", "content": [
  { "type": "table", "headers": ["Field", "Value"], "rows": [["Order#", "#AX-100"], ["Customer", "John Doe"], ["Date", "May 12, 2026"]] },
  { "type": "table", "headers": ["Item", "Qty", "Price"], "rows": [["Headphones", "1", "$180"], ["Mouse", "2", "$50"]] },
  { "type": "text", "value": "Customer requested express shipping. Approved by manager." }
]}

Ví dụ passage dạng email:
{ "id": "E1", "title": "Conference Update", "passageFormat": "email", "content": [{ "type": "text", "value": "From: Ms. Johnson\nTo: All Staff\nSubject: Meeting Reschedule\nDate: March 15, 2024\n\nThe team meeting has been rescheduled to Friday." }] }

LƯU Ý QUAN TRỌNG: Nếu passageFormat là "table" thì PHẢI dùng type "table" (có headers + rows) cho dữ liệu có cấu trúc, KHÔNG gộp vào type "text". Có thể kết hợp nhiều table blocks và text blocks trong cùng một passage.

`

  if (hasCountSection) {
    prompt += `## 4. SỐ LƯỢNG CẦN TẠO:\n${countLines}\n\n`
  }

  if (mode === 'custom') {
    prompt += `## 5. YÊU CẦU FORMAT PASSAGE
`
    if (formats && formats.length > 0) {
      prompt += `Hãy tạo passage theo các format sau: ${formats.join(', ')}.
`
    }
    if (passageSets && Object.values(passageSets).some((v) => v > 0)) {
      const setLines = Object.entries(passageSets)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => `     - ${count} × ${PASSAGE_SET_LABEL[type]}`)
        .join('\n')
      prompt += `\nPart 7 cấu trúc passage sets:\n${setLines}\n`

      const questionRules = Object.entries(passageSets)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => {
          if (type === 'single') return `${count} set single: mỗi passage có 2-4 câu hỏi`
          if (type === 'double') return `${count} set double: 5-6 câu hỏi cho cả set`
          return `${count} set triple: 8-12 câu hỏi cho cả set`
        })
        .join('; ')
      prompt += `Quy tắc số câu hỏi: ${questionRules}.\n`
    } else {
      prompt += `\nKHÔNG tạo Part 7 passages.\n`
    }
    prompt += `
## 6. LƯU Ý KHI TẠO:
- Mỗi passage set: các passage trong cùng set PHẢI có liên quan về nội dung với nhau
- Single set: 1 passage độc lập, có 2-4 câu hỏi
- Double set: 2 passages có liên quan, tổng 5-6 câu hỏi (có câu riêng + so sánh)
- Triple set: 3 passages có liên quan, tổng 8-12 câu hỏi (có câu riêng + so sánh)
- KHÔNG tạo passage chỉ có 1 câu hỏi. Mỗi passage phải có ít nhất 2 câu hỏi trở lên.
- KHÔNG tạo câu hỏi trùng lặp (cùng nội dung, cùng type) cho cùng một passage.
- AI tự chọn format phù hợp cho mỗi passage từ danh sách format được cho phép.
`
  } else {
    prompt += `## 5. YÊU CẦU CHUNG
Tự chọn format passage phù hợp (email, memo, article, advertisement...). Phân bổ đều các dạng câu hỏi. Nội dung passage đa dạng, sát thực tế.
`
  }

  if (additionalNotes?.trim()) {
    prompt += `\n## 7. GHI CHÚ THÊM\n${additionalNotes.trim()}\n`
  }

  prompt += `
## YÊU CẦU KHÁC:
- Đúng 1 đáp án duy nhất (isCorrect: true)
- Distractors hợp lý, dễ gây nhầm lẫn
- Mỗi option có rationale: giải thích bằng tiếng Việt (2-3 câu)
- KHÔNG thêm text ngoài JSON (không markdown, không code block)
- Passage content dùng mảng block { "type": "text", "value": "..." }
- Part 6 dùng { "type": "blank" } cho chỗ trống trong content
- Part 7: 1 passage có thể có nhiều câu hỏi
- Part 7: BẮT BUỘC các câu hỏi của cùng một passageId phải nằm LIỀN KỀ nhau.
  ⛔ SAI: đan xen passageId ── [A, B, A, A, B, B, A, B]
  ✅ ĐÚNG: gom theo passageId ── [A, A, A, A, B, B, B, B]
  Cách làm: trong mỗi passageGroup, hãy gom toàn bộ câu hỏi của passageId thứ nhất, rồi toàn bộ câu hỏi của passageId thứ hai, v.v. KHÔNG ĐƯỢC đan xen.

Hãy tạo ngay JSON:`

  return prompt
}
