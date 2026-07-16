import type { PresetType } from '@/features/session-builder/types'
import type { SessionConfig, SessionQuestion } from '@/features/temp-session/types'

export interface Step4PreviewProps {
  preset: PresetType
  config: Partial<SessionConfig>
  source: 'system' | 'imported'
  questions: SessionQuestion[]
  onBack: () => void
  onConfigChange?: (config: Partial<SessionConfig>) => void
  onQuestionsChange?: (questions: SessionQuestion[]) => void
  isGenerating?: boolean
  generationError?: string
}
