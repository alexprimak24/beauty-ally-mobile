import { Image, Text, View } from 'react-native'

import { icons } from '@/constants/icons'
import { useRTokens } from '@/design/useRTokens'
import { useUnreadNotificationsCount } from '@/features/notifications/hooks/useUnreadNotificationsCount'

export function ProfileNotificationIcon() {
  const { sizes, type } = useRTokens()
  const { data, isError, isLoading } = useUnreadNotificationsCount()
  const unread = !isLoading && !isError && typeof data?.unread === 'number' ? data.unread : 0

  return (
    <View>
      <Image
        source={icons.bell}
        style={{ width: sizes.bottomSettingsIcons, height: sizes.bottomSettingsIcons }}
        tintColor="#212529"
      />
      {unread > 0 && (
        <View
          style={{ minWidth: sizes.unreadNum, width: sizes.unreadNum }}
          className="absolute -right-1 -top-1 items-center justify-center rounded-full bg-red-300 px-1"
        >
          <Text className="font-quicksandBold text-white" style={{ fontSize: type.xxs }}>
            {unread > 9 ? '9+' : unread}
          </Text>
        </View>
      )}
    </View>
  )
}
