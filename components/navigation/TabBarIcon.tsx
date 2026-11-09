import { useEffect } from 'react'
import type { ImageSourcePropType } from 'react-native'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useRTokens } from '@/design/useRTokens'

interface TabBarIconProps {
  focused: boolean
  icon: ImageSourcePropType
  activeIcon: ImageSourcePropType
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 64,
    flex: 1,
  },
  icon: { marginBottom: 4, opacity: 0.4, color: '#212529' },
  focusedLabel: { opacity: 1 },
})

export function TabBarIcon({ focused, icon, activeIcon }: TabBarIconProps) {
  const { sizes } = useRTokens()
  const scale = useSharedValue(focused ? 1.1 : 1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1)
  }, [focused, scale])

  return (
    <View style={styles.container}>
      <Animated.Image
        source={focused ? activeIcon : icon}
        style={[
          styles.icon,
          animatedStyle,
          focused && styles.focusedLabel,
          { tintColor: '#212529', width: sizes.smallNavImg, height: sizes.smallNavImg },
        ]}
      />
    </View>
  )
}
