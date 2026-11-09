import type { ReactNode } from 'react'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import OnboardingHeader from './OnboardingHeader'

interface ContainerProps {
  children: ReactNode
  showHeader?: boolean
  langPickerVisible?: boolean
}

function Container({ children, showHeader = true, langPickerVisible }: ContainerProps) {
  return (
    <SafeAreaView className="w-full flex-1 px-6 pb-[10px] pt-2">
      {showHeader && <OnboardingHeader langPickerVisible={langPickerVisible} />}
      {children}
    </SafeAreaView>
  )
}

export default Container
