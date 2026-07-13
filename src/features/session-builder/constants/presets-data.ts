import { Bolt, Brain, FileCheck, Scale, SlidersHorizontal } from 'lucide-react'
import type { PresetOption } from '@/features/session-builder/types/ui'

export const PRESETS: PresetOption[] = [
  {
    id: 'quick',
    label: 'Quick Practice',
    description: '20 câu, Medium',
    icon: Bolt,
    subtext: 'Nhanh, tập trung Part 5',
  },
  {
    id: 'balanced',
    label: 'Balanced Practice',
    description: 'Đều các Part',
    icon: Scale,
    subtext: 'Cân bằng số câu mỗi phần',
  },
  {
    id: 'smart',
    label: 'Smart Practice',
    description: 'Theo điểm yếu',
    icon: Brain,
    subtext: 'Dựa trên lịch sử làm bài',
  },
  {
    id: 'exam',
    label: 'Exam Practice',
    description: 'Đúng tỉ lệ ETS',
    icon: FileCheck,
    subtext: 'Cấu trúc đề thi thật',
  },
  {
    id: 'custom',
    label: 'Build My Own',
    description: 'Tự cấu hình chi tiết',
    icon: SlidersHorizontal,
    subtext: 'Toàn quyền kiểm soát',
  },
]
