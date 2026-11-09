import type { UserData } from '@/types/userEntry'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo, useState } from 'react'

interface OnboardingContextValue {
  onboardingData: UserData
  setOnboardingData: (value: Partial<UserData>) => void
  clearOnboardingData: () => void
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined)

function OnboardingProvider({ children }: PropsWithChildren) {
  const [onboardingData, setOnboardingDataState] = useState<UserData>({})
  const setOnboardingData = useCallback((values: Partial<UserData>) => {
    setOnboardingDataState((prev) => ({ ...prev, ...values }))
  }, [])

  const clearOnboardingData = useCallback(() => {
    setOnboardingDataState({})
  }, [])

  const value = useMemo(
    () => ({ onboardingData, setOnboardingData, clearOnboardingData }),
    [onboardingData, setOnboardingData, clearOnboardingData],
  )

  return <OnboardingContext value={value}>{children}</OnboardingContext>
}

export { OnboardingContext, OnboardingProvider }
