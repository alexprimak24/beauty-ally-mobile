import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Modal, Text, View } from 'react-native'
import { useUser } from '@clerk/expo'
import { useRouter } from 'expo-router'

import { icons } from '@/constants/icons'
import { PRIVACY_POLICY, TERMS_OF_USE } from '@/constants/usefulLinks'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { useOpenLink } from '@/hooks/useOpenLink'
import { components } from '@/utils/i18n/keyConstants'
import { getLocaleSafe } from '@/utils/locale'
import { useAccountDeletion } from '../hooks/useAccountDeletion'
import { buildSupportMailtoUrl } from '../model'
import { HealthDataConsentSetting } from './HealthDataConsentSetting'
import { ProfileNotificationIcon } from './ProfileNotificationIcon'
import { ProfileSettingsRow } from './ProfileSettingsRow'

interface ProfileSettingsSectionProps {
  onAccountDelete: () => Promise<void> | void
}

export function ProfileSettingsSection({ onAccountDelete }: ProfileSettingsSectionProps) {
  const router = useRouter()
  const { openLink } = useOpenLink()
  const { user } = useUser()
  const { sizes, type } = useRTokens()
  const { t } = useTranslation(components)
  const { isDeleting, requestAccountDeletion } = useAccountDeletion({ onAccountDelete })

  const icon = useCallback(
    (source: number, tintColor = '#212529') => (
      <Image
        source={source}
        style={{ width: sizes.bottomSettingsIcons, height: sizes.bottomSettingsIcons }}
        tintColor={tintColor}
      />
    ),
    [sizes.bottomSettingsIcons],
  )

  const handleContactUs = useCallback(() => {
    const url = buildSupportMailtoUrl({
      body: t('settings.contact.emailBody', {
        userId: user?.id ?? 'N/A',
        locale: getLocaleSafe(),
      }),
      subject: t('settings.contact.emailSubject'),
    })
    void openLink(url)
  }, [openLink, t, user?.id])

  return (
    <View
      className="bg-white p-6"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 2,
        borderRadius: scale(36),
      }}
    >
      <HealthDataConsentSetting />

      <ProfileSettingsRow
        icon={icon(icons.subscription)}
        label={t('settings.links.manageSub')}
        onPress={() => router.push('/(auth)/payment/paywall')}
      />
      <View className="h-[1px] bg-gray-200" />

      <ProfileSettingsRow
        icon={<ProfileNotificationIcon />}
        label={t('settings.links.notifications')}
        onPress={() => router.push('/notifications')}
      />
      <View className="h-[1px] bg-gray-200" />

      <ProfileSettingsRow
        icon={icon(icons.email)}
        label={t('settings.links.contact')}
        onPress={handleContactUs}
      />
      <View className="h-[1px] bg-gray-200" />

      <ProfileSettingsRow
        icon={icon(icons.privacyPolicy)}
        label={t('settings.links.privacy')}
        onPress={() => void openLink(PRIVACY_POLICY)}
      />
      <View className="h-[1px] bg-gray-200" />

      <ProfileSettingsRow
        icon={icon(icons.termsAndConditions)}
        label={t('settings.links.terms')}
        onPress={() => void openLink(TERMS_OF_USE)}
      />
      <View className="h-[1px] bg-gray-200" />

      <ProfileSettingsRow
        destructive
        icon={icon(icons.trash, '#E63946')}
        label={t('settings.alerts.delete.title')}
        onPress={requestAccountDeletion}
      />

      <Modal visible={isDeleting} transparent animationType="fade" onRequestClose={() => undefined}>
        <View className="flex-1 items-center justify-center bg-black/30">
          <View className="rounded-2xl bg-white p-6">
            <ActivityIndicator />
            <Text className="mt-3 font-quicksandBold text-dark" style={{ fontSize: type.base }}>
              {t('settings.deletingModal.deleting')}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}
