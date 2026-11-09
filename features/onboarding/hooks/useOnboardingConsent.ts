import { useCallback, useState } from 'react'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useAnalytics } from '@/hooks/useAnalytics'
import { useConsent } from '@/hooks/useConsent'
import { analyticsEvents } from '@/utils/analytics'
import { hashText } from '@/utils/hashTest'
import { onboarding } from '@/utils/i18n/keyConstants'
import { getLocaleSafe } from '@/utils/locale'
import { ERROR_KEYS_OBJ, showErrorToast } from '@/utils/showErrorToast'
import { buildOnboardingConsentRecords } from '../model'

export function useOnboardingConsent() {
  const analytics = useAnalytics()
  const router = useRouter()
  const { setConsent } = useConsent()
  const { t } = useTranslation(onboarding)
  const [hasAcceptedHealthData, setHasAcceptedHealthData] = useState(false)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [isLearnMoreVisible, setIsLearnMoreVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canContinue = hasAcceptedTerms && hasAcceptedHealthData

  const toggleHealthData = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setHasAcceptedHealthData((current) => !current)
  }, [])

  const toggleTerms = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setHasAcceptedTerms((current) => !current)
  }, [])

  const acceptConsent = useCallback(async () => {
    if (!canContinue || isSubmitting) return

    setIsSubmitting(true)
    try {
      const consentedAt = new Date().toISOString()
      const [termsHash, healthHash] = await Promise.all([
        hashText(t('congratulations.termsRaw')),
        hashText(t('congratulations.healthRaw')),
      ])

      setConsent(
        buildOnboardingConsentRecords({
          consentedAt,
          healthHash,
          locale: getLocaleSafe(),
          termsHash,
        }),
      )
      analytics.capture(analyticsEvents.consentAccepted, {
        consent_types: ['terms_privacy', 'health_data'],
      })
      router.push('/(auth)/onboarding/create-account')
    } catch (error) {
      console.error('Failed to capture onboarding consent:', error)
      showErrorToast(ERROR_KEYS_OBJ.generic)
    } finally {
      setIsSubmitting(false)
    }
  }, [analytics, canContinue, isSubmitting, router, setConsent, t])

  return {
    acceptConsent,
    canContinue,
    closeLearnMore: () => setIsLearnMoreVisible(false),
    hasAcceptedHealthData,
    hasAcceptedTerms,
    isLearnMoreVisible,
    isSubmitting,
    openLearnMore: () => setIsLearnMoreVisible(true),
    toggleHealthData,
    toggleTerms,
  }
}
