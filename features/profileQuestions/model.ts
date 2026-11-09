import { sunscreenFreqOptions, weatherOptions } from '@/constants/onboarding/onboardingData'

export interface ClimateSelection {
  index: number
  value: string
}

type IndexedSelection = ClimateSelection

function getInitialIndexedSelection(
  options: readonly { value: string }[],
  initial?: string,
): IndexedSelection {
  const index = options.findIndex((option) => option.value === initial)

  if (index < 0) return { index: 0, value: '' }

  return { index, value: options[index].value }
}

function getIndexedSelection(
  options: readonly { value: string }[],
  index: number,
): IndexedSelection {
  const safeIndex = Math.min(Math.max(Math.round(index), 0), options.length - 1)

  return { index: safeIndex, value: options[safeIndex].value }
}

export interface MultiSelectState {
  other: string
  selected: string[]
}

export function getInitialClimateSelection(initial?: string): ClimateSelection {
  return getInitialIndexedSelection(weatherOptions, initial)
}

export function getClimateSelection(index: number): ClimateSelection {
  return getIndexedSelection(weatherOptions, index)
}

export function getInitialSunscreenSelection(initial?: string): IndexedSelection {
  return getInitialIndexedSelection(sunscreenFreqOptions, initial)
}

export function getSunscreenSelection(index: number): IndexedSelection {
  return getIndexedSelection(sunscreenFreqOptions, index)
}

export function parseSelection(value?: string): string[] {
  if (!value) return []

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function getInitialMultiSelectState(
  initial: string | undefined,
  knownValues: readonly string[],
  supportsOther: boolean,
): MultiSelectState {
  const values = parseSelection(initial)
  const hasUnknownValue = values.some((value) => !knownValues.includes(value))

  if (supportsOther && hasUnknownValue) {
    return { other: initial?.trim() ?? '', selected: [] }
  }

  return {
    other: '',
    selected: values.filter((value) => knownValues.includes(value)),
  }
}

export function toggleExclusiveSelection(
  selected: readonly string[],
  value: string,
  exclusiveValue: string,
): string[] {
  if (value === exclusiveValue) return [exclusiveValue]
  if (selected.includes(exclusiveValue)) return [value]
  if (selected.includes(value)) return selected.filter((entry) => entry !== value)

  return [...selected, value]
}

export function serializeSelection(selected: readonly string[], other = ''): string {
  return selected.length > 0 ? selected.join(',') : other.trim()
}
