import { use } from 'react'
import { OnboardingContext } from '@/context/onboardingContext'

function useOnboarding() {
  const context = use(OnboardingContext)
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider')
  return context
}

export { useOnboarding }
