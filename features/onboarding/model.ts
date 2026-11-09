import type { ConsentRecord } from '@/context/consentContext'
import { CONSENT_VERSION, POLICY_VERSION, TERMS_VERSION } from '@/constants/consents'

export const MATCHING_DURATION_MS = 5_000
const MATCHING_STEP_COUNT = 5

interface BuildOnboardingConsentRecordsOptions {
  consentedAt: string
  healthHash: string
  locale: string
  termsHash: string
}

export function getMatchingStepCount(progress: number): number {
  'worklet'
  const boundedProgress = Math.min(Math.max(progress, 0), 100)
  return Math.floor(boundedProgress / (100 / MATCHING_STEP_COUNT))
}

export function buildOnboardingConsentRecords({
  consentedAt,
  healthHash,
  locale,
  termsHash,
}: BuildOnboardingConsentRecordsOptions): ConsentRecord[] {
  const shared = {
    consentVersion: CONSENT_VERSION,
    policyVersion: POLICY_VERSION,
    termsVersion: TERMS_VERSION,
    consentedAt,
    locale,
    method: 'onboarding' as const,
  }

  return [
    {
      ...shared,
      consentType: 'terms_privacy',
      textHash: termsHash,
    },
    {
      ...shared,
      consentType: 'health_data',
      textHash: healthHash,
    },
  ]
}
