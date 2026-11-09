import { useOnboardingStep } from '@/features/onboarding/hooks/useOnboardingStep'
import { ActiveTreatmentsQuestion } from '@/features/profileQuestions/components/ActiveTreatmentsQuestion'

export default function ActiveTreatmentsScreen() {
  const { complete, initial } = useOnboardingStep({
    field: 'activeTreatment',
    nextRoute: '/(auth)/onboarding/sunscreen',
    step: 6,
    stepName: 'active_treatment',
  })

  return <ActiveTreatmentsQuestion initial={initial} onConfirm={complete} />
}
