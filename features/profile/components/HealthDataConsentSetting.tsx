import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Switch, Text, View } from 'react-native'

import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import { useHealthDataConsentSetting } from '../hooks/useHealthDataConsentSetting'

export function HealthDataConsentSetting() {
  const { type } = useRTokens()
  const { t } = useTranslation(components)
  const { enabled, isAvailable, isUpdating, requestToggle } = useHealthDataConsentSetting()

  if (!isAvailable) return null

  return (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1 pr-4">
        <Text className="font-quicksandBold text-dark" style={{ fontSize: type.lg }}>
          {t('settings.scan.title')}
        </Text>
        <Text className="mt-2 text-gray-500" style={{ fontSize: type.xs }}>
          {t('settings.scan.subtitle')}
        </Text>
      </View>

      {isUpdating ? (
        <ActivityIndicator />
      ) : (
        <Switch
          accessibilityRole="switch"
          accessibilityLabel={t('settings.scan.a11yLabel')}
          value={enabled}
          onValueChange={requestToggle}
          disabled={isUpdating}
          trackColor={{ false: '#E5E7EB', true: '#c7e5fa' }}
          thumbColor="#ffffff"
        />
      )}
    </View>
  )
}
