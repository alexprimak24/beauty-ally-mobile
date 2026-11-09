import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useClerk } from '@clerk/expo'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

import { useUser } from '@/hooks/useGetUser'
import { useHasSelectedLanguage } from '@/hooks/useHasSelectedLanguage'
import { useUpdateSkinProfile } from '@/hooks/useUpdateSkinProfile'
import { main } from '@/utils/i18n/keyConstants'
import { englishFromLongCode } from '@/utils/i18n/map'
import { LANGUAGE_KEY } from '@/utils/i18n/languageDetector'
import { getProfileLanguageTagToSync } from '../model'

export function useProfileSettings() {
  const { signOut } = useClerk()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: userData } = useUser()
  const { updateField, isUpdating } = useUpdateSkinProfile()
  const { code: languageCode } = useHasSelectedLanguage()
  const { i18n, t } = useTranslation(main)
  const profileLanguage = userData?.profile?.language

  useEffect(() => {
    let active = true

    const reconcileLanguage = async () => {
      try {
        const savedLanguageTag = await AsyncStorage.getItem(LANGUAGE_KEY)
        const languageTag = getProfileLanguageTagToSync(profileLanguage, savedLanguageTag)

        if (active && languageTag) {
          await i18n.changeLanguage(languageTag)
        }
      } catch (error) {
        if (__DEV__) console.warn('Failed to reconcile profile language:', error)
      }
    }

    void reconcileLanguage()

    return () => {
      active = false
    }
  }, [i18n, profileLanguage])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      queryClient.clear()
      router.replace('/(auth)/onboarding/welcome')
    } catch {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('profile.signOutErr'),
      })
    }
  }, [queryClient, router, signOut, t])

  const handleLanguageChange = useCallback(
    async (languageTag: string) => {
      const previousLanguageTag = i18n.resolvedLanguage ?? i18n.language

      try {
        await i18n.changeLanguage(languageTag)
        await updateField('language', englishFromLongCode(languageTag))
        Toast.show({
          type: 'success',
          position: 'top',
          text1: t('edit.updateOkTitle'),
          text2: t('edit.language.updateOkBody'),
        })
      } catch {
        await i18n.changeLanguage(previousLanguageTag)
        Toast.show({
          type: 'error',
          position: 'top',
          text1: t('edit.updateErrTitle'),
          text2: t('edit.language.updateErrBody'),
        })
      }
    },
    [i18n, t, updateField],
  )

  return {
    handleLanguageChange,
    handleSignOut,
    isUpdatingLanguage: isUpdating,
    languageCode,
  }
}
