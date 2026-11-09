import { genderOptions } from '@/constants/onboarding/onboardingData'
import { ChoiceQuestion, type ProfileQuestionVariant } from './ChoiceQuestion'

interface GenderQuestionProps {
  disabled?: boolean
  initial?: string
  onConfirm: (value: string) => void | Promise<void>
  variant?: ProfileQuestionVariant
}

export function GenderQuestion(props: GenderQuestionProps) {
  return (
    <ChoiceQuestion
      {...props}
      options={genderOptions}
      subtitleKey="gender.subtitle"
      titleKey="gender.title"
    />
  )
}
