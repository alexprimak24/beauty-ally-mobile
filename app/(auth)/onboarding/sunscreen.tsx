import { useOnboardingStep } from '@/features/onboarding/hooks/useOnboardingStep'
import { SunscreenQuestion } from '@/features/profileQuestions/components/SunscreenQuestion'

export default function SunscreenScreen() {
  const { complete, initial } = useOnboardingStep({
    completesOnboarding: true,
    field: 'sunscreenUsage',
    nextRoute: '/(auth)/onboarding/matching',
    step: 7,
    stepName: 'sunscreen_usage',
  })

  return <SunscreenQuestion initial={initial} onConfirm={complete} />
}
