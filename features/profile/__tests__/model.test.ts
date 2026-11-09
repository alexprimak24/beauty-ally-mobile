/// <reference types="jest" />

import {
  buildHealthDataConsentRecord,
  buildSkinProfileRows,
  buildSupportMailtoUrl,
  getProfileLanguageTagToSync,
  normalizeProfileName,
} from '../model'

describe('profile model', () => {
  it('returns the profile language tag when the local language differs', () => {
    expect(getProfileLanguageTagToSync('Ukrainian', 'en-US')).toBe('uk-UA')
  })

  it('returns the profile language tag when no local preference exists', () => {
    expect(getProfileLanguageTagToSync('Spanish', null)).toBe('es-ES')
  })

  it('does not sync equivalent language tags', () => {
    expect(getProfileLanguageTagToSync('English', 'en-GB')).toBeNull()
    expect(getProfileLanguageTagToSync(undefined, 'en-US')).toBeNull()
  })
})

describe('skin profile model', () => {
  const translateComponent = (key: string) => `component:${key}`
  const translateOnboarding = (key: string) => `onboarding:${key}`

  it('builds translated rows for known profile options', () => {
    const rows = buildSkinProfileRows(
      { gender: 'female', skinType: 'sensitive' },
      { translateComponent, translateOnboarding },
    )

    expect(rows.find((row) => row.field === 'gender')?.value).toBe('onboarding:gender.female.label')
    expect(rows.find((row) => row.field === 'skinType')?.value).toBe(
      'onboarding:skinType.sensitive.label',
    )
  })

  it('translates known list values while preserving custom entries', () => {
    const rows = buildSkinProfileRows(
      { allergies: 'fragrance, custom allergy' },
      { translateComponent, translateOnboarding },
    )

    expect(rows.find((row) => row.field === 'allergies')?.value).toBe(
      'onboarding:allergies.fragrance.label, custom allergy',
    )
  })

  it('uses the localized empty value for missing fields', () => {
    const rows = buildSkinProfileRows(undefined, { translateComponent, translateOnboarding })
    const blankListRows = buildSkinProfileRows(
      { allergies: ' , ' },
      { translateComponent, translateOnboarding },
    )

    expect(rows.every((row) => row.value === 'component:mySkinProfileBtn.none')).toBe(true)
    expect(blankListRows.find((row) => row.field === 'allergies')?.value).toBe(
      'component:mySkinProfileBtn.none',
    )
  })
})

describe('profile settings model', () => {
  it('builds a versioned health-data consent record', () => {
    expect(
      buildHealthDataConsentRecord({
        consentedAt: '2026-11-06T12:00:00.000Z',
        locale: 'uk-UA',
        textHash: 'hash',
      }),
    ).toEqual({
      consentVersion: 'v1.0',
      policyVersion: 'v1.0',
      termsVersion: 'v1.0',
      consentType: 'health_data',
      consentedAt: '2026-11-06T12:00:00.000Z',
      method: 'settings',
      locale: 'uk-UA',
      textHash: 'hash',
    })
  })

  it('encodes support email content safely', () => {
    expect(buildSupportMailtoUrl({ subject: 'Help & support', body: 'User: 1+2' })).toBe(
      'mailto:support@beautyai.site?subject=Help%20%26%20support&body=User%3A%201%2B2',
    )
  })

  it('normalizes profile names before saving', () => {
    expect(normalizeProfileName('  Alex Primak  ')).toBe('Alex Primak')
    expect(normalizeProfileName('   ')).toBeNull()
  })
})
