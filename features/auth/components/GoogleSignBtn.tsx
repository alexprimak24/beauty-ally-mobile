import type { btnVariant } from '@/constants/btnVariants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { googleVariantStyles } from '@/constants/btnVariants'
import { icons } from '@/constants/icons'
import { components } from '@/utils/i18n/keyConstants'

interface GoogleSignBtnProps {
  onPress: () => void
  variant?: btnVariant
  disabled?: boolean
}

function GoogleSignBtn({ onPress, variant = 'primary', disabled = false }: GoogleSignBtnProps) {
  const { t } = useTranslation(components)

  const { container, img, text, size } = googleVariantStyles[variant] ?? googleVariantStyles.primary

  const label = t('auth.googleCta')
  const hint = t('auth.googleCtaHint', { defaultValue: '' }) || undefined

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-full flex-row items-center rounded-[40px] border-2 border-dark ${container}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
    >
      <View className={img} style={{ width: size, height: size }}>
        <Image source={icons.GoogleLogo} style={{ width: size, height: size }} />
      </View>

      <Text className={`font-quicksandSemiBold text-dark ${text}`}>{label}</Text>
    </TouchableOpacity>
  )
}

export default GoogleSignBtn
