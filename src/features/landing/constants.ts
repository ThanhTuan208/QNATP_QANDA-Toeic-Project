import {
  BookOpen,
  Brain,
  FileText,
  Headphones,
  Image as ImageIcon,
  ListChecks,
  MessageSquare,
  Mic,
  Users,
} from 'lucide-react'
import type { SkillCardData, SkillGroupData } from './types'

const listeningSkills: SkillCardData[] = [
  {
    id: 'part-1',
    part: 'Part 1',
    title: 'Photographs',
    description: 'Câu hỏi về hình ảnh',
    icon: ImageIcon,
    label: '45 Bài tập',
    variant: 'grid',
  },
  {
    id: 'part-2',
    part: 'Part 2',
    title: 'Question-Response',
    description: 'Câu hỏi phản xạ',
    icon: MessageSquare,
    label: '45 Bài tập',
    variant: 'grid',
  },
  {
    id: 'part-3',
    part: 'Part 3',
    title: 'Short Conversations',
    icon: Users,
    badge: 'Luyện tập',
    variant: 'horizontal',
  },
  {
    id: 'part-4',
    part: 'Part 4',
    title: 'Short Talks',
    icon: Mic,
    badge: 'Luyện tập',
    variant: 'horizontal',
  },
]

const readingSkills: SkillCardData[] = [
  {
    id: 'part-5',
    part: 'Part 5',
    title: 'Incomplete Sentences',
    description:
      'Tập trung vào ngữ pháp và từ vựng cốt lõi. Hệ thống 1,200+ câu hỏi được cập nhật mới nhất.',
    icon: ListChecks,
    buttonLabel: 'Bắt đầu ngay',
    label: '30 câu \u2022 15 phút',
    variant: 'featured',
  },
  {
    id: 'part-6',
    part: 'Part 6',
    title: 'Text Completion',
    icon: FileText,
    label: '45 Bài tập',
    variant: 'grid',
  },
  {
    id: 'part-7',
    part: 'Part 7',
    title: 'Comprehension',
    icon: Brain,
    badge: 'Thử thách khó',
    variant: 'dark',
  },
]

export const skillGroups: SkillGroupData[] = [
  {
    id: 'listening',
    title: 'Listening Skills',
    partsRange: 'Parts 1 - 4',
    icon: Headphones,
    iconBgClass: 'bg-accent',
    iconColorClass: 'text-accent-foreground',
    skills: listeningSkills,
  },
  {
    id: 'reading',
    title: 'Reading Skills',
    partsRange: 'Parts 5 - 7',
    icon: BookOpen,
    iconBgClass: 'bg-warning-soft',
    iconColorClass: 'text-warning-foreground',
    skills: readingSkills,
  },
]

export const QUIZ_DATA = {
  label: 'READING',
  questionNumber: 'Q. 12 / 30',
  prefix: 'The manager',
  answer: 'submitted',
  placeholder: 'submits',
  suffix: 'the report before the meeting.',
  options: ['submit', 'submitted', 'submitting', 'submits'],
  correctIndex: 1,
  explanation:
    'Dấu hiệu \u201cbefore the meeting\u201d chỉ hành động đã hoàn tất trong quá khứ \u2192 Past Simple.',
} as const
