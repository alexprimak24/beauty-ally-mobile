import { StyleSheet, TouchableOpacity, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import type { AnimatedStyle } from 'react-native-reanimated'

import { scale } from '@/design/responsiveNew'
import {
  productCheckCardColors as colors,
  productCheckCardMetrics as metrics,
} from './productCheckCardTheme'

interface ProductCheckCardSwipeActionsProps {
  applyIconStyle: AnimatedStyle<ViewStyle>
  onDelete: () => void
  onEdit: () => void
}

export function ProductCheckCardSwipeActions({
  applyIconStyle,
  onDelete,
  onEdit,
}: ProductCheckCardSwipeActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.applyAction}>
        <Animated.View style={applyIconStyle}>
          <Ionicons name="checkmark-circle" size={scale(28)} color={colors.applyIcon} />
        </Animated.View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity activeOpacity={0.7} onPress={onEdit} style={styles.editAction}>
          <Ionicons name="pencil-outline" size={scale(24)} color={colors.applyIcon} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={onDelete} style={styles.deleteAction}>
          <Ionicons name="trash-outline" size={scale(24)} color={colors.strongRed} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colors.defaultBorder,
    borderRadius: scale(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  applyAction: {
    backgroundColor: colors.lightBlue,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: scale(24),
  },
  rightActions: { flexDirection: 'row', width: metrics.rightActionsWidth },
  editAction: {
    alignItems: 'center',
    backgroundColor: colors.lightBlue,
    flex: 1,
    justifyContent: 'center',
  },
  deleteAction: {
    alignItems: 'center',
    backgroundColor: colors.primaryRed,
    flex: 1,
    justifyContent: 'center',
  },
})
