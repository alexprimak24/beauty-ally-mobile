/// <reference types="jest" />

import type { PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react-native'
import type { ConsentRecord } from '../consentContext'
import { ConsentProvider } from '../consentContext'
import { OnboardingProvider } from '../onboardingContext'
import { useConsent } from '@/hooks/useConsent'
import { useOnboarding } from '@/hooks/useOnboarding'

function ConsentWrapper({ children }: PropsWithChildren) {
  return <ConsentProvider>{children}</ConsentProvider>
}

function OnboardingWrapper({ children }: PropsWithChildren) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}

function createConsent(
  consentType: ConsentRecord['consentType'],
  textHash: string,
  overrides: Partial<ConsentRecord> = {},
): ConsentRecord {
  return {
    consentVersion: '1.0',
    policyVersion: '1.0',
    termsVersion: '1.0',
    consentType,
    consentedAt: '2026-11-05T10:00:00.000Z',
    method: 'onboarding',
    textHash,
    ...overrides,
  }
}

describe('OnboardingProvider', () => {
  it('merges onboarding steps without losing earlier answers', async () => {
    const { result } = await renderHook(() => useOnboarding(), { wrapper: OnboardingWrapper })

    await act(() => result.current.setOnboardingData({ gender: 'female' }))
    await act(() => result.current.setOnboardingData({ skinType: 'sensitive' }))

    expect(result.current.onboardingData).toEqual({
      gender: 'female',
      skinType: 'sensitive',
    })
  })

  it('clears locally collected onboarding data', async () => {
    const { result } = await renderHook(() => useOnboarding(), { wrapper: OnboardingWrapper })

    await act(() => result.current.setOnboardingData({ language: 'Ukrainian' }))
    await act(() => result.current.clearOnboardingData())

    expect(result.current.onboardingData).toEqual({})
  })

  it('fails loudly when consumed outside its provider', async () => {
    await expect(renderHook(() => useOnboarding())).rejects.toThrow(
      'useOnboarding must be used within OnboardingProvider',
    )
  })
})

describe('ConsentProvider', () => {
  it('keeps distinct consents and replaces a matching document revision', async () => {
    const { result } = await renderHook(() => useConsent(), { wrapper: ConsentWrapper })
    const terms = createConsent('terms_privacy', 'terms-v1')
    const health = createConsent('health_data', 'health-v1')

    await act(() => result.current.setConsent([terms, health]))
    await act(() =>
      result.current.setConsent([
        createConsent('health_data', 'health-v1', { method: 'settings' }),
      ]),
    )

    expect(result.current.consentData).toEqual([
      terms,
      expect.objectContaining({
        consentType: 'health_data',
        method: 'settings',
        textHash: 'health-v1',
      }),
    ])
  })

  it('clears consent data after it is persisted', async () => {
    const { result } = await renderHook(() => useConsent(), { wrapper: ConsentWrapper })

    await act(() => result.current.setConsent([createConsent('terms_privacy', 'terms-v1')]))
    await act(() => result.current.clearConsentData())

    expect(result.current.consentData).toEqual([])
  })

  it('fails loudly when consumed outside its provider', async () => {
    await expect(renderHook(() => useConsent())).rejects.toThrow(
      'useConsent must be used within ConsentProvider',
    )
  })
})
