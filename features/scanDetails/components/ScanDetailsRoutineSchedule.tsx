import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { scale } from '@/design/responsiveNew'
import RoutineConfigCard from '@/features/routine/components/RoutineConfigCard'
import type { RoutineSchedule } from '@/features/routine'
import type { FrequencyType, RoutineType } from '@/services/routine'
import { main } from '@/utils/i18n/keyConstants'
import { scanDetailsText } from '../constants'

interface ScanDetailsRoutineScheduleProps {
  onFrequencyChange: (routineType: RoutineType, frequency: FrequencyType) => void
  onTogglePeriod: (routineType: RoutineType) => void
  onToggleWeekday: (routineType: RoutineType, weekday: number) => void
  schedule: RoutineSchedule
}

export function ScanDetailsRoutineSchedule({
  onFrequencyChange,
  onTogglePeriod,
  onToggleWeekday,
  schedule,
}: ScanDetailsRoutineScheduleProps) {
  const { t } = useTranslation(main)

  return (
    <View style={{ marginTop: scale(16) }}>
      <Text style={styles.title}>{t(scanDetailsText.headerSchedule)}</Text>

      {(['morning', 'evening'] as const).map((routineType) => {
        const period = schedule[routineType]

        return (
          <RoutineConfigCard
            key={routineType}
            animateLayout={false}
            type={routineType}
            isSelected={period.isSelected}
            onToggleSelect={() => onTogglePeriod(routineType)}
            frequency={period.frequency}
            onFrequencyChange={(frequency) => onFrequencyChange(routineType, frequency)}
            weekdaysMask={period.weekdaysMask}
            onToggleWeekday={(weekday) => onToggleWeekday(routineType, weekday)}
            showShadow={false}
            style={{ marginBottom: routineType === 'morning' ? scale(16) : scale(8) }}
          />
        )
      })}
    </View>
  )
}

const styles = {
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: scale(16),
    color: '#212529',
    marginBottom: scale(12),
    marginLeft: scale(4),
  },
} as const
