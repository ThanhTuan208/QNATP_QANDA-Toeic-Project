export const QUESTION_TYPE_LABELS: Record<string, string> = {
  WORD_FORM: 'Word Form (Từ loại)',
  VOCABULARY: 'Vocabulary & Collocation',
  VERB_TENSE: 'Verb Tense (Thì)',
  PREPOSITION: 'Prepositions (Giới từ)',
  CONJUNCTION: 'Conjunctions (Liên từ)',
  PARTICIPLE: 'Participles (Phân từ)',
  VOICE: 'Passive Voice & Causative',
  RELATIVE_CLAUSE: 'Relative Clauses',
  COMPARISON: 'Comparisons (So sánh)',
  AGREEMENT: 'Subject-Verb Agreement',
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Dễ',
  MEDIUM: 'Trung bình',
  HARD: 'Khó',
}

export const TYPE_SLUG_MAP: Record<string, string> = {
  'word-form': 'WORD_FORM',
  comparison: 'COMPARISON',
  vocabulary: 'VOCABULARY',
  'verb-tense': 'VERB_TENSE',
  preposition: 'PREPOSITION',
  conjunction: 'CONJUNCTION',
  participle: 'PARTICIPLE',
  voice: 'VOICE',
  'relative-clause': 'RELATIVE_CLAUSE',
  agreement: 'AGREEMENT',
}

export const TYPE_LABEL_MAP: Record<string, string> = {
  'word-form': 'Word Form (Từ loại)',
  comparison: 'So Sánh Hơn',
  vocabulary: 'Vocabulary & Collocation',
  'verb-tense': 'Verb Tense (Thì)',
  preposition: 'Prepositions (Giới từ)',
  conjunction: 'Conjunctions (Liên từ)',
  participle: 'Participles (Phân từ)',
  voice: 'Passive Voice & Causative',
  'relative-clause': 'Relative Clauses',
  agreement: 'Subject-Verb Agreement',
}

export const TYPE_CONTEXT: Record<string, string> = {
  comparison:
    'Chào mừng bạn đến với môi trường học tập tương tác cao. Tại đây, chúng tôi không chỉ cho bạn biết đúng hay sai, mà còn giúp bạn hiểu rõ logic của từng lựa chọn trong đề thi TOEIC thực tế.',
  'word-form':
    'Nắm vững cách nhận biết từ loại sẽ giúp bạn xử lý nhanh các câu hỏi Part 5. Cùng luyện tập để không còn nhầm lẫn giữa danh từ, động từ, tính từ và trạng từ.',
  vocabulary:
    'Mở rộng vốn từ vựng và collocation là chìa khóa để đạt điểm cao Part 5. Hãy học từ theo cụm, không học từ đơn lẻ.',
  'verb-tense':
    'Xác định đúng thì của động từ dựa vào trạng từ chỉ thời gian là kỹ năng quan trọng trong Part 5. Luyện tập để không còn nhầm lẫn giữa các thì.',
  preposition:
    'Giới từ thường gây khó khăn vì không có quy tắc cố định. Học thuộc các collocation verb + preposition và adj + preposition là cách hiệu quả nhất.',
  conjunction:
    'Liên từ và từ nối giúp câu văn mạch lạc. Chú ý phân biệt cấu trúc ngữ pháp đằng sau mỗi từ nối để chọn đáp án đúng.',
  participle:
    'Phân từ V-ing (chủ động) và V3/ed (bị động) thường xuất hiện dưới dạng rút gọn mệnh đề quan hệ. Xác định chủ ngữ là người hay vật để chọn dạng đúng.',
  voice:
    'Thể bị động và cấu trúc causative (have/get something done) là dạng bài phổ biến. Nhận biết dấu hiệu "by + agent" hoặc cấu trúc have/get để chọn đáp án.',
  'relative-clause':
    'Đại từ quan hệ who/whom/which/that/whose thay thế cho danh từ đứng trước. Xác định danh từ đó là người hay vật, và vai trò trong mệnh đề để chọn đúng.',
  agreement:
    'Hòa hợp chủ ngữ - động từ tưởng dễ nhưng có nhiều bẫy. Chú ý các trường hợp đặc biệt: each/every, a number of/the number of, cùng với as well as/together with.',
}

export const TYPE_LABEL_MAP_FULL: Record<string, string> = {
  'word-form': 'Word Form (Từ loại)',
  comparison: 'Comparisons (So sánh)',
  vocabulary: 'Vocabulary & Collocation',
  'verb-tense': 'Verb Tense (Thì)',
  preposition: 'Prepositions (Giới từ)',
  conjunction: 'Conjunctions (Liên từ)',
  participle: 'Participles (Phân từ)',
  voice: 'Passive Voice & Causative',
  'relative-clause': 'Relative Clauses',
  agreement: 'Subject-Verb Agreement',
}

export const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

export const VALID_QUIZ_TYPES = new Set([
  'word-form',
  'comparison',
  'vocabulary',
  'verb-tense',
  'preposition',
  'conjunction',
  'participle',
  'voice',
  'relative-clause',
  'agreement',
])
