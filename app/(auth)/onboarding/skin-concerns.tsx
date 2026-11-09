import { useOnboardingStep } from '@/features/onboarding/hooks/useOnboardingStep'
import { SkinConcernsQuestion } from '@/features/profileQuestions/components/SkinConcernsQuestion'

export default function SkinConcernsScreen() {
  const { complete, initial } = useOnboardingStep({
    field: 'skinConcerns',
    nextRoute: '/(auth)/onboarding/active-treatments',
    step: 5,
    stepName: 'skin_concerns',
  })

  return <SkinConcernsQuestion initial={initial} onConfirm={complete} />
}
