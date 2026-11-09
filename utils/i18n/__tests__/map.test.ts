/// <reference types="jest" />

import { codeFromLngTag, englishFromLongCode, longCodeFromCode, longCodeFromEnglish } from '../map'

describe('language tag mapping', () => {
  it('maps exact supported language tags', () => {
    expect(englishFromLongCode('uk-UA')).toBe('Ukrainian')
    expect(codeFromLngTag('uk-UA')).toBe('UA')
  })

  it('maps regional system tags by their language code', () => {
    expect(englishFromLongCode('ar-AE')).toBe('Arabic')
    expect(englishFromLongCode('en-GB')).toBe('English')
    expect(codeFromLngTag('zh-Hant')).toBe('CN')
  })

  it('falls back to English for unsupported tags', () => {
    expect(englishFromLongCode('xx-ZZ')).toBe('English')
    expect(codeFromLngTag('xx-ZZ')).toBe('EN')
  })

  it('maps picker and profile values back to language tags', () => {
    expect(longCodeFromCode('UA')).toBe('uk-UA')
    expect(longCodeFromEnglish('Ukrainian')).toBe('uk-UA')
    expect(longCodeFromCode('unknown')).toBe('en-US')
    expect(longCodeFromEnglish('unknown')).toBe('en-US')
  })
})
