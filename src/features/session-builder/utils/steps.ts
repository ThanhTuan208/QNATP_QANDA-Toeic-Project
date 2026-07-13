import { WIZARD_STEPS } from '@/features/session-builder/constants'
import type { SessionBuilderStep } from '@/features/session-builder/types'

export function getNextStep(current: SessionBuilderStep): SessionBuilderStep | null {
  const idx = WIZARD_STEPS.indexOf(current)
  return idx < WIZARD_STEPS.length - 1 ? WIZARD_STEPS[idx + 1] : null
}

export function getPrevStep(current: SessionBuilderStep): SessionBuilderStep | null {
  const idx = WIZARD_STEPS.indexOf(current)
  return idx > 0 ? WIZARD_STEPS[idx - 1] : null
}
