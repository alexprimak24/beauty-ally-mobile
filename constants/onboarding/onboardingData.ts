import type {
  AllergyOptionEntry,
  CurrentTreatmentOptionEntry,
  genderOptionsEntry,
  Language,
  SkinConcernOptionEntry,
  SkinTypeOptionEntry,
  SunscreenFreqOptionEntry,
  WeatherOptionEntry,
} from '@/types/onboardingDataTypes'
import { allergies } from './allergies'
import { climate } from './climate'
import { currentTreatment } from './currentTreatment'

///////////////////////////////////////////////////////////////////
/// //IF I AM CHANGING SOMETHING, ALSO ADD IT TO THE INTERFACE//////
///////////////////////////////////////////////////////////////////

export const languageOptions: Language[] = [
  {
    code: 'EN',
    longCode: 'en-US',
    langCode: 'en',
    local: 'English',
    english: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'CN',
    longCode: 'zh-Hans',
    langCode: 'zh',
    local: '简体中文',
    english: 'Chinese (Simplified)',
    flag: '🇨🇳',
  },
  {
    code: 'BR',
    longCode: 'pt-BR',
    langCode: 'pt',
    local: 'Português (Brasil)',
    english: 'Portuguese (Brazil)',
    flag: '🇧🇷',
  },
  {
    code: 'ES',
    longCode: 'es-ES',
    langCode: 'es',
    local: 'Español',
    english: 'Spanish',
    flag: '🇪🇸',
  },
  {
    code: 'IN',
    longCode: 'hi-IN',
    langCode: 'hi',
    local: 'हिन्दी',
    english: 'Hindi',
    flag: '🇮🇳',
  },
  {
    code: 'FR',
    longCode: 'fr-FR',
    langCode: 'fr',
    local: 'Français',
    english: 'French',
    flag: '🇫🇷',
  },
  {
    code: 'DE',
    longCode: 'de-DE',
    langCode: 'de',
    local: 'Deutsch',
    english: 'German',
    flag: '🇩🇪',
  },
  {
    code: 'UA',
    longCode: 'uk-UA',
    langCode: 'uk',
    local: 'Українська',
    english: 'Ukrainian',
    flag: '🇺🇦',
  },
  {
    code: 'PL',
    longCode: 'pl-PL',
    langCode: 'pl',
    local: 'Polski',
    english: 'Polish',
    flag: '🇵🇱',
  },
  {
    code: 'RU',
    longCode: 'ru-RU',
    langCode: 'ru',
    local: 'Русский',
    english: 'Russian',
    flag: '🇷🇺',
  },
  {
    code: 'AE',
    longCode: 'ar',
    langCode: 'ar',
    local: 'العربية',
    english: 'Arabic',
    flag: '🇦🇪',
  },
  {
    code: 'KR',
    longCode: 'ko-KR',
    langCode: 'ko',
    local: '한국어',
    english: 'Korean',
    flag: '🇰🇷',
  },
  {
    code: 'JP',
    langCode: 'ja',
    longCode: 'ja-JP',
    local: '日本語',
    english: 'Japanese',
    flag: '🇯🇵',
  },
] as const

/** GENDER */
export const genderOptions: genderOptionsEntry[] = [
  { label: 'gender.male.label', value: 'male' },
  { label: 'gender.female.label', value: 'female' },
  { label: 'gender.nonBinary.label', value: 'non-binary' },
  { label: 'gender.preferNot.label', value: 'prefer not to say' },
]

/** WEATHER */
export const weatherOptions: WeatherOptionEntry[] = [
  { label: 'weather.coolDry.label', icon: climate.coolDry, value: 'cool and dry' },
  { label: 'weather.coolHumid.label', icon: climate.coolHumid, value: 'cool and humid' },
  { label: 'weather.mildDry.label', icon: climate.mildDry, value: 'mild and dry' },
  { label: 'weather.warmHumid.label', icon: climate.warmHumid, value: 'warm and humid' },
  { label: 'weather.hotDry.label', icon: climate.hotDry, value: 'hot and dry' },
  { label: 'weather.hotHumid.label', icon: climate.hotHumid, value: 'hot and humid' },
  {
    label: 'weather.highUVYearRound.label',
    icon: climate.highYearRound,
    value: 'High UV Year Round',
  },
]

/** SKIN TYPE */
export const skinTypeOptions: SkinTypeOptionEntry[] = [
  { label: 'skinType.normal.label', value: 'normal', explanation: null },
  { label: 'skinType.dry.label', value: 'dry', explanation: null },
  { label: 'skinType.oily.label', value: 'oily', explanation: null },
  { label: 'skinType.sensitive.label', value: 'sensitive', explanation: null },
  {
    label: 'skinType.combination.label',
    value: 'combination',
    explanation: 'skinType.combination.explanation',
  },
]

/** ALLERGIES & SENSITIVITIES */
export const allergiesAndSensitivitiesOptions: AllergyOptionEntry[] = [
  {
    label: 'allergies.none.label',
    value: 'no allergies',
    icon: allergies.none,
    examples: null,
  },
  {
    label: 'allergies.alcohol.label',
    value: 'alcohol',
    icon: allergies.alcohol,
    examples: 'allergies.alcohol.examples',
  },
  {
    label: 'allergies.fragrance.label',
    value: 'fragrance',
    icon: allergies.fragrance,
    examples: 'allergies.fragrance.examples',
  },
  {
    label: 'allergies.essentialOils.label',
    value: 'essential oils',
    icon: allergies.essentialOils,
    examples: 'allergies.essentialOils.examples',
  },
  {
    label: 'allergies.lanolin.label',
    value: 'lanolin',
    icon: allergies.lanolin,
    examples: 'allergies.lanolin.examples',
  },
  {
    label: 'allergies.coconutOil.label',
    value: 'coconut oil derivatives',
    icon: allergies.coconutOil,
    examples: 'allergies.coconutOil.examples',
  },
  {
    label: 'allergies.dyes.label',
    value: 'dyes',
    icon: allergies.dyes,
    examples: 'allergies.dyes.examples',
  },
  {
    label: 'allergies.mica.label',
    value: 'mica',
    icon: allergies.mica,
    examples: 'allergies.mica.examples',
  },
]

/** SKIN CONCERNS */
export const skinConcernsOptions: SkinConcernOptionEntry[] = [
  { label: 'skinConcerns.none.label', value: 'none' },
  { label: 'skinConcerns.rednessSensitivity.label', value: 'redness or sensitivity' },
  { label: 'skinConcerns.cloggedPores.label', value: 'clogged pores or blackheads' },
  { label: 'skinConcerns.breakouts.label', value: 'breakouts' },
  { label: 'skinConcerns.hyperpigmentation.label', value: 'hyperpigmentation or dark spots' },
  { label: 'skinConcerns.dryness.label', value: 'dryness or dehydration' },
  { label: 'skinConcerns.wrinkles.label', value: 'wrinkles or fine lines' },
  { label: 'skinConcerns.unevenTexture.label', value: 'uneven texture or dullness' },
  { label: 'skinConcerns.largePores.label', value: 'large pores' },
  { label: 'skinConcerns.oilyShine.label', value: 'oily shine or greasy feeling' },
]

/** CURRENT TREATMENT */
export const currentTreatmentOptions: CurrentTreatmentOptionEntry[] = [
  {
    label: 'currentTreatment.no.label',
    value: 'no',
    icon: currentTreatment.none,
    explanation: 'currentTreatment.no.explanation',
    tooltipNeeded: false,
  },
  {
    label: 'currentTreatment.retinol.label',
    value: 'retinol-based products',
    icon: currentTreatment.retinolBasedProducts,
    explanation: 'currentTreatment.retinol.explanation',
    tooltipNeeded: true,
  },
  {
    label: 'currentTreatment.vitaminC.label',
    value: 'vitamin C',
    icon: currentTreatment.vitaminC,
    explanation: 'currentTreatment.vitaminC.explanation',
    tooltipNeeded: false,
  },
  {
    label: 'currentTreatment.ahaBha.label',
    value: 'AHAs / BHAs ',
    icon: currentTreatment.ahaBha,
    explanation: 'currentTreatment.ahaBha.explanation',
    tooltipNeeded: false,
  },
  {
    label: 'currentTreatment.benzoyl.label',
    value: 'benzoyl peroxide',
    icon: currentTreatment.benzoyl,
    explanation: 'currentTreatment.benzoyl.explanation',
    tooltipNeeded: false,
  },
  {
    label: 'currentTreatment.niacinamide.label',
    value: 'niacinamide',
    icon: currentTreatment.niacinamide,
    explanation: 'currentTreatment.niacinamide.explanation',
    tooltipNeeded: false,
  },
  {
    label: 'currentTreatment.prescriptionCreams.label',
    value: 'prescription creams or gels',
    icon: currentTreatment.prescriptionCreams,
    explanation: 'currentTreatment.prescriptionCreams.explanation',
    tooltipNeeded: true,
  },
  {
    label: 'currentTreatment.strongAcne.label',
    value: 'oral acne medications',
    icon: currentTreatment.strongAcneMedications,
    explanation: 'currentTreatment.strongAcne.explanation',
    tooltipNeeded: true,
  },
]

/** SUNSCREEN */
export const sunscreenFreqOptions: SunscreenFreqOptionEntry[] = [
  { label: 'sunscreenUsage.never.label', value: 'never' },
  { label: 'sunscreenUsage.occasionally.label', value: 'occasionally' },
  { label: 'sunscreenUsage.sometimes.label', value: 'sometimes' },
  { label: 'sunscreenUsage.almostDaily.label', value: 'almost daily' },
  { label: 'sunscreenUsage.daily.label', value: 'daily' },
]
