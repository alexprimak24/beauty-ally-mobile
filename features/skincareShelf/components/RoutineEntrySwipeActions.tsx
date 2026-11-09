import { scale } from '@/design/responsiveNew'
import { Ionicons } from '@expo/vector-icons'
import type { ViewStyle } from 'react-native'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import type { AnimatedStyle } from 'react-native-reanimated'

import { routineEntryColors } from '../routineEntryTheme'

interface RoutineEntrySwipeActionsProps {
  activeBackground: string
  activeIcon: string
  animatedApplyIconStyle: AnimatedStyle<ViewStyle>
  isApplyDisabled: boolean
  isDeleteDisabled?: boolean
  onDelete: () => void
  onEdit: () => void
  rightActionsWidth: number
}

export function RoutineEntrySwipeActions({
  activeBackground,
  activeIcon,
  animatedApplyIconStyle,
  isApplyDisabled,
  isDeleteDisabled,
  onDelete,
  onEdit,
  rightActionsWidth,
}: RoutineEntrySwipeActionsProps) {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFill,
        borderRadius: scale(24),
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        backgroundColor: routineEntryColors.defaultBorder,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: activeBackground,
          justifyContent: 'center',
          paddingLeft: scale(24),
        }}
      >
        <Animated.View style={animatedApplyIconStyle}>
          <Ionicons
            name={isApplyDisabled ? 'hourglass-outline' : 'checkmark-circle'}
            size={scale(28)}
            color={activeIcon}
          />
        </Animated.View>
      </View>

      <View style={{ flexDirection: 'row', width: rightActionsWidth }}>
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={onEdit}
          style={{
            flex: 1,
            backgroundColor: activeBackground,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="pencil-outline" size={scale(24)} color={activeIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.7}
          disabled={isDeleteDisabled}
          onPress={onDelete}
          style={{
            flex: 1,
            backgroundColor: routineEntryColors.primaryRedBackground,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name={isDeleteDisabled ? 'hourglass-outline' : 'trash-outline'}
            size={scale(24)}
            color={routineEntryColors.strongRed}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
