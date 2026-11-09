/// <reference types="jest" />

import { scanResultTranslationKeys } from '../constants'
import {
  getBestTimeCardConfig,
  getBreakoutRiskCardConfig,
  getCompatibilityCardConfig,
  getFrequencyCardConfig,
} from '../model'

describe('scan result model', () => {
  it.each([
    [0, scanResultTranslationKeys.routineCompatibility.option0],
    [1, scanResultTranslationKeys.routineCompatibility.option1],
    [2, scanResultTranslationKeys.routineCompatibility.option2],
    [99, scanResultTranslationKeys.routineCompatibility.option1],
  ])('maps compatibility score %i to a stable card', (score, value) => {
    expect(getCompatibilityCardConfig(score)).toMatchObject({
      title: scanResultTranslationKeys.routineCompatibility.title,
      value,
    })
  })

  it.each([
    [0, scanResultTranslationKeys.breakoutRisk.option0],
    [1, scanResultTranslationKeys.breakoutRisk.option1],
    [2, scanResultTranslationKeys.breakoutRisk.option2],
    [99, scanResultTranslationKeys.breakoutRisk.option1],
  ])('maps breakout score %i to a stable card', (score, value) => {
    expect(getBreakoutRiskCardConfig(score)).toMatchObject({
      title: scanResultTranslationKeys.breakoutRisk.title,
      value,
    })
  })

  it('maps best-time and frequency guidance', () => {
    expect(getBestTimeCardConfig('evening')).toMatchObject({
      value: scanResultTranslationKeys.guidance.bestTime.evening,
      backgroundColor: '#F0F7FF',
    })
    expect(getBestTimeCardConfig('unknown')).toMatchObject({
      value: scanResultTranslationKeys.guidance.bestTime.morning,
      backgroundColor: '#FFFBEB',
    })
    expect(getFrequencyCardConfig('2', 'week')).toMatchObject({
      value: '2',
      frequency: 'week',
      backgroundColor: '#F6F6FF',
    })
  })
})
