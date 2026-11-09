import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import {
  fullDayTheme,
  routineHeaderThemes,
  skincareShelfColors,
  skincareShelfText,
} from '../constants'
import type { RoutineCompletionType } from '../types'

interface FastActionButtonProps {
  title: string
  icon: ComponentProps<typeof Ionicons>['name']
  backgroundColor: string
  textColor: string
  onPress: () => void
}

function FastActionButton({
  title,
  icon,
  backgroundColor,
  textColor,
  onPress,
}: FastActionButtonProps) {
  const scaleValue = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scaleValue.value }] }))

  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        scaleValue.value = withTiming(0.96, { duration: 100 })
      }}
      onPressOut={() => {
        scaleValue.value = withTiming(1, { duration: 150 })
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor,
            paddingVertical: scale(14),
            borderRadius: scale(16),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          },
          animatedStyle,
        ]}
      >
        <Ionicons
          name={icon}
          size={scale(16)}
          color={textColor}
          style={{ marginRight: scale(6) }}
        />
        <Text style={{ fontFamily: 'Quicksand-Bold', color: textColor, fontSize: scale(13) }}>
          {title}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

interface RoutineFastActionsProps {
  expanded: boolean
  onComplete: (type: RoutineCompletionType) => void
  onEditOrder: () => void
  onToggleExpanded: () => void
}

export function RoutineFastActions({
  expanded,
  onComplete,
  onEditOrder,
  onToggleExpanded,
}: RoutineFastActionsProps) {
  const { t } = useTranslation(main)

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onToggleExpanded()
  }

  return (
    <View style={{ paddingHorizontal: scale(16), marginTop: scale(20) }}>
      <Animated.View layout={LinearTransition.duration(250).easing(Easing.out(Easing.ease))}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggle}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                fontSize: scale(13),
                color: skincareShelfColors.inactiveText,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {t(skincareShelfText.fastActions.title)}
            </Text>
            <Animated.View
              style={{
                transform: [{ rotate: expanded ? '180deg' : '0deg' }],
                marginLeft: scale(4),
              }}
            >
              <Ionicons
                name="chevron-down"
                size={scale(16)}
                color={skincareShelfColors.inactiveText}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onEditOrder}
            style={{ flexDirection: 'row', alignItems: 'center', gap: scale(4) }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="swap-vertical"
              size={scale(14)}
              color={skincareShelfColors.inactiveText}
            />
            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                fontSize: scale(13),
                color: skincareShelfColors.inactiveText,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {t(skincareShelfText.fastActions.editOrder)}
            </Text>
          </TouchableOpacity>
        </View>

        {expanded && (
          <Animated.View
            entering={FadeInUp.duration(200)}
            exiting={FadeOutUp.duration(200)}
            style={{ marginTop: scale(16) }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: scale(10) }}>
              <FastActionButton
                title={t(skincareShelfText.fastActions.morning)}
                icon="sunny"
                backgroundColor={routineHeaderThemes.morning.bg}
                textColor={routineHeaderThemes.morning.text}
                onPress={() => onComplete('morning')}
              />
              <FastActionButton
                title={t(skincareShelfText.fastActions.evening)}
                icon="moon"
                backgroundColor={routineHeaderThemes.evening.bg}
                textColor={routineHeaderThemes.evening.text}
                onPress={() => onComplete('evening')}
              />
            </View>

            <View style={{ marginTop: scale(10) }}>
              <FastActionButton
                title={t(skincareShelfText.fastActions.completeFullDay)}
                icon="checkmark-done-circle"
                backgroundColor={fullDayTheme.bg}
                textColor={fullDayTheme.text}
                onPress={() => onComplete('all')}
              />
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  )
}
