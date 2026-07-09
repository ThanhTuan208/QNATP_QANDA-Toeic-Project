import {
  ArrowUpRight,
  FileText,
  Clock,
  MapPin,
  GitCommit,
  Layers,
  RefreshCw,
  Link2,
  Scale,
  BookOpen,
  Home,
  Info,
  LayoutDashboard,
  Phone,
  Shield,
} from 'lucide-react'

export const loggedInNavItems = [
  { id: 'practice', label: 'Luyện tập', icon: BookOpen },
  { id: 'dashboard', label: 'Tiến độ', icon: LayoutDashboard },
  { id: 'admin', label: 'Quản lý', icon: Shield },
]

export const guestNavItems = [
  { id: '/', label: 'Trang chủ', icon: Home },
  { id: 'features', label: 'Tính năng', icon: BookOpen },
  { id: 'about', label: 'Giới thiệu', icon: Info },
  { id: 'contact', label: 'Liên hệ', icon: Phone },
]

export const currentPageMap: Record<string, string> = {
  '/': '/',
  '/about': 'about',
  '/contact': 'contact',
  '/dashboard': 'dashboard',
  '/practice': 'practice',
  '/admin': 'admin',
}

export const grammarTopic = [
  {
    id: 'comparison',
    label: 'So Sánh Hơn',
    description: 'Comparisons: cấu trúc so sánh hơn với tính từ ngắn/dài',
    icon: ArrowUpRight,
  },
  {
    id: 'word-form',
    label: 'Word Form (Từ loại)',
    description: 'Phân biệt danh từ, động từ, tính từ, trạng từ',
    icon: FileText,
  },
  {
    id: 'verb-tense',
    label: 'Verb Tense (Thì)',
    description: 'Các thì cơ bản: hiện tại, quá khứ, tương lai',
    icon: Clock,
  },
  {
    id: 'preposition',
    label: 'Prepositions (Giới từ)',
    description: 'Giới từ chỉ thời gian, nơi chốn, và collocation',
    icon: MapPin,
  },
  {
    id: 'conjunction',
    label: 'Conjunctions (Liên từ)',
    description: 'Liên từ kết hợp và tương quan trong câu',
    icon: GitCommit,
  },
  {
    id: 'participle',
    label: 'Participles (Phân từ)',
    description: 'Phân từ V-ing và V3/ed làm tính từ bổ nghĩa',
    icon: Layers,
  },
  {
    id: 'voice',
    label: 'Passive Voice & Causative',
    description: 'Thể bị động và cấu trúc sai bảo (have/get sth done)',
    icon: RefreshCw,
  },
  {
    id: 'relative-clause',
    label: 'Relative Clauses',
    description: 'Mệnh đề quan hệ: who, whom, which, that, whose',
    icon: Link2,
  },
  {
    id: 'agreement',
    label: 'Subject-Verb Agreement',
    description: 'Hòa hợp chủ ngữ - động từ: số ít, số nhiều, trường hợp đặc biệt',
    icon: Scale,
  },
];