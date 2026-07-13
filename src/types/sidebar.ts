import type { LucideIcon } from 'lucide-react'
import type React from 'react'

export interface SectionItem {
  id: string
  label: string
}

export interface TopicItem {
  slug: string
  label: string
  description: string
  icon: LucideIcon
  difficulty: string
  estimatedMinutes: number
  sections: SectionItem[]
  questionCount?: number
}

export interface PracticeModule {
  id: string
  label: string
  description: string
  href: string
  icon: LucideIcon
  topics: TopicItem[]
}

export interface PracticeContext {
  module: {
    id: string
    label: string
    description: string
    icon: React.ComponentType<{ size?: number; className?: string }>
  } | null
  topics: TopicItem[]
  expandedFeature: string | null
  expandedModule: string | null
  expandedTopic: string | null
}
