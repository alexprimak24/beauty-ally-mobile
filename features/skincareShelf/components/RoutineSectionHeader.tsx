import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { routineHeaderThemes, skincareShelfText } from '../constants'
import type { RoutineType } from '../types'

export function RoutineSectionHeader({ type }: { type: RoutineType }) {
  const { t } = useTranslation(main)
  const isMorning = type === 'morning'
  const title = isMorning
    ? t(skincareShelfText.header.morningRoutine)
    : t(skincareShelfText.header.eveningRoutine)
  const theme = routineHeaderThemes[type]
  const iconName = isMorning ? 'sunny-outline' : 'moon'

  return (
    <View style={{ marginBottom: scale(16), marginTop: scale(24), paddingHorizontal: scale(16) }}>
      <View
        style={{
          width: '100%',
          height: scale(90),
          backgroundColor: theme.bg,
          borderRadius: scale(24),
          overflow: 'hidden',
          justifyContent: 'center',
          paddingHorizontal: scale(20),
        }}
      >
        {isMorning ? (
          <>
            <View
              style={{
                position: 'absolute',
                right: -20,
                top: -20,
                width: scale(100),
                height: scale(100),
                borderRadius: scale(50),
                backgroundColor: theme.circle1,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: scale(40),
                bottom: -30,
                width: scale(80),
                height: scale(80),
                borderRadius: scale(40),
                backgroundColor: theme.circle2,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: -10,
                bottom: -10,
                width: scale(60),
                height: scale(60),
                borderRadius: scale(30),
                backgroundColor: theme.circle3,
              }}
            />
          </>
        ) : (
          <>
            <View
              style={{
                position: 'absolute',
                right: scale(20),
                top: scale(10),
                width: scale(40),
                height: scale(40),
                borderRadius: scale(20),
                backgroundColor: theme.circle1,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: scale(40),
                bottom: -20,
                width: scale(70),
                height: scale(70),
                borderRadius: scale(35),
                backgroundColor: theme.circle3,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                width: scale(100),
                height: scale(100),
                borderRadius: scale(50),
                backgroundColor: theme.circle2,
              }}
            />
          </>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: scale(23),
              backgroundColor: 'rgba(255,255,255,0.7)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: scale(14),
            }}
          >
            <Ionicons name={iconName} size={scale(24)} color={theme.icon} />
          </View>
          <Text style={{ fontSize: scale(22), fontFamily: 'Quicksand-Bold', color: theme.text }}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  )
}
