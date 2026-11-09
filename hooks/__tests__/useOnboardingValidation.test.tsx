/// <reference types="jest" />

import { renderHook } from '@testing-library/react-native'
import type { UserData } from '@/types/userEntry'
import { useOnboardingValidation } from '../useOnboardingValidation'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: string | { fields?: string }) => {
      if (key.startsWith('fields.')) return typeof options === 'string' ? options : key
      if (key === 'onboardingValidation.noData') return 'No onboarding data'
      if (key === 'onboardingValidation.incomplete')
        return `Missing: ${typeof options === 'object' ? options.fields : ''}`
      return key
    },
  }),
}))

const completeProfile: UserData = {
  gender: 'female',
  climate: 'cool and dry',
  skinType: 'sensitive',
  allergies: 'no allergies',
  skinConcerns: 'redness or sensitivity',
  activeTreatment: 'no',
  sunscreenUsage: 'daily',
}

describe('useOnboardingValidation', () => {
  it('accepts a complete onboarding profile', async () => {
    const { result } = await renderHook(() => useOnboardingValidation())

    expect(result.current.validate(completeProfile)).toEqual({
      isValid: true,
      missing: [],
    })
  })

  it('reports missing and whitespace-only answers with readable labels', async () => {
    const { result } = await renderHook(() => useOnboardingValidation())
    const profile = {
      ...completeProfile,
      allergies: '   ',
      skinType: undefined,
    }

    expect(result.current.validate(profile)).toEqual({
      isValid: false,
      missing: ['skinType', 'allergies'],
      message: 'Missing: Skin Type, Allergies',
    })
  })

  it('returns every required field when no onboarding data exists', async () => {
    const { result } = await renderHook(() => useOnboardingValidation())
    const validation = result.current.validate()

    expect(validation.isValid).toBe(false)
    expect(validation.missing).toEqual(result.current.requiredFields)
    expect(validation.message).toBe('No onboarding data')
  })

  it('supports a focused validation subset', async () => {
    const requiredFields: (keyof UserData)[] = ['name', 'skinType']
    const { result } = await renderHook(() => useOnboardingValidation({ requiredFields }))

    expect(result.current.validate({ skinType: 'dry' })).toEqual({
      isValid: false,
      missing: ['name'],
      message: 'Missing: Name',
    })
  })
})
