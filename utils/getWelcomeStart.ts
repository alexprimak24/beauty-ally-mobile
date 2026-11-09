// utils/getWelcomeStart.ts
import type { TFunction } from 'i18next'

export type GenderKey = 'male' | 'female' | 'neutral'

/**
 * Pulls a gender-aware welcomeStart with fallbacks:
 * 1) home.welcomeStart.male|female|neutral
 * 2) home.welcomeStart.neutral
 * 3) home.welcomeStart (single string, e.g., English)
 */
export function getWelcomeStart(t: TFunction, genderKey: GenderKey): string {
  // try gendered buckets
  let value = t(`home.welcomeStart.${genderKey}`, { defaultValue: '' })
  if (value) return value

  // try neutral bucket
  value = t('home.welcomeStart.neutral', { defaultValue: '' })
  if (value) return value

  // fall back to single string variant
  return t('home.welcomeStart')
}
