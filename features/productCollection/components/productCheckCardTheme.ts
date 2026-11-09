import { scale } from '@/design/responsiveNew'

export const productCheckCardColors = {
  applyIcon: '#1e75b8',
  card: '#FFFFFF',
  defaultBorder: '#F4F6F8',
  inactiveIcon: '#C7C7CC',
  lightBadge: '#F4F6F8',
  lightBlue: '#def2ff',
  lightBlueBorder: 'rgba(200, 233, 255, 0.8)',
  primaryRed: '#ffe5e5',
  primaryText: '#212529',
  secondaryText: '#8E8E93',
  strongRed: '#e75a7c',
} as const

export const productCheckCardMetrics = {
  applyThreshold: scale(90),
  maxSwipeRight: scale(130),
  rightActionsWidth: scale(130),
} as const
