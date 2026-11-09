import { SkinTypeQuestion } from '@/features/profileQuestions/components/SkinTypeQuestion'
import { useProfileQuestionEditor } from '@/features/profileQuestions/hooks/useProfileQuestionEditor'

export default function EditSkinTypeModal() {
  const { confirm, initial, isUpdating } = useProfileQuestionEditor('skinType')

  return (
    <SkinTypeQuestion disabled={isUpdating} initial={initial} onConfirm={confirm} variant="edit" />
  )
}
