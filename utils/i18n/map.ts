import { languageOptions } from '@/constants/onboarding/onboardingData'

// "en-US" -> "EN"
export function codeFromLngTag(lngTag: string) {
  const lang = lngTag?.split('-')[0]?.toLowerCase() // "en"
  return languageOptions.find((o) => o.longCode.toLowerCase().startsWith(lang))?.code ?? 'EN'
}

// "EN" -> "en-US"
export function longCodeFromCode(code: string) {
  return languageOptions.find((o) => o.code === code)?.longCode ?? 'en-US'
}

// "en-US" -> English
export function englishFromLongCode(lng: string) {
  const normalizedTag = lng.toLowerCase()
  const languageCode = normalizedTag.split('-')[0]

  return (
    languageOptions.find(
      (option) =>
        option.longCode.toLowerCase() === normalizedTag || option.langCode === languageCode,
    )?.english ?? 'English'
  )
}

// "English" -> "en-US"
export function longCodeFromEnglish(english: string) {
  return languageOptions.find((lngObj) => lngObj.english === english)?.longCode ?? 'en-US'
}
