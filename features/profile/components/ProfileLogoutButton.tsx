import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'

import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'

interface ProfileLogoutButtonProps {
  onLogout: () => Promise<void> | void
}

export function ProfileLogoutButton({ onLogout }: ProfileLogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { type } = useRTokens()
  const { t } = useTranslation(components)
  const label = t('profile.logout.cta')
  const hint = t('profile.logout.hint', { defaultValue: '' }) || undefined

  const handlePress = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await onLogout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <TouchableOpacity
      onPress={() => void handlePress()}
      disabled={isLoggingOut}
      activeOpacity={0.8}
      className="mt-4 min-w-40 items-center self-center rounded-full bg-[#ff7da5] px-10 py-3 shadow-md"
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: isLoggingOut, busy: isLoggingOut }}
    >
      {isLoggingOut ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className="font-quicksandBold text-white" style={{ fontSize: type.base }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}
