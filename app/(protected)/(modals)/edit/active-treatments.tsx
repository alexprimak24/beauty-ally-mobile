import { ActiveTreatmentsQuestion } from '@/features/profileQuestions/components/ActiveTreatmentsQuestion'
import { useProfileQuestionEditor } from '@/features/profileQuestions/hooks/useProfileQuestionEditor'

export default function EditActiveTreatmentsModal() {
  const { confirm, initial, isUpdating } = useProfileQuestionEditor('activeTreatment')

  return (
    <ActiveTreatmentsQuestion
      disabled={isUpdating}
      initial={initial}
      onConfirm={confirm}
      variant="edit"
    />
  )
}
