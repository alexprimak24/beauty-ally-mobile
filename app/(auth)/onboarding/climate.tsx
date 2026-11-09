import { useOnboardingStep } from '@/features/onboarding/hooks/useOnboardingStep'
import { ClimateQuestion } from '@/features/profileQuestions/components/ClimateQuestion'

function ClimateScreen() {
  const { complete, initial } = useOnboardingStep({
    field: 'climate',
    nextRoute: '/(auth)/onboarding/skin-type',
    step: 2,
    stepName: 'climate',
  })

  return <ClimateQuestion initial={initial} onConfirm={complete} />
}

export default ClimateScreen
