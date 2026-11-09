import { icons } from '@/constants/icons'

export const scanResultTranslationKeys = {
  breakoutRisk: {
    title: 'result.staticText.breakoutRisk',
    option0: 'result.breakoutRisk.option0',
    option1: 'result.breakoutRisk.option1',
    option2: 'result.breakoutRisk.option2',
  },
  routineCompatibility: {
    title: 'result.staticText.routineCompatibility',
    option0: 'result.routineCompatibility.option0',
    option1: 'result.routineCompatibility.option1',
    option2: 'result.routineCompatibility.option2',
  },
  guidance: {
    bestTime: {
      evening: 'result.bestTime.evening',
      morning: 'result.bestTime.morning',
    },
    frequencyTitle: 'result.staticText.frequency',
    bestTimeTitle: 'result.staticText.bestTime',
  },
} as const

export const resultVerdictConfig = {
  generally: { color: '#E7FAEB', icon: icons.success, textColor: '#218837' },
  mightNotAlign: { color: '#FFF7DA', icon: icons.warn, textColor: '#B67D00' },
  lowMatch: { color: '#FFE6E6', icon: icons.cancel, textColor: '#CC2626' },
} as const

export const resultScoreColors = {
  red: '#FF9B8B',
  orange: '#FFDD7A',
  green: '#90EBB1',
} as const

export const resultSpring = {
  damping: 20,
  stiffness: 400,
  mass: 1,
} as const
