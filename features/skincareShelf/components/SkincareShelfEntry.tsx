import { scale } from '@/design/responsiveNew'
import { memo } from 'react'
import { View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { useRoutineEntrySwipe } from '../hooks/useRoutineEntrySwipe'
import { getRoutineEntryTheme, routineEntryColors } from '../routineEntryTheme'
import type { ShelfEntryItem } from '../types'
import { RoutineEntryCardContent } from './RoutineEntryCardContent'
import { RoutineEntrySwipeActions } from './RoutineEntrySwipeActions'
import { RoutineEntryTimeline } from './RoutineEntryTimeline'

interface SkincareRoutineRowProps {
  entry: ShelfEntryItem
  isApplyDisabled?: boolean
  isDeleteDisabled?: boolean
  isInteractive?: boolean
  isLastItem?: boolean
  onApplyToggle?: (entry: ShelfEntryItem) => void
  onDelete?: (entry: ShelfEntryItem) => void
  onEdit?: (entry: ShelfEntryItem) => void
  onFavoriteToggle?: (entry: ShelfEntryItem) => void
  onLongPressOptions?: (entry: ShelfEntryItem) => void
  onPressPurchase?: (entry: ShelfEntryItem) => void
}

function SkincareRoutineRowComponent({
  entry,
  isApplyDisabled = false,
  isDeleteDisabled,
  isInteractive = true,
  isLastItem,
  onApplyToggle,
  onDelete,
  onEdit,
  onFavoriteToggle,
  onLongPressOptions,
  onPressPurchase,
}: SkincareRoutineRowProps) {
  const theme = getRoutineEntryTheme(entry.routineType)
  const swipe = useRoutineEntrySwipe({
    entry,
    isApplyDisabled,
    isInteractive,
    onApplyToggle,
  })
  const handleEdit = () => {
    swipe.closeActions()
    onEdit?.(entry)
  }
  const handleDelete = () => {
    swipe.closeActions()
    onDelete?.(entry)
  }

  return (
    <View style={{ flexDirection: 'row', width: '100%', marginBottom: scale(8) }}>
      <RoutineEntryTimeline
        activeBorder={theme.activeBorder}
        appliedToday={entry.appliedToday}
        isLastItem={isLastItem}
        stepNumber={entry.stepNumber}
      />

      <View style={{ flex: 1, position: 'relative' }}>
        <RoutineEntrySwipeActions
          activeBackground={theme.activeBackground}
          activeIcon={theme.activeIcon}
          animatedApplyIconStyle={swipe.animatedApplyIconStyle}
          isApplyDisabled={isApplyDisabled}
          isDeleteDisabled={isDeleteDisabled}
          onDelete={handleDelete}
          onEdit={handleEdit}
          rightActionsWidth={swipe.rightActionsWidth}
        />

        <GestureDetector gesture={swipe.panGesture}>
          <Animated.View
            style={[
              {
                backgroundColor: routineEntryColors.card,
                borderRadius: scale(24),
                borderWidth: scale(1.5),
                borderColor: entry.appliedToday
                  ? theme.activeBorder
                  : routineEntryColors.defaultBorder,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: scale(4) },
                shadowOpacity: 0.03,
                shadowRadius: scale(8),
                elevation: 2,
              },
              swipe.animatedCardStyle,
            ]}
          >
            <RoutineEntryCardContent
              entry={entry}
              onFavoriteToggle={onFavoriteToggle}
              onLongPressOptions={onLongPressOptions}
              onPressPurchase={onPressPurchase}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  )
}

function areEqual(previous: SkincareRoutineRowProps, next: SkincareRoutineRowProps) {
  return (
    previous.entry.id === next.entry.id &&
    previous.entry.routineEntryID === next.entry.routineEntryID &&
    previous.entry.productCheckID === next.entry.productCheckID &&
    previous.entry.productName === next.entry.productName &&
    previous.entry.frontImage === next.entry.frontImage &&
    previous.entry.frequencyDisplay === next.entry.frequencyDisplay &&
    previous.entry.routineType === next.entry.routineType &&
    previous.entry.isFavorites === next.entry.isFavorites &&
    previous.entry.appliedToday === next.entry.appliedToday &&
    previous.entry.isRunningLow === next.entry.isRunningLow &&
    previous.entry.stepNumber === next.entry.stepNumber &&
    previous.entry.purchaseLink === next.entry.purchaseLink &&
    previous.isLastItem === next.isLastItem &&
    previous.isApplyDisabled === next.isApplyDisabled &&
    previous.isDeleteDisabled === next.isDeleteDisabled &&
    previous.isInteractive === next.isInteractive &&
    previous.onApplyToggle === next.onApplyToggle &&
    previous.onDelete === next.onDelete &&
    previous.onEdit === next.onEdit &&
    previous.onFavoriteToggle === next.onFavoriteToggle &&
    previous.onLongPressOptions === next.onLongPressOptions &&
    previous.onPressPurchase === next.onPressPurchase
  )
}

export default memo(SkincareRoutineRowComponent, areEqual)
