import type { ShelfEntryItem } from '../types'
import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import { Image as ExpoImage } from 'expo-image'
import { useTranslation } from 'react-i18next'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated'
import { skincareShelfColors, skincareShelfText } from '../constants'

interface RoutineEntryActionsSheetProps {
  entry: ShelfEntryItem | null
  onClose: () => void
  onDelete: () => void
  onEdit: () => void
  onReorder: () => void
  onViewProduct: () => void
  visible: boolean
}

interface ActionRowProps {
  destructive?: boolean
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  onPress: () => void
  showDivider?: boolean
}

function ActionRow({
  destructive = false,
  icon,
  label,
  onPress,
  showDivider = false,
}: ActionRowProps) {
  const color = destructive ? skincareShelfColors.strongRed : skincareShelfColors.dark

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(14),
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: '#F4F6F8',
        marginTop: destructive ? scale(4) : 0,
      }}
    >
      <View
        style={{
          width: scale(40),
          height: scale(40),
          borderRadius: scale(20),
          backgroundColor: destructive ? '#FFE4E6' : '#F4F6F8',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name={icon} size={scale(20)} color={color} />
      </View>
      <Text
        style={{
          marginLeft: scale(16),
          fontFamily: 'Quicksand-SemiBold',
          fontSize: scale(16),
          color,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export function RoutineEntryActionsSheet({
  entry,
  onClose,
  onDelete,
  onEdit,
  onReorder,
  onViewProduct,
  visible,
}: RoutineEntryActionsSheetProps) {
  const { t } = useTranslation(main)

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        {entry && (
          <Animated.View
            entering={SlideInDown.duration(250).easing(Easing.out(Easing.cubic))}
            exiting={SlideOutDown.duration(200)}
            style={{
              backgroundColor: '#FFF',
              borderTopLeftRadius: scale(32),
              borderTopRightRadius: scale(32),
              paddingHorizontal: scale(24),
              paddingTop: scale(24),
              paddingBottom: scale(40),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: scale(-10) },
              shadowOpacity: 0.05,
              shadowRadius: scale(20),
              elevation: 20,
            }}
          >
            <View
              style={{
                width: scale(40),
                height: scale(5),
                borderRadius: scale(3),
                backgroundColor: '#E5E5EA',
                alignSelf: 'center',
                marginBottom: scale(24),
              }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(24) }}>
              <ExpoImage
                source={{ uri: entry.frontImage }}
                style={{
                  width: scale(60),
                  height: scale(60),
                  borderRadius: scale(16),
                  backgroundColor: '#F4F6F8',
                }}
                contentFit="cover"
              />
              <View style={{ flex: 1, marginLeft: scale(16) }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Quicksand-Medium',
                    fontSize: scale(13),
                    color: skincareShelfColors.inactiveText,
                    marginBottom: scale(4),
                  }}
                >
                  {entry.routineType === 'morning'
                    ? t(skincareShelfText.menu.morningRoutine)
                    : t(skincareShelfText.menu.eveningRoutine)}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'Quicksand-Bold',
                    fontSize: scale(18),
                    color: skincareShelfColors.dark,
                  }}
                >
                  {entry.productName}
                </Text>
              </View>
            </View>

            <ActionRow
              icon="eye-outline"
              label={t(skincareShelfText.menu.viewProductDetails)}
              onPress={onViewProduct}
              showDivider
            />
            <ActionRow
              icon="pencil-outline"
              label={t(skincareShelfText.menu.editEntry)}
              onPress={onEdit}
              showDivider
            />
            <ActionRow
              icon="swap-vertical-outline"
              label={t(skincareShelfText.menu.reorderSequence)}
              onPress={onReorder}
              showDivider
            />
            <ActionRow
              destructive
              icon="trash-outline"
              label={t(skincareShelfText.menu.removeFromRoutine)}
              onPress={onDelete}
            />
          </Animated.View>
        )}
      </View>
    </Modal>
  )
}
