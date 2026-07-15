import type { DistributionItem, AnyPartPreset } from './preset.types'

function validateDistribution<T>(
  distribution: readonly DistributionItem<T>[],
): void {
  const types = distribution.map(d => d.type)
  const unique = new Set(types)

  if (unique.size !== types.length) {
    throw new Error('Duplicate knowledge group type in distribution')
  }
  if (distribution.some(d => d.count <= 0)) {
    throw new Error('Each knowledge group must have count > 0')
  }
}

export function definePreset<T extends AnyPartPreset>(preset: T): T {
  validateDistribution(preset.distribution)
  return preset
}
