import type { btnVariant } from '@/constants/btnVariants'
import { appleVariantStyles } from '@/constants/btnVariants'
import { icons } from '@/constants/icons'
import { components } from '@/utils/i18n/keyConstants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, TouchableOpacity } from 'react-native'

interface AppleSignBtnProps {
  onPress: () => void
  variant?: btnVariant
  disabled?: boolean
}

function AppleSignBtn({ onPress, variant = 'primary', disabled = false }: AppleSignBtnProps) {
  const { t } = useTranslation(components)

  const { container, img, text, size } = appleVariantStyles[variant] ?? appleVariantStyles.primary

  const label = t('auth.appleCta')
  const hint = t('auth.appleCtaHint', { defaultValue: '' }) || undefined

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-full flex-row items-center rounded-[40px] bg-dark ${container}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
    >
      <Image source={icons.AppleLogo} className={img} style={{ width: size, height: size }} />
      <Text className={`font-quicksandSemiBold text-white ${text}`}>{label}</Text>
    </TouchableOpacity>
  )
}

export default AppleSignBtn
