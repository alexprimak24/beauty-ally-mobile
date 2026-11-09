import type { TFunction } from 'i18next'
import { getDayOfYear } from 'date-fns'

export function getDailySkincareTip(t: TFunction, date: Date = new Date()): string {
  const tips = t('home.facts.list', { returnObjects: true }) as string[] | undefined
  if (!tips || tips.length === 0) return ''
  const index = getDayOfYear(date) % tips.length
  return tips[index]
}
