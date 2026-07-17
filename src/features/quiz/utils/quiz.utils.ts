import { TYPE_LABEL_MAP_VIETNAM } from '@/constants/index.constants'
import { typeContext } from '@/features/quiz/constants'
import type { Question } from '@/features/quiz/types'

const SAMPLE_QUESTIONS: Record<string, string> = {
  comparison:
    "This year's sales figures are ______ than last year's, reflecting our successful market expansion.",
  'word-form':
    'The new candidate demonstrated excellent analytical ______ during the interview process.',
  vocabulary:
    'The board of directors voted to ______ the merger proposal at the next shareholder meeting.',
  'verb-tense':
    'The quarterly financial report ______ by the accounting department before the deadline.',
  preposition:
    'All employees are encouraged to participate ______ the professional development workshop.',
  conjunction:
    '______ the company faced budget constraints, the project was still completed on schedule.',
  participle: 'The ______ proposal was unanimously approved by the investment committee.',
  voice: 'All attendees will ______ a confirmation email within 24 hours of registration.',
  'relative-clause':
    'The marketing director ______ was hired last quarter has already improved our brand presence.',
  agreement: 'Each department ______ required to submit its quarterly budget proposal by Friday.',
}

const TYPE_EXPLANATIONS: Record<string, string> = {
  comparison:
    'So sánh: dùng tính từ/trạng từ ở dạng so sánh hơn (more/less + adj/adv + than) hoặc so sánh nhất (the + most/least + adj/adv).',
  'word-form':
    'Loại từ: chọn dạng đúng của từ gốc (V, N, Adj, Adv) — thường có cùng gốc nhưng khác hậu tố (-tion, -ive, -ly, -ment).',
  vocabulary:
    'Từ vựng: chọn từ/cụm từ đúng nghĩa trong ngữ cảnh — thường là collocations (launch a product, attend a meeting, file a report).',
  'verb-tense':
    'Thì: chọn thì đúng dựa vào trạng từ thời gian (now, last week, by next month, since 2020) và ngữ cảnh.',
  preposition:
    'Giới từ: chọn giới từ đúng đi với động từ/tính từ/danh từ (depend on, responsible for, participation in, interest in).',
  conjunction:
    'Liên từ: chọn từ nối đúng (however, therefore, moreover, nevertheless, in addition) dựa vào quan hệ logic giữa 2 mệnh đề.',
  participle:
    'Phân từ: chọn V-ing (chủ động) hoặc V3/ed (bị động) — xác định danh từ được bổ nghĩa là chủ thể hay đối tượng của hành động.',
  voice:
    'Câu bị động/Causative: chọn dạng bị động (be + V3/ed) hoặc cấu trúc have/get something done.',
  'relative-clause':
    'Mệnh đề quan hệ: chọn who/whom/which/that/whose dựa vào danh từ đứng trước (người/vật) và vai trò trong mệnh đề (S/O).',
  agreement:
    'Hòa hợp S-V: chọn động từ chia đúng với chủ ngữ — chú ý each/every/either/neither, as well as/together with, a number of/the number of.',
}

export function generateTemplate(type: string): string {
  return JSON.stringify(
    [
      {
        question: SAMPLE_QUESTIONS[type] ?? 'Câu hỏi có ______ để điền',
        type,
        difficulty: 'medium',
        options: [
          {
            text: 'Đáp án đúng',
            isCorrect: true,
            rationale: 'Giải thích bằng tiếng Việt tại sao đáp án này đúng',
          },
          {
            text: 'Đáp án sai A',
            isCorrect: false,
            rationale: 'Giải thích bằng tiếng Việt tại sao đáp án này sai',
          },
          {
            text: 'Đáp án sai B',
            isCorrect: false,
            rationale: 'Giải thích bằng tiếng Việt tại sao đáp án này sai',
          },
          {
            text: 'Đáp án sai C',
            isCorrect: false,
            rationale: 'Giải thích bằng tiếng Việt tại sao đáp án này sai',
          },
        ],
        hint: 'Gợi ý bằng tiếng Việt giúp người học tìm ra đáp án đúng',
      },
    ],
    null,
    2,
  )
}

export function generatePrompt(type: string): string {
  const typeLabel = TYPE_LABEL_MAP_VIETNAM[type] ?? type
  const explanation = TYPE_EXPLANATIONS[type] ?? ''
  const sampleQuestion = SAMPLE_QUESTIONS[type] ?? 'Câu hỏi có ______ để điền'
  const context = typeContext[type] ?? ''

  return `Bạn là chuyên gia ra đề thi TOEIC Reading, đặc biệt Part 5 (Incomplete Sentences - Câu điền từ).

LOẠI CÂU HỎI CẦN TẠO: "${typeLabel}"
Giải thích: ${explanation}
Kiến thức liên quan: ${context}

YÊU CẦU TẠO 5 CÂU HỎI:

1. Nội dung câu hỏi (question): tiếng Anh, ngữ cảnh công sở/kinh doanh/thương mại (email, meetings, reports, contracts, marketing, finance, HR). Mỗi câu có 1 chỗ trống "______" để thí sinh điền.

2. 4 lựa chọn (options): Mỗi option có:
   - "text": nội dung bằng tiếng Anh
   - "isCorrect": true (1 đáp án duy nhất) hoặc false (3 đáp án còn lại)
   - "rationale": giải thích bằng tiếng Việt, giải thích cụ thể tại sao đúng hoặc sai, đề cập đến quy tắc ngữ pháp/ngữ nghĩa

3. hint: gợi ý ngắn bằng tiếng Việt (1-2 câu) giúp người học định hướng cách làm

4. difficulty: đa dạng — easy (dễ), medium (trung bình), hard (khó)

5. type: luôn là "${type}"

VÍ DỤ CỤ THỂ cho dạng này:
{
  "question": "${sampleQuestion}",
  "type": "${type}",
  "difficulty": "medium",
  "options": [
    { "text": "Đáp án chính xác", "isCorrect": true, "rationale": "Giải thích tiếng Việt vì sao đúng." },
    { "text": "Đáp án gây nhiễu", "isCorrect": false, "rationale": "Giải thích tiếng Việt vì sao sai." },
    { "text": "Đáp án gây nhiễu", "isCorrect": false, "rationale": "Giải thích tiếng Việt vì sao sai." },
    { "text": "Đáp án gây nhiễu", "isCorrect": false, "rationale": "Giải thích tiếng Việt vì sao sai." }
  ],
  "hint": "Gợi ý ngắn bằng tiếng Việt"
}

ĐẦU RA: Chỉ trả về JSON array (không thêm bất kỳ text nào khác, không markdown, không code block).`
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
        rationale: o.rationale ? String(o.rationale) : undefined,
      })),
    }
  })
}

export function calculateAccuracy(correct: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((correct / total) * 100)}%`
}
