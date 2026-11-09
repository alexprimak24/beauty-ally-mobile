import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import PressEffectWrapper from '@/components/ui/PressEffectWrapper'
import { useRTokens } from '@/design/useRTokens'

interface ProfileSettingsRowProps {
  destructive?: boolean
  icon: ReactNode
  label: string
  onPress: () => void
}

export function ProfileSettingsRow({
  destructive = false,
  icon,
  label,
  onPress,
}: ProfileSettingsRowProps) {
  const { type } = useRTokens()

  return (
    <PressEffectWrapper
      fillAll={false}
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
      accessibilityLabel={label}
    >
      <View className="flex-row items-center gap-3">
        {icon}
        <Text
          className={
            destructive ? 'font-quicksandBold text-[#E63946]' : 'font-quicksandBold text-dark'
          }
          style={{ fontSize: type.base }}
        >
          {label}
        </Text>
      </View>
    </PressEffectWrapper>
  )
}
