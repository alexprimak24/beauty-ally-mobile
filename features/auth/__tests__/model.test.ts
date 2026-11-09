/// <reference types="jest" />

import type { ConsentRecord } from '@/context/consentContext'
import {
  hasOnboardingProfileData,
  hasRequiredOnboardingConsents,
  resolvePostAuthAction,
} from '../model'

const consent = (consentType: ConsentRecord['consentType']): ConsentRecord => ({
  consentType,
  consentVersion: 'v1',
  policyVersion: 'v1',
  termsVersion: 'v1',
  consentedAt: '2026-11-07T00:00:00.000Z',
  method: 'onboarding',
})

describe('auth model', () => {
  it('requires both onboarding consent types', () => {
    expect(hasRequiredOnboardingConsents([])).toBe(false)
    expect(hasRequiredOnboardingConsents([consent('health_data')])).toBe(false)
    expect(
      hasRequiredOnboardingConsents([
        consent('health_data'),
        consent('health_data'),
        consent('terms_privacy'),
      ]),
    ).toBe(true)
  })

  it('recognizes only meaningful onboarding values', () => {
    expect(hasOnboardingProfileData({})).toBe(false)
    expect(hasOnboardingProfileData({ name: '', language: '  ' })).toBe(false)
    expect(hasOnboardingProfileData({ language: 'Ukrainian' })).toBe(true)
  })

  it.each([
    [true, true, true, 'update-existing-profile'],
    [true, false, true, 'open-existing-profile'],
    [false, true, true, 'update-existing-profile'],
    [false, false, true, 'open-existing-profile'],
    [false, true, false, 'missing-consent'],
    [true, true, false, 'create-profile'],
    [true, false, false, 'invalid-onboarding'],
  ] as const)(
    'resolves consent=%s onboarding=%s existing=%s to %s',
    (hasLocalConsent, hasOnboardingData, userExists, expected) => {
      expect(resolvePostAuthAction({ hasLocalConsent, hasOnboardingData, userExists })).toBe(
        expected,
      )
    },
  )
})
