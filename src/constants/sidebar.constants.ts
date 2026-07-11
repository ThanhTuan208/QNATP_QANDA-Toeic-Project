import {
  ArrowUpRight,
  FileText,
  Layers,
  NotebookPen,
  RefreshCw,
  Scale,
} from 'lucide-react'
import type { PracticeModule, SectionItem, TopicItem } from '@/types/sidebar'

export const vocabularyTopics: TopicItem[] = []
export const mixedPracticeTopics: TopicItem[] = []
export const savedQuestionTopics: TopicItem[] = []
export const wrongAnswerTopics: TopicItem[] = []

export const defaultSections: SectionItem[] = [
  { id: 'theory', label: 'Lý thuyết' },
  { id: 'practice', label: 'Luyện tập' },
  { id: 'quiz', label: 'Kiểm tra' },
]

export const grammarTopics: TopicItem[] = [
  {
    slug: 'comparison',
    label: 'Comparisons',
    description: 'Comparisons: cấu trúc so sánh hơn với tính từ ngắn/dài',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'word-form',
    label: 'Word Form',
    description: 'Phân biệt danh từ, động từ, tính từ, trạng từ',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'verb-tense',
    label: 'Verb Tense ',
    description: 'Các thì cơ bản: hiện tại, quá khứ, tương lai',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'preposition',
    label: 'Prepositions',
    description: 'Giới từ chỉ thời gian, nơi chốn, và collocation',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'conjunction',
    label: 'Conjunctions',
    description: 'Liên từ kết hợp và tương quan trong câu',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'participle',
    label: 'Participles',
    description: 'Phân từ V-ing và V3/ed làm tính từ bổ nghĩa',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'voice',
    label: 'Passive & Causative',
    description: 'Thể bị động và cấu trúc sai bảo (have/get sth done)',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'relative-clause',
    label: 'Relative Clauses',
    description: 'Mệnh đề quan hệ: who, whom, which, that, whose',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
  {
    slug: 'agreement',
    label: 'Subject-Verb',
    description: 'Hòa hợp chủ ngữ - động từ: số ít, số nhiều, trường hợp đặc biệt',
    icon: NotebookPen,
    difficulty: 'beginner',
    estimatedMinutes: 15,
    sections: defaultSections,
  },
]

export const practiceModules: PracticeModule[] = [
  {
    id: 'grammar',
    label: 'Grammar',
    description: 'Luyện tập ngữ pháp TOEIC',
    href: '/practice/grammar',
    icon: ArrowUpRight,
    topics: grammarTopics,
  },
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    description: 'Luyện tập từ vựng TOEIC',
    href: '/practice/vocabulary',
    icon: FileText,
    topics: vocabularyTopics,
  },
  {
    id: 'mixed-practice',
    label: 'Mixed Practice',
    description: 'Luyện tập tổng hợp',
    href: '/practice/mixed-practice',
    icon: Layers,
    topics: mixedPracticeTopics,
  },
  {
    id: 'save-question',
    label: 'Saved Questions',
    description: 'Câu hỏi đã lưu',
    href: '/practice/save-question',
    icon: Scale,
    topics: savedQuestionTopics,
  },
  {
    id: 'wrong-answers',
    label: 'Wrong Answers',
    description: 'Câu trả lời sai',
    href: '/practice/wrong-answers',
    icon: RefreshCw,
    topics: wrongAnswerTopics,
  },
]
