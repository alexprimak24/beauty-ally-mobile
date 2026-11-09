import type { Href, ImperativeRouter } from 'expo-router'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { common } from '@/utils/i18n/keyConstants'

export function useConsentAlert() {
  const { t } = useTranslation(common)

  return useCallback(
    (router: Pick<ImperativeRouter, 'replace'>, profileHref: Href) => {
      Alert.alert(
        t('consentAlert.title'),
        t('consentAlert.body'),
        [
          { text: t('consentAlert.cancel'), style: 'cancel' },
          { text: t('consentAlert.enable'), onPress: () => router.replace(profileHref) },
        ],
        { cancelable: true },
      )
    },
    [t],
  )
}
