/// <reference types="jest" />

import { buildOnboardingConsentRecords, getMatchingStepCount } from '../model'

describe('onboarding model', () => {
  it('bounds matching progress and maps it to five completed steps', () => {
    expect(getMatchingStepCount(-10)).toBe(0)
    expect(getMatchingStepCount(19.9)).toBe(0)
    expect(getMatchingStepCount(20)).toBe(1)
    expect(getMatchingStepCount(99)).toBe(4)
    expect(getMatchingStepCount(120)).toBe(5)
  })

  it('builds the versioned consent records captured during onboarding', () => {
    expect(
      buildOnboardingConsentRecords({
        consentedAt: '2026-11-06T18:00:00.000Z',
        healthHash: 'health-hash',
        locale: 'uk-UA',
        termsHash: 'terms-hash',
      }),
    ).toEqual([
      {
        consentVersion: 'v1.0',
        policyVersion: 'v1.0',
        termsVersion: 'v1.0',
        consentType: 'terms_privacy',
        consentedAt: '2026-11-06T18:00:00.000Z',
        locale: 'uk-UA',
        method: 'onboarding',
        textHash: 'terms-hash',
      },
      {
        consentVersion: 'v1.0',
        policyVersion: 'v1.0',
        termsVersion: 'v1.0',
        consentType: 'health_data',
        consentedAt: '2026-11-06T18:00:00.000Z',
        locale: 'uk-UA',
        method: 'onboarding',
        textHash: 'health-hash',
      },
    ])
  })
})
