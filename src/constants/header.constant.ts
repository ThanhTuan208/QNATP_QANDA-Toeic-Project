import { BookOpen, GraduationCap, Library, type LucideIcon, Target } from 'lucide-react'

export interface NavDropdownItem {
  label: string
  description?: string
  href: string
  icon: LucideIcon
}

export interface NavItem {
  label: string
  href?: string
  dropdownItems?: NavDropdownItem[]
}

export const navItems: NavItem[] = [
  {
    label: 'Luyện tập',
    dropdownItems: [
      {
        label: 'Grammar',
        description: 'Ngữ pháp',
        href: '/practice/grammar',
        icon: BookOpen,
      },
      {
        label: 'Vocabulary',
        description: 'Từ vựng & Collocation',
        href: '/practice/vocabulary',
        icon: Library,
      },
      {
        label: 'Mixed Practice',
        description: 'Luyện tập tổng hợp',
        href: '/practice/mixed-practice',
        icon: GraduationCap,
      },
      {
        label: 'Saved Questions',
        description: 'Câu hỏi đã lưu',
        href: '/practice/save-question',
        icon: Target,
      },
      {
        label: 'Wrong Answers',
        description: 'Câu trả lời sai',
        href: '/practice/wrong-answers',
        icon: Target,
      },
    ],
  },
  {
    label: 'Đề thi thử',
    dropdownItems: [
      {
        label: 'Full',
        description: 'Bộ đề đầy đủ',
        href: '/exam/full-question',
        icon: Target,
      },
      {
        label: 'Listening',
        description: 'Bộ đề thi nghe',
        href: '/exam/listening-question',
        icon: Target,
      },
      {
        label: 'Reading',
        description: 'Bộ đề thi đọc',
        href: '/exam/reading-question',
        icon: Target,
      },
    ],
  },

  {
    label: 'Tiến độ',
    dropdownItems: [
      {
        label: 'Overview',
        description: 'Tổng quan tiến độ',
        href: '/progress/overview',
        icon: Target,
      },
      {
        label: 'Learning Progress',
        description: 'Tiến trình học tập',
        href: '/progress/learning-progress',
        icon: Target,
      },
      {
        label: 'Practice History',
        description: 'Lịch sử luyện tập',
        href: '/progress/practice-history',
        icon: Target,
      },
      {
        label: 'Mistakes Review',
        description: 'Xem lại câu sai',
        href: '/progress/mistakes-review',
        icon: Target,
      },
      {
        label: 'Weak Areas',
        description: 'Phần còn yếu',
        href: '/progress/weak-areas',
        icon: Target,
      },
      {
        label: 'Goals',
        description: 'Mục tiêu học tập',
        href: '/progress/goals',
        icon: Target,
      },
      {
        label: 'Statistics',
        description: 'Thống kê chi tiết',
        href: '/progress/statistics',
        icon: Target,
      },
      {
        label: 'Achievements',
        description: 'Thành tích đạt được',
        href: '/progress/achievements',
        icon: Target,
      },
      {
        label: 'Reports',
        description: 'Báo cáo học tập',
        href: '/progress/reports',
        icon: Target,
      },
    ],
  },
  {
    label: 'Tài liệu',
    dropdownItems: [
      {
        label: 'Grammar Guide',
        description: 'Hướng dẫn ngữ pháp',
        href: '/resources/grammar-guide',
        icon: Target,
      },
      {
        label: 'Vocabulary Library',
        description: 'Thư viện từ vựng',
        href: '/resources/vocabulary-library',
        icon: Target,
      },
      {
        label: 'Collocations',
        description: 'Cụm từ thường đi với nhau',
        href: '/resources/collocations',
        icon: Target,
      },
      {
        label: 'Tips & Strategies',
        description: 'Mẹo và chiến thuật làm bài',
        href: '/resources/tips-strategies',
        icon: Target,
      },
      {
        label: 'Study Roadmap',
        description: 'Lộ trình học tập',
        href: '/resources/study-roadmap',
        icon: Target,
      },
      {
        label: 'Cheat Sheets',
        description: 'Tài liệu tóm tắt nhanh',
        href: '/resources/cheat-sheets',
        icon: Target,
      },
      {
        label: 'Blog',
        description: 'Bài viết chia sẻ kinh nghiệm',
        href: '/resources/blog',
        icon: Target,
      },
      {
        label: 'FAQ',
        description: 'Câu hỏi thường gặp',
        href: '/resources/faq',
        icon: Target,
      },
      {
        label: 'Downloads',
        description: 'Tài liệu tải về',
        href: '/resources/downloads',
        icon: Target,
      },
    ],
  },
]
