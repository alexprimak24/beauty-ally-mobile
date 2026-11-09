import type { ConsentRecord } from '@/context/consentContext'
import type { UserData } from '@/types/userEntry'

export type PostAuthAction =
  | 'create-profile'
  | 'invalid-onboarding'
  | 'missing-consent'
  | 'open-existing-profile'
  | 'update-existing-profile'

interface ResolvePostAuthActionOptions {
  hasLocalConsent: boolean
  hasOnboardingData: boolean
  userExists: boolean
}

export function hasRequiredOnboardingConsents(consents: ConsentRecord[]): boolean {
  const consentTypes = new Set(consents.map(({ consentType }) => consentType))
  return consentTypes.has('terms_privacy') && consentTypes.has('health_data')
}

export function hasOnboardingProfileData(profile: UserData): boolean {
  return Object.values(profile).some(
    (value) => value !== undefined && value !== null && value.trim().length > 0,
  )
}

export function resolvePostAuthAction({
  hasLocalConsent,
  hasOnboardingData,
  userExists,
}: ResolvePostAuthActionOptions): PostAuthAction {
  if (userExists) {
    return hasOnboardingData ? 'update-existing-profile' : 'open-existing-profile'
  }

  if (!hasLocalConsent) return 'missing-consent'
  return hasOnboardingData ? 'create-profile' : 'invalid-onboarding'
}
