import { Pressable, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'

import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'

interface SkinProfileRowProps {
  label: string
  onPress: () => void
  value: string
}

export function SkinProfileRow({ label, onPress, value }: SkinProfileRowProps) {
  const { sizes, type } = useRTokens()

  const handlePress = async () => {
    try {
      await Haptics.selectionAsync()
    } catch (error) {
      if (__DEV__) console.warn('Profile row haptic failed:', error)
    } finally {
      onPress()
    }
  }

  return (
    <View style={{ marginBottom: scale(20) }}>
      <Text
        className="font-quicksandBold text-dark"
        style={{ fontSize: type.base, marginBottom: scale(12) }}
      >
        {label}
      </Text>

      <Pressable
        onPress={() => void handlePress()}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        className="items-center justify-center bg-gray-100 px-5 py-3"
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        style={{ height: sizes.skinEntryH, borderRadius: scale(16) }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-center text-dark"
          style={{ fontSize: type.base }}
        >
          {value}
        </Text>
      </Pressable>
    </View>
  )
}
