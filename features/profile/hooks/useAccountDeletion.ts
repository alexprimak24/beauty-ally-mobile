import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, BackHandler } from 'react-native'
import { useAuth } from '@clerk/expo'
import * as Haptics from 'expo-haptics'

import { deleteUserProfile } from '@/services/userOperations'
import { components } from '@/utils/i18n/keyConstants'

interface UseAccountDeletionOptions {
  onAccountDelete: () => Promise<void> | void
}

export function useAccountDeletion({ onAccountDelete }: UseAccountDeletionOptions) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { getToken } = useAuth()
  const { t } = useTranslation(components)

  useEffect(() => {
    if (!isDeleting) return

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => subscription.remove()
  }, [isDeleting])

  const deleteAccount = useCallback(async () => {
    try {
      setIsDeleting(true)
      await deleteUserProfile(getToken)
      await onAccountDelete()
    } catch (error) {
      Alert.alert(t('settings.alerts.delete.errorTitle'), t('settings.alerts.delete.errorBody'))
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }, [getToken, onAccountDelete, t])

  const requestAccountDeletion = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    Alert.alert(
      t('settings.alerts.delete.title'),
      t('settings.alerts.delete.body'),
      [
        { text: t('settings.alerts.delete.cancel'), style: 'cancel' },
        {
          text: t('settings.alerts.delete.confirm'),
          style: 'destructive',
          onPress: () => void deleteAccount(),
        },
      ],
      { cancelable: true },
    )
  }, [deleteAccount, t])

  return { isDeleting, requestAccountDeletion }
}
