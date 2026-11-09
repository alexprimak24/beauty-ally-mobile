import { scale } from '@/design/responsiveNew'

import type { RoutineType } from './types'

export const routineEntryColors = {
  card: '#FFFFFF',
  darkText: '#212529',
  defaultBorder: '#F4F6F8',
  inactiveIcon: '#C7C7CC',
  mutedText: '#64748B',
  primaryRedBackground: '#ffe5e5',
  secondaryText: '#8E8E93',
  strongRed: '#e75a7c',
  timelineInactive: '#D1D1D6',
} as const

const routineThemes = {
  morning: {
    activeBackground: '#def2ff',
    activeBorder: 'rgba(200, 233, 255, 0.8)',
    activeIcon: '#1e75b8',
  },
  evening: {
    activeBackground: '#EEF1FF',
    activeBorder: 'rgba(184, 192, 234, 0.5)',
    activeIcon: '#6F7FCF',
  },
} as const

export const routineEntryLayout = {
  actionButtonWidth: scale(65),
  applyThreshold: scale(60),
  maxSwipeRight: scale(60) + scale(40),
}

export function getRoutineEntryTheme(routineType: RoutineType) {
  return routineThemes[routineType]
}
