import { useCallback } from 'react'
import { useRouter, type Href } from 'expo-router'

import { useAnalytics } from '@/hooks/useAnalytics'
import { useOnboarding } from '@/hooks/useOnboarding'
import type { UserData } from '@/types/userEntry'
import { analyticsEvents, type OnboardingStepName } from '@/utils/analytics'

interface OnboardingStepConfig<Field extends keyof UserData> {
  completesOnboarding?: boolean
  field: Field
  nextRoute: Href
  startsOnboarding?: boolean
  step: number
  stepName: OnboardingStepName
}

export function useOnboardingStep<Field extends keyof UserData>({
  completesOnboarding = false,
  field,
  nextRoute,
  startsOnboarding = false,
  step,
  stepName,
}: OnboardingStepConfig<Field>) {
  const analytics = useAnalytics()
  const router = useRouter()
  const { onboardingData, setOnboardingData } = useOnboarding()
  const initial = onboardingData[field]

  const complete = useCallback(
    (value: string) => {
      const isFirstCompletion = !onboardingData[field]

      if (isFirstCompletion && startsOnboarding) {
        analytics.capture(analyticsEvents.onboardingStarted)
      }

      setOnboardingData({ [field]: value } as Partial<UserData>)

      if (isFirstCompletion) {
        analytics.capture(analyticsEvents.onboardingStepCompleted, {
          step,
          step_name: stepName,
        })
        if (completesOnboarding) {
          analytics.capture(analyticsEvents.onboardingCompleted)
        }
      }

      router.push(nextRoute)
    },
    [
      analytics,
      completesOnboarding,
      field,
      nextRoute,
      onboardingData,
      router,
      setOnboardingData,
      startsOnboarding,
      step,
      stepName,
    ],
  )

  return { complete, initial }
}
