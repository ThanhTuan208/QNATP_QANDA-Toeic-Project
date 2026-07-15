export { definePreset } from './preset.utils'

export type {
  DistributionItem,
  PresetDifficulty,
  PartPreset,
  Part5Preset,
  Part6Preset,
  Part7Preset,
  AnyPartPreset,
} from './preset.types'

export { PRESET_DIFFICULTY } from './preset.types'

import { PART5_PRESETS } from './part5.presets'
import { PART6_PRESETS } from './part6.presets'
import { PART7_PRESETS } from './part7.presets'

export {
  PART5_PRESETS,
  P5_BALANCED,
  P5_GRAMMAR_HEAVY,
  P5_VOCAB_FOCUSED,
  P5_SPEED,
  P5_CHALLENGE,
  P5_PREPOSITION_MASTER,
} from './part5.presets'
export {
  PART6_PRESETS,
  P6_BALANCED,
  P6_GRAMMAR_HEAVY,
  P6_VOCAB_FOCUSED,
  P6_INSERTION_DRILL,
  P6_SPEED,
} from './part6.presets'
export {
  PART7_PRESETS,
  P7_BALANCED,
  P7_SINGLE_HEAVY,
  P7_TRIPLE_HEAVY,
  P7_DOUBLE_HEAVY,
  P7_SPEED,
  P7_CHALLENGE,
} from './part7.presets'

export const SYSTEM_PRESETS = [
  ...PART5_PRESETS,
  ...PART6_PRESETS,
  ...PART7_PRESETS,
] as const
