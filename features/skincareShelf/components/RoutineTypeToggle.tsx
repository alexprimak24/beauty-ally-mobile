import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { reorderRoutineText, skincareShelfColors } from '../constants'
import type { RoutineType } from '../types'

interface RoutineTypeToggleProps {
  onChange: (value: RoutineType) => void
  value: RoutineType
}

export const RoutineTypeToggle = memo(function RoutineTypeToggle({
  onChange,
  value,
}: RoutineTypeToggleProps) {
  const { t } = useTranslation(main)

  return (
    <View style={styles.container}>
      {(['morning', 'evening'] as const).map((routineType) => (
        <TouchableOpacity
          key={routineType}
          activeOpacity={0.8}
          onPress={() => onChange(routineType)}
          style={[
            styles.option,
            { backgroundColor: value === routineType ? '#FFFFFF' : 'transparent' },
          ]}
        >
          <Text style={styles.label}>{t(reorderRoutineText.segmented[routineType])}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
})

const styles = {
  container: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    marginTop: scale(12),
    backgroundColor: '#E9ECEF',
    borderRadius: scale(18),
    padding: scale(4),
  },
  option: {
    flex: 1,
    height: scale(42),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Quicksand-Bold',
    fontSize: scale(14),
    color: skincareShelfColors.dark,
  },
} as const
