export type {
  AnyPartPreset,
  DistributionItem,
  Part5Preset,
  Part6Preset,
  Part7Preset,
  PartPreset,
  PresetDifficulty,
} from './preset.types'
export { PRESET_DIFFICULTY } from './preset.types'
export { definePreset } from './preset.utils'

import { PART5_PRESETS } from './part5.presets'
import { PART6_PRESETS } from './part6.presets'
import { PART7_PRESETS } from './part7.presets'

export {
  P5_BALANCED,
  P5_CHALLENGE,
  P5_GRAMMAR_HEAVY,
  P5_PREPOSITION_MASTER,
  P5_SPEED,
  P5_VOCAB_FOCUSED,
  PART5_PRESETS,
} from './part5.presets'
export {
  P6_BALANCED,
  P6_GRAMMAR_HEAVY,
  P6_INSERTION_DRILL,
  P6_SPEED,
  P6_VOCAB_FOCUSED,
  PART6_PRESETS,
} from './part6.presets'
export {
  P7_BALANCED,
  P7_CHALLENGE,
  P7_DETAIL_HEAVY,
  P7_INFERENCE_HEAVY,
  P7_SPEED,
  P7_REFERENCE_DRILL,
  PART7_PRESETS,
} from './part7.presets'

export const SYSTEM_PRESETS = [...PART5_PRESETS, ...PART6_PRESETS, ...PART7_PRESETS] as const
