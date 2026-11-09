import { icons } from '@/constants/icons'
import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  FadeInUp,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { skincareShelfColors, skincareShelfText } from '../constants'

interface SkincareShelfGuidesProps {
  firstItemY: number
  onDismissDateGuide: () => void
  onDismissSwipeGuide: () => void
  showDateGuide: boolean
  showSwipeGuide: boolean
}

export function SkincareShelfGuides({
  firstItemY,
  onDismissDateGuide,
  onDismissSwipeGuide,
  showDateGuide,
  showSwipeGuide,
}: SkincareShelfGuidesProps) {
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation(main)
  const handTranslateX = useSharedValue(0)

  useEffect(() => {
    if (showSwipeGuide) {
      handTranslateX.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(scale(110), { duration: 1100, easing: Easing.out(Easing.quad) }),
          withDelay(500, withTiming(0, { duration: 0 })),
        ),
        -1,
        false,
      )
      return
    }

    cancelAnimation(handTranslateX)
    handTranslateX.value = 0
  }, [handTranslateX, showSwipeGuide])

  return (
    <>
      <Modal visible={showDateGuide} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
          <View style={{ paddingTop: top + scale(45), alignItems: 'center' }}>
            <Animated.View entering={FadeInUp.duration(600).delay(300)}>
              <Ionicons name="arrow-up" size={scale(40)} color="#FFF" />
            </Animated.View>
          </View>

          <View
            style={{ alignItems: 'center', marginTop: scale(10), paddingHorizontal: scale(40) }}
          >
            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                fontSize: scale(26),
                color: '#FFF',
                textAlign: 'center',
              }}
            >
              {t(skincareShelfText.guides.dateTitle)}
            </Text>
            <Text
              style={{
                fontFamily: 'Quicksand-Medium',
                fontSize: scale(16),
                color: 'rgba(255,255,255,0.85)',
                textAlign: 'center',
                marginTop: scale(12),
                lineHeight: scale(22),
              }}
            >
              {t(skincareShelfText.guides.dateDescription)}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onDismissDateGuide}
              style={{
                marginTop: scale(40),
                backgroundColor: '#FFF',
                paddingHorizontal: scale(32),
                paddingVertical: scale(14),
                borderRadius: scale(24),
              }}
            >
              <Text
                style={{
                  fontFamily: 'Quicksand-Bold',
                  fontSize: scale(16),
                  color: skincareShelfColors.dark,
                }}
              >
                {t(skincareShelfText.guides.dateButton)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSwipeGuide} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: firstItemY,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                left: scale(50),
                top: scale(30),
                transform: [{ translateX: handTranslateX }],
                shadowColor: '#FFF',
                shadowOpacity: 0.5,
                shadowRadius: scale(20),
              }}
            >
              <Image source={icons.swipeAction} style={{ width: scale(60), height: scale(60) }} />
            </Animated.View>

            <View
              style={{ marginTop: scale(120), alignItems: 'center', paddingHorizontal: scale(40) }}
            >
              <Text
                style={{
                  fontFamily: 'Quicksand-Bold',
                  fontSize: scale(26),
                  color: '#FFF',
                  textAlign: 'center',
                }}
              >
                {t(skincareShelfText.guides.swipeTitle)}
              </Text>
              <Text
                style={{
                  fontFamily: 'Quicksand-Medium',
                  fontSize: scale(16),
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: 'center',
                  marginTop: scale(12),
                  lineHeight: scale(22),
                }}
              >
                {t(skincareShelfText.guides.swipeDescription)}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onDismissSwipeGuide}
                style={{
                  marginTop: scale(40),
                  backgroundColor: '#FFF',
                  paddingHorizontal: scale(32),
                  paddingVertical: scale(14),
                  borderRadius: scale(24),
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Quicksand-Bold',
                    fontSize: scale(16),
                    color: skincareShelfColors.dark,
                  }}
                >
                  {t(skincareShelfText.guides.swipeButton)}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}
