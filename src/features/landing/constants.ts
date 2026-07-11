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

export const resourceCard = [
  {
    title: 'Ngữ pháp',
    badge: 'Part 5',
    badgeColor: 'bg-primary/10 text-primary',
    description:
      'Chinh phục Part 5 TOEIC với hệ thống bài học, ví dụ minh họa và hàng trăm câu luyện tập theo từng chủ điểm.',
    gradient: 'from-primary to-green-dark',
    icon: 'BookOpen',
    buttonLabel: 'Bắt đầu',
    buttonClass: 'bg-primary hover:bg-green-teal-60 text-primary-foreground',
  },
  {
    title: 'Từ vựng',
    badge: '600+ Từ thiết yếu',
    badgeColor: 'bg-secondary/10 text-secondary-foreground',
    description:
      'Học từ vựng qua flashcard thông minh, phát âm chuẩn và các ngữ cảnh thực tế thường gặp nhất trong bài thi TOEIC.',
    gradient: 'from-green-dark to-safety-orange',
    icon: 'Languages',
    buttonLabel: 'Học ngay',
    buttonClass: 'bg-secondary hover:bg-leaf text-secondary-foreground',
  },
  {
    title: 'Luyện đề',
    badge: 'Full Test',
    badgeColor: 'bg-error/10 text-error',
    description:
      'Trải nghiệm áp lực phòng thi thật với kho đề ETS mới nhất, có bấm giờ và chấm điểm, giải thích chi tiết từng câu.',
    gradient: 'from-error to-primary',
    icon: 'ClipboardList',
    buttonLabel: 'Thi thử',
    buttonClass: 'bg-error hover:bg-error-hover text-primary-foreground',
  },
  {
    title: 'Video',
    badge: 'Mẹo & Chiến thuật',
    badgeColor: 'bg-warning/10 text-warning-foreground',
    description:
      'Tổng hợp các video bài giảng chất lượng cao, chia sẻ mẹo tránh bẫy và phương pháp làm bài nhanh từ các chuyên gia.',
    gradient: 'from-safety-orange to-primary',
    icon: 'Video',
    buttonLabel: 'Xem ngay',
    buttonClass: 'bg-primary text-primary-foreground',
  },
  {
    title: 'Luyện nghe',
    badge: 'Parts 1 - 4',
    badgeColor: 'bg-accent text-accent-foreground',
    description:
      'Cải thiện kỹ năng nghe với các bài hội thoại, tin nhắn và câu hỏi tình huống thực tế bám sát cấu trúc đề thi.',
    gradient: 'from-blue-500 to-cyan-500',
    icon: 'Headphones',
    buttonLabel: 'Luyện ngay',
    buttonClass: 'bg-accent text-accent-foreground',
  },
  {
    title: 'Đọc hiểu',
    badge: 'Parts 6 - 7',
    badgeColor: 'bg-emerald-500/10 text-emerald-600',
    description:
      'Làm chủ kỹ năng đọc với các đoạn văn, thư tín và bài báo học thuật, kèm phân tích chi tiết từng dạng câu hỏi.',
    gradient: 'from-emerald-500 to-teal-500',
    icon: 'FileText',
    buttonLabel: 'Đọc ngay',
    buttonClass: 'bg-emerald-600 text-white',
  },
]
