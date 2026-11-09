import { GenderQuestion } from '@/features/profileQuestions/components/GenderQuestion'
import { useOnboardingStep } from '@/features/onboarding/hooks/useOnboardingStep'

export default function GenderScreen() {
  const { complete, initial } = useOnboardingStep({
    field: 'gender',
    nextRoute: '/(auth)/onboarding/climate',
    startsOnboarding: true,
    step: 1,
    stepName: 'gender',
  })

  return <GenderQuestion initial={initial} onConfirm={complete} />
}
