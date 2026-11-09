import { CONSENT_VERSION, POLICY_VERSION, TERMS_VERSION } from '@/constants/consents'
import {
  allergiesAndSensitivitiesOptions,
  currentTreatmentOptions,
  genderOptions,
  skinConcernsOptions,
  skinTypeOptions,
  sunscreenFreqOptions,
  weatherOptions,
} from '@/constants/onboarding/onboardingData'
import type { ConsentRecord } from '@/context/consentContext'
import type { UserData } from '@/types/userEntry'
import { codeFromLngTag, longCodeFromEnglish } from '@/utils/i18n/map'
import type { Href } from 'expo-router'

interface BuildHealthDataConsentRecordOptions {
  consentedAt: string
  locale: string
  textHash: string
}

interface BuildSupportMailtoUrlOptions {
  body: string
  subject: string
}

interface ProfileOption {
  label: string
  value: string
}

interface SkinProfileTranslations {
  translateComponent: (key: string) => string
  translateOnboarding: (key: string) => string
}

export interface SkinProfileDisplayRow {
  field: keyof UserData
  label: string
  route: Href
  value: string
}

const PROFILE_EDIT_ROUTES = {
  gender: '/(protected)/(modals)/edit/gender',
  climate: '/(protected)/(modals)/edit/climate',
  skinType: '/(protected)/(modals)/edit/skin-type',
  allergies: '/(protected)/(modals)/edit/allergies',
  skinConcerns: '/(protected)/(modals)/edit/skin-concerns',
  activeTreatment: '/(protected)/(modals)/edit/active-treatments',
  sunscreenUsage: '/(protected)/(modals)/edit/sunscreen',
} as const satisfies Partial<Record<keyof UserData, Href>>

function formatProfileValue(
  raw: string | undefined,
  options: ProfileOption[],
  translate: (key: string) => string,
  emptyValue: string,
) {
  if (!raw?.trim()) return emptyValue

  const values = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (values.length === 0) return emptyValue

  return values
    .map((value) => {
      const option = options.find((candidate) => candidate.value.trim() === value)
      return option ? translate(option.label) : value
    })
    .join(', ')
}

export function buildSkinProfileRows(
  profile: UserData | undefined,
  { translateComponent, translateOnboarding }: SkinProfileTranslations,
): SkinProfileDisplayRow[] {
  const emptyValue = translateComponent('mySkinProfileBtn.none')
  const row = (
    field: keyof typeof PROFILE_EDIT_ROUTES,
    labelKey: string,
    options: ProfileOption[],
  ): SkinProfileDisplayRow => ({
    field,
    label: translateComponent(labelKey),
    route: PROFILE_EDIT_ROUTES[field],
    value: formatProfileValue(profile?.[field], options, translateOnboarding, emptyValue),
  })

  return [
    row('gender', 'mySkinProfileBtn.fields.gender', genderOptions),
    row('climate', 'mySkinProfileBtn.fields.climate', weatherOptions),
    row('skinType', 'mySkinProfileBtn.fields.skinType', skinTypeOptions),
    row('allergies', 'mySkinProfileBtn.fields.allergies', allergiesAndSensitivitiesOptions),
    row('skinConcerns', 'mySkinProfileBtn.fields.skinConcerns', skinConcernsOptions),
    row('activeTreatment', 'mySkinProfileBtn.fields.activeTreatment', currentTreatmentOptions),
    row('sunscreenUsage', 'mySkinProfileBtn.fields.sunscreenUsage', sunscreenFreqOptions),
  ]
}

export function buildHealthDataConsentRecord({
  consentedAt,
  locale,
  textHash,
}: BuildHealthDataConsentRecordOptions): ConsentRecord {
  return {
    consentVersion: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    termsVersion: TERMS_VERSION,
    consentType: 'health_data',
    consentedAt,
    method: 'settings',
    locale,
    textHash,
  }
}

export function buildSupportMailtoUrl({ body, subject }: BuildSupportMailtoUrlOptions) {
  return `mailto:support@beautyai.site?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function normalizeProfileName(name: string) {
  const normalizedName = name.trim()
  return normalizedName.length > 0 ? normalizedName : null
}

export function getProfileLanguageTagToSync(
  profileLanguage: string | undefined,
  savedLanguageTag: string | null,
) {
  if (!profileLanguage) return null

  const profileLanguageTag = longCodeFromEnglish(profileLanguage)
  const savedLanguageCode = savedLanguageTag ? codeFromLngTag(savedLanguageTag) : null

  return savedLanguageCode === codeFromLngTag(profileLanguageTag) ? null : profileLanguageTag
}
