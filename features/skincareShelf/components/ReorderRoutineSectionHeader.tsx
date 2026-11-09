import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { reorderRoutineText, routineHeaderThemes } from '../constants'
import type { RoutineType } from '../types'

export function ReorderRoutineSectionHeader({ type }: { type: RoutineType }) {
  const { t } = useTranslation(main)
  const isMorning = type === 'morning'
  const theme = routineHeaderThemes[type]

  return (
    <View style={{ marginBottom: scale(16), marginTop: scale(20), paddingHorizontal: scale(16) }}>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        {isMorning ? (
          <>
            <View style={[styles.morningCircleOne, { backgroundColor: theme.circle1 }]} />
            <View style={[styles.morningCircleTwo, { backgroundColor: theme.circle2 }]} />
            <View style={[styles.morningCircleThree, { backgroundColor: theme.circle3 }]} />
          </>
        ) : (
          <>
            <View style={[styles.eveningCircleOne, { backgroundColor: theme.circle1 }]} />
            <View style={[styles.eveningCircleTwo, { backgroundColor: theme.circle3 }]} />
            <View style={[styles.eveningCircleThree, { backgroundColor: theme.circle2 }]} />
          </>
        )}

        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <Ionicons name={isMorning ? 'sunny' : 'moon'} size={scale(24)} color={theme.icon} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {t(reorderRoutineText.sectionHeader[type])}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = {
  container: {
    width: '100%',
    height: scale(90),
    borderRadius: scale(24),
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  morningCircleOne: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  morningCircleTwo: {
    position: 'absolute',
    right: scale(40),
    bottom: -30,
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
  },
  morningCircleThree: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
  },
  eveningCircleOne: {
    position: 'absolute',
    right: scale(20),
    top: scale(10),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
  },
  eveningCircleTwo: {
    position: 'absolute',
    right: scale(40),
    bottom: -20,
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
  },
  eveningCircleThree: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: scale(46),
    height: scale(46),
    borderRadius: scale(23),
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(14),
  },
  title: { fontSize: scale(22), fontFamily: 'Quicksand-Bold' },
} as const
