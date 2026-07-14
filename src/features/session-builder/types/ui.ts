import type { LucideProps } from 'lucide-react'
import type { PresetType } from '@/features/session-builder/types/preset'

export interface PresetOption {
  id: PresetType
  label: string
  description: string
  icon: React.ComponentType<LucideProps>
  subtext: string
}
