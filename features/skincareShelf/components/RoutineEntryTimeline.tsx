import { scale } from '@/design/responsiveNew'
import { Text, View } from 'react-native'

import { routineEntryColors } from '../routineEntryTheme'

interface RoutineEntryTimelineProps {
  activeBorder: string
  appliedToday: boolean
  isLastItem?: boolean
  stepNumber: number
}

export function RoutineEntryTimeline({
  activeBorder,
  appliedToday,
  isLastItem,
  stepNumber,
}: RoutineEntryTimelineProps) {
  return (
    <View style={{ width: scale(28), alignItems: 'center', marginRight: scale(10) }}>
      <View
        style={{
          width: scale(26),
          height: scale(26),
          borderRadius: scale(13),
          backgroundColor: routineEntryColors.card,
          borderWidth: scale(1.5),
          borderColor: appliedToday ? activeBorder : routineEntryColors.defaultBorder,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <Text
          style={{
            fontSize: scale(13),
            color: routineEntryColors.mutedText,
            fontFamily: 'InstrumentSans-Bold',
          }}
        >
          {stepNumber}
        </Text>
      </View>

      {!isLastItem ? (
        <View
          style={{
            flex: 1,
            width: 0,
            borderLeftWidth: scale(1.5),
            borderStyle: appliedToday ? 'solid' : 'dotted',
            borderColor: appliedToday ? activeBorder : routineEntryColors.timelineInactive,
            marginTop: appliedToday ? scale(-2) : scale(4),
            marginBottom: appliedToday ? scale(-20) : scale(-12),
            borderRadius: 1,
            zIndex: 1,
          }}
        />
      ) : null}
    </View>
  )
}
