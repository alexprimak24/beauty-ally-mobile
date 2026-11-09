import { ClimateQuestion } from '@/features/profileQuestions/components/ClimateQuestion'
import { useProfileQuestionEditor } from '@/features/profileQuestions/hooks/useProfileQuestionEditor'

function EditClimateModal() {
  const { confirm, initial, isUpdating } = useProfileQuestionEditor('climate')

  return (
    <ClimateQuestion disabled={isUpdating} initial={initial} onConfirm={confirm} variant="edit" />
  )
}

export default EditClimateModal
