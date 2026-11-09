import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { useRTokens } from '@/design/useRTokens'

interface ConsentCheckRowProps {
  checked: boolean
  disabled?: boolean
  label: ReactNode
  onPress: () => void
  testID: string
}

export function ConsentCheckRow({
  checked,
  disabled = false,
  label,
  onPress,
  testID,
}: ConsentCheckRowProps) {
  const { type, sizes } = useRTokens()
  const scale = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, { damping: 15, stiffness: 150 })
  }, [checked, scale])

  const dotStyle = useAnimatedStyle(() => ({
    opacity: scale.value,
    transform: [{ scale: scale.value }],
  }))

  return (
    <View className="flex-row items-center justify-center px-4">
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        activeOpacity={0.8}
        className="mr-2 mt-[2px] items-center justify-center rounded-full border-2 border-gray-400"
        disabled={disabled}
        onPress={onPress}
        style={{ width: sizes.checkboxOut, height: sizes.checkboxOut }}
        testID={testID}
      >
        <Animated.View
          className="rounded-full bg-dark"
          style={[{ width: sizes.checkboxIn, height: sizes.checkboxIn }, dotStyle]}
        />
      </TouchableOpacity>
      <Text className="flex-1 text-center font-quicksand" style={{ fontSize: type.xs }}>
        {label}
      </Text>
    </View>
  )
}
