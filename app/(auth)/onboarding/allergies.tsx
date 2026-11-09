import { useOnboardingStep } from '@/features/onboarding/hooks/useOnboardingStep'
import { AllergiesQuestion } from '@/features/profileQuestions/components/AllergiesQuestion'

export default function AllergiesScreen() {
  const { complete, initial } = useOnboardingStep({
    field: 'allergies',
    nextRoute: '/(auth)/onboarding/skin-concerns',
    step: 4,
    stepName: 'allergies',
  })

  return <AllergiesQuestion initial={initial} onConfirm={complete} />
}
