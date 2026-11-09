// utils/getCompliment.ts
import type { TFunction } from 'i18next'
import { getDay, getWeek } from 'date-fns'

type GenderKey = 'male' | 'female' | 'neutral'

// Map your stored gender -> compliments bucket
// (adjust if your saved values differ)
export function mapProfileGenderToKey(g?: string | null): GenderKey {
  if (!g) return 'neutral'
  const s = g.toLowerCase()
  if (s === 'male' || s === 'm' || s === 'man') return 'male'
  if (s === 'female' || s === 'f' || s === 'woman') return 'female'
  // non-binary / preferNot / anything else
  return 'neutral'
}

function pickRotated(list: string[], date: Date) {
  const day = getDay(date)
  const week = getWeek(date) % list.length
  const index = (day + week) % list.length
  return list[index]
}

/**
 * Pulls a compliment list based on gender, with graceful fallbacks:
 * 1) home.compliments.[male|female|neutral]
 * 2) home.compliments.neutral
 * 3) home.compliments.list (legacy single list)
 */
export function getComplimentRotated(
  t: TFunction,
  genderKey: GenderKey,
  date: Date = new Date(),
): string {
  // Try gender bucket
  let list = t(`home.compliments.${genderKey}`, { returnObjects: true }) as string[] | undefined
  if (!Array.isArray(list) || list.length === 0) {
    // Fallback to neutral
    list = t('home.compliments.neutral', { returnObjects: true }) as string[] | undefined
  }
  if (!Array.isArray(list) || list.length === 0) {
    // Legacy fallback
    list = t('home.compliments.list', { returnObjects: true }) as string[] | undefined
  }
  if (!Array.isArray(list) || list.length === 0) return ''

  return pickRotated(list, date)
}
