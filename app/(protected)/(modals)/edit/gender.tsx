import { GenderQuestion } from '@/features/profileQuestions/components/GenderQuestion'
import { useProfileQuestionEditor } from '@/features/profileQuestions/hooks/useProfileQuestionEditor'

export default function EditGenderModal() {
  const { confirm, initial, isUpdating } = useProfileQuestionEditor('gender')

  return (
    <GenderQuestion disabled={isUpdating} initial={initial} onConfirm={confirm} variant="edit" />
  )
}
