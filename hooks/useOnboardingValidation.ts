import type { UserData } from '@/types/userEntry'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Key = keyof UserData

const DEFAULT_REQUIRED: Key[] = [
  'gender',
  'climate',
  'skinType',
  'allergies',
  'skinConcerns',
  'activeTreatment',
  'sunscreenUsage',
]

// fallback prettifier if no i18n label exists
function prettify(field: string) {
  return field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

export interface ValidationResult {
  isValid: boolean
  missing: Key[]
  /** Localized, human-readable message for UI (or undefined if valid) */
  message?: string
}

export interface UseOnboardingValidationOptions {
  /** Override which fields are required */
  requiredFields?: Key[]
}

/**
 * Validates onboarding profile fields with i18n’d messages.
 * Looks up field labels in `common.fields.<field>` and falls back to a prettified key.
 */
export function useOnboardingValidation(opts: UseOnboardingValidationOptions = {}) {
  const { t } = useTranslation('common')
  const required = opts.requiredFields ?? DEFAULT_REQUIRED

  const labelFor = useCallback((k: Key) => t(`fields.${k}`, prettify(String(k))), [t])

  const validate = (data?: UserData): ValidationResult => {
    if (!data) {
      return {
        isValid: false,
        missing: required,
        message: t('onboardingValidation.noData'),
      }
    }

    const missing = required.filter((field) => {
      const v = data[field] as unknown
      if (Array.isArray(v)) return v.length === 0
      if (v === undefined || v === null) return true
      return String(v).trim() === ''
    })

    if (missing.length === 0) {
      return { isValid: true, missing: [] }
    }

    const readableList = missing.map(labelFor).join(', ')
    return {
      isValid: false,
      missing,
      message: t('onboardingValidation.incomplete', { fields: readableList }),
    }
  }

  // expose a memoized labels map if you need to render per-field errors later
  const fieldLabels = useMemo(
    () => Object.fromEntries(required.map((k) => [k, labelFor(k)])) as Record<Key, string>,
    [labelFor, required],
  )

  return { validate, requiredFields: required, fieldLabels }
}
