import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'

import { icons } from '@/constants/icons'
import { useRTokens } from '@/design/useRTokens'
import { main } from '@/utils/i18n/keyConstants'

export function NotificationsEmptyState() {
  const { sizes, type } = useRTokens()
  const { t } = useTranslation(main)

  return (
    <View className="mt-20 flex-1 items-center justify-center px-10">
      <Image
        source={icons.notice}
        tintColor="#39424b"
        style={{ width: sizes.notificationImg, height: sizes.notificationImg }}
      />
      <Text className="mt-3 font-quicksandBold text-dark" style={{ fontSize: type.base }}>
        {t('notifications.emptyTitle')}
      </Text>
      <Text className="mt-1 text-center text-gray-500" style={{ fontSize: type.sm }}>
        {t('notifications.emptySubtitle')}
      </Text>
    </View>
  )
}
