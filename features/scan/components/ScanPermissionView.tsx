import { useRTokens } from '@/design/useRTokens'
import { main } from '@/utils/i18n/keyConstants'
import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

export function ScanPermissionView({ onRequest }: { onRequest: () => void }) {
  const { type } = useRTokens()
  const { t } = useTranslation(main)

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="mb-4 text-white" style={{ fontSize: type.base }}>
        {t('scan.permission.title')}
      </Text>
      <Pressable className="rounded-full bg-white/10 px-6 py-3" onPress={onRequest}>
        <Text className="text-white" style={{ fontSize: type.base }}>
          {t('scan.permission.cta')}
        </Text>
      </Pressable>
    </View>
  )
}
