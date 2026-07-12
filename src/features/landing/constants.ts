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
    description: 'Mô tả hình ảnh, chọn câu trả lời đúng.',
    icon: ImageIcon,
    label: '45 Bài tập',
    variant: 'grid',
  },
  {
    id: 'part-2',
    part: 'Part 2',
    title: 'Question-Response',
    description: 'Hỏi-đáp nhanh, rèn phản xạ nghe hiểu.',
    icon: MessageSquare,
    label: '45 Bài tập',
    variant: 'grid',
  },
  {
    id: 'part-3',
    part: 'Part 3',
    title: 'Short Conversations',
    description: 'Hội thoại 2-3 người, luyện nghe hiểu ngữ cảnh.',
    icon: Users,
    badge: 'Luyện tập',
    variant: 'horizontal',
  },
  {
    id: 'part-4',
    part: 'Part 4',
    title: 'Short Talks',
    description: 'Bài nói dài, thông báo — rèn tập trung & ghi nhớ.',
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
      'Ngữ pháp & từ vựng cốt lõi với 1,200+ câu hỏi được cập nhật mới nhất.',
    icon: ListChecks,
    buttonLabel: 'Bắt đầu ngay',
    label: '30 câu \u2022 15 phút',
    variant: 'featured',
  },
  {
    id: 'part-6',
    part: 'Part 6',
    title: 'Text Completion',
    description: 'Điền từ vào đoạn văn, kết hợp ngữ pháp & từ vựng.',
    icon: FileText,
    label: '45 Bài tập',
    variant: 'grid',
  },
  {
    id: 'part-7',
    part: 'Part 7',
    title: 'Reading Comprehension',
    description: 'Đoạn văn đơn & kép, luyện đọc nhanh bắt ý chính.',
    icon: Brain,
    label: '28 Bài tập',
    variant: 'grid',
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

export const faqs = [
  {
    value: 'item-1',
    question: 'Học TOEIC trên nền tảng này có mất phí không?',
    answer:
      'Hoàn toàn miễn phí truy cập tất cả bài học ngữ pháp, từ vựng và câu hỏi luyện tập theo từng Part. Bạn chỉ cần đăng ký tài khoản để theo dõi lộ trình và lưu tiến độ học tập cá nhân.',
  },
  {
    value: 'item-2',
    question: 'Bài tập trên nền tảng có bám sát đề thi thật không?',
    answer:
      'Có. Hệ thống câu hỏi được biên soạn dựa trên cấu trúc đề thi TOEIC mới nhất, bao gồm đầy đủ 7 Parts với các dạng câu hỏi thường gặp như Photographs, Question-Response, Short Conversations, Incomplete Sentences, Text Completion và Reading Comprehension.',
  },
  {
    value: 'item-3',
    question: 'Tôi có thể học trên điện thoại được không?',
    answer:
      'Hoàn toàn được. Giao diện được thiết kế responsive, tương thích tốt trên mọi thiết bị từ điện thoại, máy tính bảng đến máy tính để bàn. Bạn có thể học mọi lúc mọi nơi mà không cần tải ứng dụng.',
  },
  {
    value: 'item-4',
    question: 'Nền tảng có giải thích đáp án chi tiết không?',
    answer:
      'Có. Mỗi câu hỏi đều kèm giải thích đáp án chi tiết, chỉ ra dấu hiệu nhận biết ngữ pháp, từ vựng hoặc chiến thuật làm bài giúp bạn hiểu sâu và tránh lặp lại lỗi sai.',
  },
  {
    value: 'item-5',
    question: 'Làm thế nào để theo dõi tiến độ học tập của tôi?',
    answer:
      'Sau khi đăng ký tài khoản, hệ thống sẽ tự động ghi nhận số câu đúng/sai, điểm số theo từng Part và phần trăm hoàn thành lộ trình. Bạn có thể xem lại lịch sử làm bài và các kỹ năng cần cải thiện tại trang Dashboard.',
  },
]

export const footerLinks = {
  routes: [
    { label: 'Part 1 - 4', href: '#' },
    { label: 'Part 5 - 7', href: '#' },
    { label: 'Luyện đề Full Test', href: '#' },
    // { label: 'Từ vựng 600+', href: '#' },
  ],
  support: [
    { label: 'Trung tâm trợ giúp', href: '#' },
    { label: 'Liên hệ chúng tôi', href: '#' },
    { label: 'Câu hỏi thường gặp', href: '#faq' },
    // { label: 'Báo cáo lỗi', href: '#' },
  ],
  // legal: [
  //   { label: 'Điều khoản dịch vụ', href: '#' },
  //   { label: 'Chính sách bảo mật', href: '#' },
  //   { label: 'Quyền riêng tư', href: '#' },
  // ],
}
