import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

export interface SkillCardData {
  id: string
  part: string
  title: string
  description?: string
  icon: ComponentType<LucideProps>
  label?: string
  badge?: string
  buttonLabel?: string
  variant: 'grid' | 'horizontal' | 'featured' | 'dark'
}

export interface SkillGroupData {
  id: string
  title: string
  partsRange: string
  icon: ComponentType<LucideProps>
  iconBgClass: string
  iconColorClass: string
  skills: SkillCardData[]
}
