import { skinTypeOptions } from '@/constants/onboarding/onboardingData'
import { ChoiceQuestion, type ProfileQuestionVariant } from './ChoiceQuestion'

interface SkinTypeQuestionProps {
  disabled?: boolean
  initial?: string
  onConfirm: (value: string) => void | Promise<void>
  variant?: ProfileQuestionVariant
}

export function SkinTypeQuestion(props: SkinTypeQuestionProps) {
  return (
    <ChoiceQuestion
      {...props}
      options={skinTypeOptions}
      subtitleKey="skinType.subtitle"
      titleKey="skinType.title"
    />
  )
}
