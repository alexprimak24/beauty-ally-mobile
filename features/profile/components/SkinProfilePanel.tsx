import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Keyboard, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import PressEffectWrapper from '@/components/ui/PressEffectWrapper'
import { icons } from '@/constants/icons'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { useUser } from '@/hooks/useGetUser'
import { components, onboarding } from '@/utils/i18n/keyConstants'
import { buildSkinProfileRows } from '../model'
import { SkinProfileRow } from './SkinProfileRow'

export function SkinProfilePanel() {
  const router = useRouter()
  const { data: userData } = useUser()
  const { sizes, type } = useRTokens()
  const { t } = useTranslation(components)
  const { t: onboardingT } = useTranslation(onboarding)
  const [expanded, setExpanded] = useState(false)
  const height = useSharedValue(0)
  const rotate = useSharedValue(0)
  const colorProgress = useSharedValue(0)

  const toggleExpanded = useCallback(() => {
    const next = !expanded
    setExpanded(next)
    height.value = withTiming(next ? 420 : 0, { duration: 400 })
    rotate.value = withTiming(next ? 180 : 0, { duration: 400 })
    colorProgress.value = withTiming(next ? 1 : 0, { duration: 400 })
    Keyboard.dismiss()
  }, [colorProgress, expanded, height, rotate])

  const rows = useMemo(
    () =>
      buildSkinProfileRows(userData?.profile, {
        translateComponent: t,
        translateOnboarding: onboardingT,
      }),
    [onboardingT, t, userData?.profile],
  )

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }))
  const animatedArrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }))
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorProgress.value, [0, 1], ['#def2ff', '#212529']),
  }))
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(colorProgress.value, [0, 1], ['#212529', '#def2ff']),
  }))
  const animatedIconStyle = useAnimatedStyle(() => ({
    tintColor: interpolateColor(colorProgress.value, [0, 1], ['#212529', '#def2ff']),
  }))

  return (
    <View className="w-full">
      <PressEffectWrapper onPress={toggleExpanded} fillAll={false}>
        <Animated.View
          style={[
            animatedHeaderStyle,
            {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.25,
              shadowRadius: 1,
              elevation: 1,
              height: sizes.longActionBtnH,
            },
          ]}
          className="w-full flex-row items-center justify-between rounded-full px-6"
        >
          <Animated.Text
            style={[animatedTextStyle, { fontSize: type.xl }]}
            className="font-quicksandBold"
          >
            {t('mySkinProfileBtn.title')}
          </Animated.Text>
          <Animated.Image
            source={icons.arrowDown}
            style={[
              animatedArrowStyle,
              animatedIconStyle,
              { width: sizes.longActionBtnImgS, height: sizes.longActionBtnImgS },
            ]}
          />
        </Animated.View>
      </PressEffectWrapper>

      <Animated.View style={animatedContainerStyle}>
        <View
          style={{
            borderRadius: scale(36),
            marginTop: scale(12),
            backgroundColor: '#fff',
            paddingHorizontal: scale(24),
            paddingVertical: scale(12),
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            style={{ paddingVertical: scale(20) }}
          >
            {rows.map(({ field, label, route, value }) => (
              <SkinProfileRow
                key={field}
                label={label}
                value={value}
                onPress={() => router.push(route)}
              />
            ))}

            <View className="mt-4 items-center">
              <PressEffectWrapper onPress={toggleExpanded} fillAll={false}>
                <Image
                  source={icons.arrowUp}
                  style={{ tintColor: '#212428' }}
                  className="h-6 w-6"
                />
              </PressEffectWrapper>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  )
}
