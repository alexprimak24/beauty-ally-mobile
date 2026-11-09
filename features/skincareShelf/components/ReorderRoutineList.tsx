import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { reorderRoutineText, skincareShelfColors } from '../constants'
import type { ReorderRoutineEntry, RoutineType } from '../types'
import { ReorderRoutineRow } from './ReorderRoutineRow'

interface ReorderRoutineListProps {
  bottomInset: number
  data: ReorderRoutineEntry[]
  listRevision: number
  onDragEnd: (data: ReorderRoutineEntry[]) => void
  section: RoutineType
}

export function ReorderRoutineList({
  bottomInset,
  data,
  listRevision,
  onDragEnd,
  section,
}: ReorderRoutineListProps) {
  const { t } = useTranslation(main)

  if (data.length === 0) {
    return (
      <View style={styles.emptyOuter}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t(reorderRoutineText.empty)}</Text>
        </View>
      </View>
    )
  }

  return (
    <DraggableFlatList
      key={`${section}-${listRevision}`}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={(props) => <ReorderRoutineRow {...props} />}
      onDragEnd={({ data: nextData }) => onDragEnd(nextData)}
      showsVerticalScrollIndicator={false}
      containerStyle={{ flex: 1 }}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: bottomInset + scale(48) }}
      activationDistance={0}
      autoscrollThreshold={60}
      autoscrollSpeed={140}
      dragItemOverflow={false}
      removeClippedSubviews={false}
    />
  )
}

const styles = {
  emptyOuter: { paddingHorizontal: scale(16), paddingTop: scale(12) },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(20),
    borderWidth: 1.5,
    borderColor: '#F4F6F8',
    paddingVertical: scale(20),
    paddingHorizontal: scale(16),
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: scale(14),
    color: skincareShelfColors.inactiveText,
  },
} as const
