import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Image as ExpoImage } from 'expo-image'
import { memo, useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import type { RenderItemParams } from 'react-native-draggable-flatlist'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { scale } from '@/design/responsiveNew'
import { skincareShelfColors } from '../constants'
import type { ReorderRoutineEntry } from '../types'

export const ReorderRoutineRow = memo(function ReorderRoutineRow({
  item,
  drag,
  isActive,
}: RenderItemParams<ReorderRoutineEntry>) {
  const scaleValue = useSharedValue(1)
  const shadowOpacity = useSharedValue(0.02)
  const elevation = useSharedValue(1)

  useEffect(() => {
    scaleValue.value = withTiming(isActive ? 1.04 : 1, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    })
    shadowOpacity.value = withTiming(isActive ? 0.12 : 0.02, { duration: 150 })
    elevation.value = withTiming(isActive ? 10 : 1, { duration: 150 })
  }, [elevation, isActive, scaleValue, shadowOpacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    shadowOpacity: shadowOpacity.value,
    elevation: elevation.value,
    zIndex: isActive ? 100 : 1,
  }))

  const startDrag = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    drag()
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        delayLongPress={50}
        onLongPress={drag}
        style={styles.row}
      >
        <View style={styles.imageContainer}>
          <ExpoImage
            source={{ uri: item.frontImage }}
            style={styles.image}
            contentFit="cover"
            transition={100}
            cachePolicy="memory-disk"
          />
        </View>

        <View style={styles.nameContainer}>
          <Text numberOfLines={2} style={styles.name}>
            {item.productName}
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          onPressIn={startDrag}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{ padding: scale(4) }}
        >
          <Ionicons
            name="reorder-three"
            size={scale(28)}
            color={skincareShelfColors.inactiveText}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  )
})

const styles = {
  container: {
    marginHorizontal: scale(16),
    marginBottom: scale(10),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(22),
    borderWidth: scale(1.5),
    borderColor: '#F4F6F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(6) },
    shadowRadius: scale(12),
  },
  row: { padding: scale(12), flexDirection: 'row', alignItems: 'center' },
  imageContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  nameContainer: { flex: 1, marginLeft: scale(14) },
  name: {
    fontSize: scale(16),
    color: skincareShelfColors.dark,
    fontFamily: 'Quicksand-SemiBold',
    lineHeight: scale(22),
  },
} as const
