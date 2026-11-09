import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useAuth } from '@clerk/expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'

import { useHealthConsent } from '@/hooks/useGetConsents'
import type { GetConsentByTypeResponse } from '@/services/userOperations'
import { upsertConsent, withdrawConsent } from '@/services/userOperations'
import { hashText } from '@/utils/hashTest'
import { components, onboarding } from '@/utils/i18n/keyConstants'
import { getLocaleSafe } from '@/utils/locale'
import { buildHealthDataConsentRecord } from '../model'

export function useHealthDataConsentSetting() {
  const { data, isError, isLoading } = useHealthConsent()
  const { getToken, userId } = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation(components)
  const { t: onboardingT } = useTranslation(onboarding)
  const healthConsentKey = ['healthConsent', userId] as const

  const toggleConsent = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!enabled) {
        await withdrawConsent('health_data', getToken)
        return
      }

      const healthText = onboardingT('congratulations.healthRaw')
      const textHash = await hashText(healthText)
      const consent = buildHealthDataConsentRecord({
        consentedAt: new Date().toISOString(),
        locale: getLocaleSafe(),
        textHash,
      })

      await upsertConsent([consent], getToken)
    },
    onMutate: async (enabled) => {
      await queryClient.cancelQueries({ queryKey: healthConsentKey })

      const previousConsent = queryClient.getQueryData<GetConsentByTypeResponse>(healthConsentKey)
      queryClient.setQueryData<GetConsentByTypeResponse>(healthConsentKey, {
        hasConsent: enabled,
      })

      return { previousConsent }
    },
    onError: async (_error, _enabled, context) => {
      if (context?.previousConsent === undefined) {
        queryClient.removeQueries({ queryKey: healthConsentKey, exact: true })
      } else {
        queryClient.setQueryData(healthConsentKey, context.previousConsent)
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      Alert.alert(t('settings.alerts.updateFailed.title'), t('settings.alerts.updateFailed.body'))
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: healthConsentKey })
    },
  })

  const requestToggle = useCallback(
    (enabled: boolean) => {
      void Haptics.selectionAsync()

      const state = enabled ? 'on' : 'off'
      Alert.alert(
        t(`settings.alerts.toggle.${state}.title`),
        t(`settings.alerts.toggle.${state}.body`),
        [
          { text: t(`settings.alerts.toggle.${state}.cancel`), style: 'cancel' },
          {
            text: t(`settings.alerts.toggle.${state}.confirm`),
            style: enabled ? 'default' : 'destructive',
            onPress: () => toggleConsent.mutate(enabled),
          },
        ],
        { cancelable: true },
      )
    },
    [t, toggleConsent],
  )

  return {
    enabled: data?.hasConsent ?? false,
    isAvailable: !isError && !isLoading,
    isUpdating: toggleConsent.isPending,
    requestToggle,
  }
}
