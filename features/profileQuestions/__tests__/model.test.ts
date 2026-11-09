/// <reference types="jest" />

import { weatherOptions } from '@/constants/onboarding/onboardingData'
import {
  getClimateSelection,
  getInitialClimateSelection,
  getInitialMultiSelectState,
  getInitialSunscreenSelection,
  parseSelection,
  serializeSelection,
  getSunscreenSelection,
  toggleExclusiveSelection,
} from '../model'

describe('profile question model', () => {
  it('restores a valid saved climate selection', () => {
    expect(getInitialClimateSelection('warm and humid')).toEqual({
      index: 3,
      value: 'warm and humid',
    })
  })

  it('uses a safe unselected state for missing or stale climate values', () => {
    expect(getInitialClimateSelection()).toEqual({ index: 0, value: '' })
    expect(getInitialClimateSelection('unknown climate')).toEqual({ index: 0, value: '' })
  })

  it('rounds and bounds slider values to available climate options', () => {
    expect(getClimateSelection(1.6)).toEqual({
      index: 2,
      value: weatherOptions[2].value,
    })
    expect(getClimateSelection(-10)).toEqual({
      index: 0,
      value: weatherOptions[0].value,
    })
    expect(getClimateSelection(100)).toEqual({
      index: weatherOptions.length - 1,
      value: weatherOptions.at(-1)?.value,
    })
  })
})

describe('sunscreen question model', () => {
  it('restores a saved frequency and safely handles invalid values', () => {
    expect(getInitialSunscreenSelection('almost daily')).toEqual({
      index: 3,
      value: 'almost daily',
    })
    expect(getInitialSunscreenSelection('unknown')).toEqual({ index: 0, value: '' })
  })

  it('bounds sunscreen slider values', () => {
    expect(getSunscreenSelection(-1)).toEqual({ index: 0, value: 'never' })
    expect(getSunscreenSelection(100)).toEqual({ index: 4, value: 'daily' })
  })
})

describe('multi-select question model', () => {
  const knownValues = ['none', 'dryness', 'breakouts']

  it('parses and serializes comma-separated selections', () => {
    expect(parseSelection()).toEqual([])
    expect(parseSelection(' dryness, breakouts, ')).toEqual(['dryness', 'breakouts'])
    expect(serializeSelection(['dryness', 'breakouts'])).toBe('dryness,breakouts')
    expect(serializeSelection([], ' custom concern ')).toBe('custom concern')
  })

  it('restores known selections and preserves custom answers as other text', () => {
    expect(getInitialMultiSelectState('dryness,breakouts', knownValues, true)).toEqual({
      other: '',
      selected: ['dryness', 'breakouts'],
    })
    expect(getInitialMultiSelectState('custom concern', knownValues, true)).toEqual({
      other: 'custom concern',
      selected: [],
    })
    expect(getInitialMultiSelectState('stale value', knownValues, false)).toEqual({
      other: '',
      selected: [],
    })
  })

  it('keeps the none option mutually exclusive', () => {
    expect(toggleExclusiveSelection(['dryness'], 'none', 'none')).toEqual(['none'])
    expect(toggleExclusiveSelection(['none'], 'breakouts', 'none')).toEqual(['breakouts'])
    expect(toggleExclusiveSelection(['dryness'], 'breakouts', 'none')).toEqual([
      'dryness',
      'breakouts',
    ])
    expect(toggleExclusiveSelection(['dryness', 'breakouts'], 'dryness', 'none')).toEqual([
      'breakouts',
    ])
  })
})
