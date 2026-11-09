import { AllergiesQuestion } from '@/features/profileQuestions/components/AllergiesQuestion'
import { useProfileQuestionEditor } from '@/features/profileQuestions/hooks/useProfileQuestionEditor'

export default function EditAllergiesModal() {
  const { confirm, initial, isUpdating } = useProfileQuestionEditor('allergies')

  return (
    <AllergiesQuestion disabled={isUpdating} initial={initial} onConfirm={confirm} variant="edit" />
  )
}
