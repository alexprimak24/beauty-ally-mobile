import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { components } from '@/utils/i18n/keyConstants'

interface Props {
  message?: string
}

export default function ErrorCard({ message }: Props) {
  const { t } = useTranslation(components)

  return (
    <View
      className="mt-4 flex-col items-center justify-center space-x-3 rounded-2xl border border-lightPink bg-lightPink/30 px-4 py-3"
      accessibilityRole="alert"
    >
      <MaterialIcons name="error-outline" size={24} color="#FF6B6B" />
      <Text className="mb-1 font-quicksandSemiBold text-base text-dark">
        {t('errorCard.title')}
      </Text>
      <Text className="font-quicksand text-sm text-dark/70">
        {message ?? t('errorCard.generic')}
      </Text>
    </View>
  )
}
