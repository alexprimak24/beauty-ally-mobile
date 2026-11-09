import { useOnboardingStep } from '@/features/onboarding/hooks/useOnboardingStep'
import { SkinTypeQuestion } from '@/features/profileQuestions/components/SkinTypeQuestion'

function SkinTypeScreen() {
  const { complete, initial } = useOnboardingStep({
    field: 'skinType',
    nextRoute: '/(auth)/onboarding/allergies',
    step: 3,
    stepName: 'skin_type',
  })

  return <SkinTypeQuestion initial={initial} onConfirm={complete} />
}

export default SkinTypeScreen
