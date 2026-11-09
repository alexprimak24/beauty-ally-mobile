import type { ImageSourcePropType } from 'react-native'

export interface Language {
  code: string
  longCode: string
  langCode: string
  local: string
  english: string
  flag?: string
}

export interface genderOptionsEntry {
  label: string
  value: 'male' | 'female' | 'non-binary' | 'prefer not to say'
}

export interface WeatherOptionEntry {
  label: string
  icon: ImageSourcePropType
  value:
    | 'cool and dry'
    | 'cool and humid'
    | 'mild and dry'
    | 'warm and humid'
    | 'hot and dry'
    | 'hot and humid'
    | 'High UV Year Round'
}

export interface SkinTypeOptionEntry {
  label: string
  value: 'normal' | 'dry' | 'oily' | 'sensitive' | 'combination'
  explanation: string | null
}

export interface AllergyOptionEntry {
  label: string
  value:
    | 'alcohol'
    | 'fragrance'
    | 'essential oils'
    | 'lanolin'
    | 'coconut oil derivatives'
    | 'dyes'
    | 'mica'
    | 'no allergies'
  icon: ImageSourcePropType
  examples: string | null
}

export interface SkinConcernOptionEntry {
  label: string
  value:
    | 'breakouts'
    | 'redness or sensitivity'
    | 'clogged pores or blackheads'
    | 'hyperpigmentation or dark spots'
    | 'dryness or dehydration'
    | 'wrinkles or fine lines'
    | 'uneven texture or dullness'
    | 'large pores'
    | 'oily shine or greasy feeling'
    | 'none'
}

export interface CurrentTreatmentOptionEntry {
  label: string
  value:
    | 'retinol-based products'
    | 'vitamin C'
    | 'AHAs / BHAs '
    | 'benzoyl peroxide'
    | 'niacinamide'
    | 'prescription creams or gels'
    | 'oral acne medications'
    | 'no'
  icon: ImageSourcePropType
  explanation: string | null
  tooltipNeeded: boolean
}

export interface SunscreenFreqOptionEntry {
  label: string
  value: 'never' | 'occasionally' | 'sometimes' | 'almost daily' | 'daily'
}
