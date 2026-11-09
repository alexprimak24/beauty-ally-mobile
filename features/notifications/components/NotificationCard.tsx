import { Image, Pressable, Text, View } from 'react-native'

import { icons } from '@/constants/icons'
import { useRTokens } from '@/design/useRTokens'
import { useTimeAgo } from '@/hooks/useTimeAgo'
import type { NotificationItem } from '@/services/alerts'
import { getNotificationTheme } from '../model'

interface NotificationCardProps {
  disabled: boolean
  item: NotificationItem
  onPress: () => void
}

export function NotificationCard({ disabled, item, onPress }: NotificationCardProps) {
  const { type } = useRTokens()
  const { borderColor, unreadColor } = getNotificationTheme(item.type)
  const timeAgo = useTimeAgo(item.createdAt)

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityState={{ disabled }}
      className="mx-[2px] mb-3 rounded-2xl bg-white px-4 py-3"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      <View className="flex-row items-start">
        <View
          className="mr-3 mt-2 h-2 w-2 rounded-full"
          style={{ backgroundColor: item.read ? '#D1D5DB' : unreadColor }}
        />
        <View className="flex-1">
          <Text
            className="font-quicksandSemiBold text-dark"
            style={{ fontSize: type.sm }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {!!item.subtitle && (
            <Text className="mt-1 text-gray-500" style={{ fontSize: type.xs }} numberOfLines={3}>
              {item.subtitle}
            </Text>
          )}
          <View className="mt-2 self-start rounded-md bg-lightBg px-2 py-1">
            <Text className="font-quicksandSemiBold text-dark" style={{ fontSize: type.xxs }}>
              {timeAgo}
            </Text>
          </View>
        </View>
        <Image source={icons.rightArrow} className="ml-3 mt-1 h-4 w-4" tintColor="#9CA3AF" />
      </View>
    </Pressable>
  )
}
