import { scale } from '@/design/responsiveNew'
import { common, components } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated'

const ROUTINE_CONFIG_CARD_TEXT = {
  title: {
    morning: 'routine.morningTitle',
    evening: 'routine.eveningTitle',
  },
  subtitle: {
    morning: 'routine.morningSubtitle',
    evening: 'routine.eveningSubtitle',
  },
  frequency: {
    daily: 'routine.daily',
    specificDays: 'routine.specificDays',
  },
  weekdays: {
    superShort: {
      mo: 'common:weekdays.superShort.mo',
      tu: 'common:weekdays.superShort.tu',
      we: 'common:weekdays.superShort.we',
      th: 'common:weekdays.superShort.th',
      fr: 'common:weekdays.superShort.fr',
      sa: 'common:weekdays.superShort.sa',
      su: 'common:weekdays.superShort.su',
    },
  },
} as const

const WEEKDAYS = [
  { key: 'mo', value: 1 },
  { key: 'tu', value: 2 },
  { key: 'we', value: 4 },
  { key: 'th', value: 8 },
  { key: 'fr', value: 16 },
  { key: 'sa', value: 32 },
  { key: 'su', value: 64 },
] as const

const CONFIG_THEMES = {
  morning: {
    primary: '#38BDF8',
    accent: '#0369A1',
    lightTint: '#F0F9FF',
    cardBg: '#FFFFFF',
    shadow: '#E0F2FE',
  },
  evening: {
    primary: '#606CBA',
    accent: '#3A4482',
    lightTint: '#F4F5FB',
    cardBg: '#FFFFFF',
    shadow: '#8E98D6',
  },
}

const COLORS = {
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  inactiveBg: '#F8F9FA',
  white: '#FFFFFF',
}

interface RoutineConfigCardProps {
  type: 'morning' | 'evening'
  isSelected: boolean
  onToggleSelect: () => void
  frequency: 'daily' | 'selected_weekdays'
  onFrequencyChange: (freq: 'daily' | 'selected_weekdays') => void
  weekdaysMask: number
  onToggleWeekday: (val: number) => void
  animateLayout?: boolean
  readOnly?: boolean
  showShadow?: boolean
  style?: StyleProp<ViewStyle>
}

const premiumEasing = Easing.bezier(0.25, 1, 0.5, 1)

export default function RoutineConfigCard({
  type,
  isSelected,
  onToggleSelect,
  frequency,
  onFrequencyChange,
  weekdaysMask,
  onToggleWeekday,
  animateLayout = true,
  readOnly = false,
  showShadow = true,
  style,
}: RoutineConfigCardProps) {
  const { t } = useTranslation([components, common])

  const isMorning = type === 'morning'
  const theme = isMorning ? CONFIG_THEMES.morning : CONFIG_THEMES.evening
  const iconName = isMorning ? 'sunny-outline' : 'moon-outline'

  return (
    <Animated.View
      layout={animateLayout ? LinearTransition.duration(350).easing(premiumEasing) : undefined}
      style={[
        {
          backgroundColor: isSelected ? theme.cardBg : COLORS.inactiveBg,
          borderRadius: scale(24),
          padding: scale(20),
          borderWidth: showShadow ? 0 : 1,
          borderColor: showShadow ? 'transparent' : '#E5E7EB',
          shadowColor: showShadow && isSelected ? theme.shadow : 'transparent',
          shadowOffset: { width: 0, height: scale(14) },
          shadowOpacity: showShadow ? (isSelected ? 0.12 : 0.02) : 0,
          shadowRadius: showShadow ? scale(24) : 0,
          elevation: showShadow && isSelected ? 6 : 0,
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={readOnly}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          onToggleSelect()
        }}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: scale(23),
              backgroundColor: isSelected ? theme.lightTint : '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: scale(16),
            }}
          >
            <Ionicons
              name={iconName}
              size={scale(22)}
              color={isSelected ? theme.accent : COLORS.textMuted}
            />
          </View>

          <View>
            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                color: COLORS.textPrimary,
                fontSize: scale(17),
                letterSpacing: 0.3,
              }}
            >
              {t(
                isMorning
                  ? ROUTINE_CONFIG_CARD_TEXT.title.morning
                  : ROUTINE_CONFIG_CARD_TEXT.title.evening,
              )}
            </Text>

            <Text
              style={{
                fontFamily: 'Quicksand-Medium',
                color: isSelected ? COLORS.textSecondary : COLORS.textMuted,
                fontSize: scale(13),
                marginTop: scale(4),
              }}
            >
              {t(
                isMorning
                  ? ROUTINE_CONFIG_CARD_TEXT.subtitle.morning
                  : ROUTINE_CONFIG_CARD_TEXT.subtitle.evening,
              )}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: scale(26),
            height: scale(26),
            borderRadius: scale(13),
            borderWidth: isSelected ? 0 : 1.5,
            borderColor: '#D1D5DB',
            backgroundColor: isSelected ? theme.primary : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: isSelected ? theme.shadow : 'transparent',
            shadowOpacity: isSelected ? 0.3 : 0,
            shadowRadius: scale(6),
            shadowOffset: { width: 0, height: scale(3) },
          }}
        >
          {isSelected && <Ionicons name="checkmark" size={scale(16)} color={COLORS.white} />}
        </View>
      </TouchableOpacity>

      {isSelected && (
        <Animated.View
          entering={FadeInDown.duration(300).easing(premiumEasing)}
          exiting={FadeOutUp.duration(200).easing(premiumEasing)}
          style={{ marginTop: scale(26) }}
        >
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: theme.lightTint,
              borderRadius: scale(20),
              padding: scale(4),
              marginBottom: frequency === 'selected_weekdays' ? scale(20) : scale(4),
            }}
          >
            {(['daily', 'selected_weekdays'] as const).map((freqOption) => {
              const isActive = frequency === freqOption
              const label =
                freqOption === 'daily'
                  ? t(ROUTINE_CONFIG_CARD_TEXT.frequency.daily)
                  : t(ROUTINE_CONFIG_CARD_TEXT.frequency.specificDays)

              return (
                <TouchableOpacity
                  key={freqOption}
                  activeOpacity={0.8}
                  disabled={readOnly}
                  onPress={() => {
                    if (!isActive) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    onFrequencyChange(freqOption)
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: scale(12),
                    borderRadius: scale(16),
                    alignItems: 'center',
                    backgroundColor: isActive ? theme.primary : 'transparent',
                    shadowColor: isActive ? theme.shadow : 'transparent',
                    shadowOpacity: isActive ? 0.25 : 0,
                    shadowRadius: scale(8),
                    shadowOffset: { width: 0, height: scale(4) },
                    elevation: isActive ? 4 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: isActive ? 'Quicksand-Bold' : 'Quicksand-Medium',
                      color: isActive ? COLORS.white : theme.accent,
                      fontSize: scale(14),
                      letterSpacing: 0.2,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {frequency === 'selected_weekdays' && (
            <Animated.View
              entering={FadeInDown.duration(300).easing(premiumEasing)}
              exiting={FadeOutUp.duration(200).easing(premiumEasing)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: scale(2),
                paddingBottom: scale(6),
              }}
            >
              {WEEKDAYS.map((day, index) => {
                const isDaySelected = (weekdaysMask & day.value) !== 0

                return (
                  <TouchableOpacity
                    key={`${type}-${index}`}
                    activeOpacity={0.7}
                    disabled={readOnly}
                    onPress={() => {
                      Haptics.selectionAsync()
                      onToggleWeekday(day.value)
                    }}
                    style={{
                      width: scale(42),
                      height: scale(42),
                      borderRadius: scale(21),
                      backgroundColor: isDaySelected ? theme.primary : theme.lightTint,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: isDaySelected ? theme.shadow : 'transparent',
                      shadowOpacity: isDaySelected ? 0.3 : 0,
                      shadowRadius: scale(8),
                      shadowOffset: { width: 0, height: scale(4) },
                      elevation: isDaySelected ? 4 : 0,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: isDaySelected ? 'Quicksand-Bold' : 'Quicksand-Medium',
                        fontSize: scale(14),
                        color: isDaySelected ? COLORS.white : theme.accent,
                      }}
                    >
                      {t(ROUTINE_CONFIG_CARD_TEXT.weekdays.superShort[day.key])}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </Animated.View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  )
}
