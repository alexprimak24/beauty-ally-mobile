import { scale } from '@/design/responsiveNew'
import { components, main } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { LayoutChangeEvent } from 'react-native'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Toast from 'react-native-toast-message'

const toastTop = 70

function FavoriteButton({
  disabled,
  isFavorite,
  onPress,
}: {
  disabled: boolean
  isFavorite: boolean
  onPress: () => void
}) {
  const { t } = useTranslation(components)
  const scaleAnimation = useSharedValue(1)
  const favoriteProgress = useSharedValue(isFavorite ? 1 : 0)

  useEffect(() => {
    favoriteProgress.value = withTiming(isFavorite ? 1 : 0, { duration: 300 })
  }, [favoriteProgress, isFavorite])

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    favoriteProgress.value = withTiming(isFavorite ? 0 : 1, { duration: 300 })
    scaleAnimation.value = withSequence(
      withTiming(0.8, { duration: 300 }),
      withTiming(1, { duration: 200 }),
    )
    onPress()

    Toast.show({
      type: isFavorite ? 'info' : 'success',
      position: 'top',
      text1: t(isFavorite ? 'scanEntry.toast.favRemoved' : 'scanEntry.toast.favAdded'),
      topOffset: toastTop,
    })
  }

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(favoriteProgress.value, [0, 1], ['#F3F4F6', '#FFF0F0']),
    borderColor: interpolateColor(favoriteProgress.value, [0, 1], ['#F3F4F6', '#FECACA']),
    transform: [{ scale: scaleAnimation.value }],
  }))
  const outlineIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(favoriteProgress.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(favoriteProgress.value, [0, 1], [1, 0.5]) }],
    position: 'absolute',
  }))
  const solidIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(favoriteProgress.value, [0, 1], [0, 1]),
    transform: [{ scale: interpolate(favoriteProgress.value, [0, 1], [0.5, 1]) }],
    position: 'absolute',
  }))

  const buttonSize = scale(64)
  const iconSize = scale(32)

  return (
    <Pressable disabled={disabled} onPress={handlePress}>
      <Animated.View
        className="items-center justify-center border"
        style={[
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            borderWidth: StyleSheet.hairlineWidth,
          },
          containerStyle,
        ]}
      >
        <Animated.View style={outlineIconStyle}>
          <Ionicons name="heart-outline" size={iconSize} color="#9CA3AF" />
        </Animated.View>
        <Animated.View style={solidIconStyle}>
          <Ionicons name="heart" size={iconSize} color="#EF4444" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}

function SkincareButton({
  disabled,
  inSkincare,
  onPress,
}: {
  disabled: boolean
  inSkincare: boolean
  onPress: () => void
}) {
  const { t } = useTranslation(main)
  const scaleAnimation = useSharedValue(1)
  const skincareProgress = useSharedValue(inSkincare ? 1 : 0)
  const expandedIconWidth = scale(28)

  useEffect(() => {
    skincareProgress.value = withTiming(inSkincare ? 1 : 0, { duration: 300 })
  }, [inSkincare, skincareProgress])

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    scaleAnimation.value = withSequence(
      withTiming(0.96, { duration: 300 }),
      withTiming(1, { duration: 200 }),
    )
    onPress()
  }

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(skincareProgress.value, [0, 1], ['#212529', '#def2ff']),
    shadowOpacity: interpolate(skincareProgress.value, [0, 1], [0.15, 0]),
    shadowRadius: interpolate(skincareProgress.value, [0, 1], [10, 0]),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: interpolate(skincareProgress.value, [0, 1], [4, 0]) },
    elevation: interpolate(skincareProgress.value, [0, 1], [4, 0]),
    borderColor: interpolateColor(skincareProgress.value, [0, 1], ['transparent', '#bde4ff']),
    borderWidth: 1,
    transform: [{ scale: scaleAnimation.value }],
  }))
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(skincareProgress.value, [0, 1], ['#def2ff', '#212529']),
  }))
  const iconContainerStyle = useAnimatedStyle(() => ({
    width: interpolate(skincareProgress.value, [0, 1], [0, expandedIconWidth], Extrapolation.CLAMP),
    opacity: interpolate(skincareProgress.value, [0, 0.5, 1], [0, 0, 1], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(skincareProgress.value, [0, 1], [0.2, 1], Extrapolation.CLAMP) },
    ],
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }))

  const buttonHeight = scale(64)

  return (
    <Pressable disabled={disabled} onPress={handlePress} style={{ flex: 1, marginLeft: scale(12) }}>
      <Animated.View
        style={[
          {
            height: buttonHeight,
            borderRadius: buttonHeight / 2,
            alignItems: 'center',
            justifyContent: 'center',
          },
          containerStyle,
        ]}
      >
        <View className="flex-row items-center">
          <Animated.View style={iconContainerStyle}>
            <Ionicons
              name="checkmark"
              size={scale(20)}
              color="#212529"
              style={{ marginRight: scale(8) }}
            />
          </Animated.View>
          <Animated.Text
            className="font-quicksandBold"
            style={[{ fontSize: scale(18) }, textStyle]}
          >
            {t(
              inSkincare ? 'result.staticText.addedToSkincare' : 'result.staticText.addToSkincare',
            )}
          </Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}

interface ResultActionBarProps {
  bottomInset: number
  favoriteDisabled: boolean
  inSkincare: boolean
  isFavorite: boolean
  onFavoritePress: () => void
  onLayout: (event: LayoutChangeEvent) => void
  onSkincarePress: () => void
  shouldAnimate: boolean
  skincareDisabled: boolean
}

export function ResultActionBar({
  bottomInset,
  favoriteDisabled,
  inSkincare,
  isFavorite,
  onFavoritePress,
  onLayout,
  onSkincarePress,
  shouldAnimate,
  skincareDisabled,
}: ResultActionBarProps) {
  return (
    <Animated.View
      onLayout={onLayout}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-50 bg-white"
      style={{
        paddingBottom: bottomInset + scale(10),
        paddingTop: scale(16),
        paddingHorizontal: scale(24),
        zIndex: 100,
      }}
      entering={
        shouldAnimate
          ? FadeInDown.delay(700)
              .duration(600)
              .easing(Easing.bezier(0.25, 1, 0.5, 1))
              .withInitialValues({ transform: [{ translateY: 40 }], opacity: 0 })
          : undefined
      }
    >
      <View className="flex-row items-center justify-between">
        <FavoriteButton
          disabled={favoriteDisabled}
          isFavorite={isFavorite}
          onPress={onFavoritePress}
        />
        <SkincareButton
          disabled={skincareDisabled}
          inSkincare={inSkincare}
          onPress={onSkincarePress}
        />
      </View>
    </Animated.View>
  )
}
