import { scale } from '@/design/responsiveNew'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Image as ExpoImage } from 'expo-image'
import { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { routineEntryColors } from '../routineEntryTheme'
import type { ShelfEntryItem } from '../types'
import { RoutineEntrySparkle } from './RoutineEntrySparkle'

interface RoutineEntryCardContentProps {
  entry: ShelfEntryItem
  onFavoriteToggle?: (entry: ShelfEntryItem) => void
  onLongPressOptions?: (entry: ShelfEntryItem) => void
  onPressPurchase?: (entry: ShelfEntryItem) => void
}

function RoutineEntryImage({ entry }: { entry: ShelfEntryItem }) {
  const glowProgress = useSharedValue(0)

  useEffect(() => {
    glowProgress.value = entry.appliedToday
      ? withRepeat(
          withSequence(
            withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 900, easing: Easing.in(Easing.quad) }),
            withDelay(400, withTiming(0, { duration: 0 })),
          ),
          -1,
          false,
        )
      : withTiming(0, { duration: 160 })
  }, [entry.appliedToday, glowProgress])

  const imageGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowProgress.value, [0, 1], [0, 0.05], Extrapolation.CLAMP),
  }))

  return (
    <View
      style={{
        width: scale(90),
        height: scale(90),
        borderRadius: scale(18),
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ExpoImage
        cachePolicy="memory-disk"
        contentFit="cover"
        source={{ uri: entry.frontImage }}
        style={{ width: '100%', height: '100%' }}
        transition={120}
      />

      {entry.appliedToday ? (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              { ...StyleSheet.absoluteFill, backgroundColor: routineEntryColors.card },
              imageGlowStyle,
            ]}
          />
          <RoutineEntrySparkle top={scale(8)} right={scale(8)} size={scale(12)} />
          <RoutineEntrySparkle bottom={scale(12)} left={scale(10)} size={scale(8)} delay={600} />
          <RoutineEntrySparkle top={scale(35)} left={scale(4)} size={scale(8)} delay={1200} />
        </>
      ) : null}
    </View>
  )
}

export function RoutineEntryCardContent({
  entry,
  onFavoriteToggle,
  onLongPressOptions,
  onPressPurchase,
}: RoutineEntryCardContentProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      delayLongPress={220}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        onLongPressOptions?.(entry)
      }}
      style={{
        paddingVertical: scale(16),
        paddingHorizontal: scale(14),
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <RoutineEntryImage entry={entry} />

      <View style={{ flex: 1, marginLeft: scale(16), justifyContent: 'center' }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: scale(13),
            color: routineEntryColors.secondaryText,
            fontFamily: 'Quicksand-Medium',
            marginBottom: scale(4),
          }}
        >
          {entry.frequencyDisplay}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: scale(16),
            color: routineEntryColors.darkText,
            fontFamily: 'Quicksand-SemiBold',
            lineHeight: scale(22),
          }}
        >
          {entry.productName}
        </Text>
      </View>

      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginLeft: scale(8),
          paddingVertical: scale(4),
          alignSelf: 'stretch',
          width: scale(30),
        }}
      >
        <TouchableOpacity
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => onFavoriteToggle?.(entry)}
        >
          <Ionicons
            name={entry.isFavorites ? 'heart' : 'heart-outline'}
            size={scale(20)}
            color={
              entry.isFavorites ? routineEntryColors.strongRed : routineEntryColors.inactiveIcon
            }
            style={{ marginBottom: scale(16) }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => onPressPurchase?.(entry)}
          style={{ position: 'relative' }}
        >
          <Ionicons
            name="bag-handle-outline"
            size={scale(20)}
            color={routineEntryColors.secondaryText}
          />
          {entry.isRunningLow ? (
            <View
              style={{
                position: 'absolute',
                top: scale(-3),
                right: scale(-2),
                width: scale(9),
                height: scale(9),
                borderRadius: scale(4.5),
                backgroundColor: routineEntryColors.strongRed,
                borderWidth: scale(1.5),
                borderColor: routineEntryColors.card,
                zIndex: 1,
              }}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}
