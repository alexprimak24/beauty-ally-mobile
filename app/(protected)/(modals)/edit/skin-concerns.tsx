import { SkinConcernsQuestion } from '@/features/profileQuestions/components/SkinConcernsQuestion'
import { useProfileQuestionEditor } from '@/features/profileQuestions/hooks/useProfileQuestionEditor'

export default function EditSkinConcernsModal() {
  const { confirm, initial, isUpdating } = useProfileQuestionEditor('skinConcerns')

  return (
    <SkinConcernsQuestion
      disabled={isUpdating}
      initial={initial}
      onConfirm={confirm}
      variant="edit"
    />
  )
}
