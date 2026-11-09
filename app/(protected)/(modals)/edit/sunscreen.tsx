import { SunscreenQuestion } from '@/features/profileQuestions/components/SunscreenQuestion'
import { useProfileQuestionEditor } from '@/features/profileQuestions/hooks/useProfileQuestionEditor'

export default function EditSunscreenUsageModal() {
  const { confirm, initial, isUpdating } = useProfileQuestionEditor('sunscreenUsage')

  return (
    <SunscreenQuestion disabled={isUpdating} initial={initial} onConfirm={confirm} variant="edit" />
  )
}
