import { icons } from '@/constants/icons'
import { scanResultTranslationKeys } from './constants'
import type { ResultCardConfig } from './types'

const neutralBackground = '#f4f4f4c0'

export function getCompatibilityCardConfig(value = 0): ResultCardConfig {
  switch (value) {
    case 0:
      return {
        image: icons.matchNotIdeal,
        title: scanResultTranslationKeys.routineCompatibility.title,
        value: scanResultTranslationKeys.routineCompatibility.option0,
        backgroundColor: neutralBackground,
      }
    case 1:
      return {
        image: icons.matchGood,
        title: scanResultTranslationKeys.routineCompatibility.title,
        value: scanResultTranslationKeys.routineCompatibility.option1,
        backgroundColor: neutralBackground,
      }
    case 2:
      return {
        image: icons.matchGreat,
        title: scanResultTranslationKeys.routineCompatibility.title,
        value: scanResultTranslationKeys.routineCompatibility.option2,
        backgroundColor: neutralBackground,
      }
    default:
      return {
        image: icons.matchGood,
        title: scanResultTranslationKeys.routineCompatibility.title,
        value: scanResultTranslationKeys.routineCompatibility.option1,
        backgroundColor: neutralBackground,
      }
  }
}

export function getBreakoutRiskCardConfig(value = 0): ResultCardConfig {
  switch (value) {
    case 0:
      return {
        image: icons.breakoutLikely,
        title: scanResultTranslationKeys.breakoutRisk.title,
        value: scanResultTranslationKeys.breakoutRisk.option0,
        backgroundColor: neutralBackground,
      }
    case 1:
      return {
        image: icons.breakoutPossible,
        title: scanResultTranslationKeys.breakoutRisk.title,
        value: scanResultTranslationKeys.breakoutRisk.option1,
        backgroundColor: neutralBackground,
      }
    case 2:
      return {
        image: icons.breakoutUnlikely,
        title: scanResultTranslationKeys.breakoutRisk.title,
        value: scanResultTranslationKeys.breakoutRisk.option2,
        backgroundColor: neutralBackground,
      }
    default:
      return {
        image: icons.breakoutPossible,
        title: scanResultTranslationKeys.breakoutRisk.title,
        value: scanResultTranslationKeys.breakoutRisk.option1,
        backgroundColor: neutralBackground,
      }
  }
}

export function getBestTimeCardConfig(value: string): ResultCardConfig {
  if (value === 'evening') {
    return {
      image: icons.applyNight,
      title: scanResultTranslationKeys.guidance.bestTimeTitle,
      value: scanResultTranslationKeys.guidance.bestTime.evening,
      backgroundColor: '#F0F7FF',
    }
  }

  return {
    image: icons.applyMorning,
    title: scanResultTranslationKeys.guidance.bestTimeTitle,
    value: scanResultTranslationKeys.guidance.bestTime.morning,
    backgroundColor: '#FFFBEB',
  }
}

export function getFrequencyCardConfig(value: string, frequency?: string): ResultCardConfig {
  return {
    image: icons.calendar,
    title: scanResultTranslationKeys.guidance.frequencyTitle,
    value,
    frequency,
    backgroundColor: '#F6F6FF',
  }
}
