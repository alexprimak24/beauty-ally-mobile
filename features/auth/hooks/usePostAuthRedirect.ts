import { useCallback, useEffect, useRef } from 'react'
import { useAuth, useUser } from '@clerk/expo'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { useAnalytics } from '@/hooks/useAnalytics'
import { useConsent } from '@/hooks/useConsent'
import { useRawUserProfile } from '@/hooks/useGetUser'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useSignUpUser } from '@/hooks/useSignUpUser'
import { freeInit } from '@/services/entitlements'
import { getConsentsStatus, upsertConsents } from '@/services/userOperations'
import { analyticsEvents } from '@/utils/analytics'
import { onboarding } from '@/utils/i18n/keyConstants'
import {
  hasOnboardingProfileData,
  hasRequiredOnboardingConsents,
  resolvePostAuthAction,
} from '../model'

const HOME_ROUTE = '/(protected)/(tabs)' as const
const WELCOME_ROUTE = '/(auth)/onboarding/welcome' as const

export function usePostAuthRedirect() {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn, signOut, userId } = useAuth()
  const { isLoaded: isUserLoaded, user } = useUser()
  const { consentData, clearConsentData } = useConsent()
  const { onboardingData, clearOnboardingData } = useOnboarding()
  const { getRawUser } = useRawUserProfile()
  const { signUpUser } = useSignUpUser()
  const { t } = useTranslation(onboarding)
  const analytics = useAnalytics()
  const queryClient = useQueryClient()
  const router = useRouter()
  const hasStarted = useRef(false)

  const returnToWelcome = useCallback(
    async (showSignInMessage = false) => {
      try {
        await signOut()
      } catch (error) {
        if (__DEV__) console.warn('Failed to sign out during auth recovery:', error)
      }

      router.replace(
        showSignInMessage
          ? { pathname: WELCOME_ROUTE, params: { isSignInMsg: 'true' } }
          : WELCOME_ROUTE,
      )
    },
    [router, signOut],
  )

  const syncLocalConsents = useCallback(async () => {
    try {
      const status = await getConsentsStatus(getToken)
      if (!status.has_required_consents) await upsertConsents(consentData, getToken)
      clearConsentData()
      return true
    } catch (error) {
      if (__DEV__) console.warn('Failed to synchronize onboarding consents:', error)
      Toast.show({
        type: 'info',
        position: 'top',
        text1: t('paymentRedirect.consentErr'),
      })
      return false
    }
  }, [clearConsentData, consentData, getToken, t])

  const runRedirect = useCallback(async () => {
    if (!isSignedIn || !userId) {
      router.replace(WELCOME_ROUTE)
      return
    }

    try {
      const hasLocalConsent = hasRequiredOnboardingConsents(consentData)
      if (hasLocalConsent && !(await syncLocalConsents())) {
        await returnToWelcome()
        return
      }

      const { exists: userExists, profile } = await getRawUser()
      const hasOnboardingData = hasOnboardingProfileData(onboardingData)
      const action = resolvePostAuthAction({
        hasLocalConsent,
        hasOnboardingData,
        userExists,
      })

      if (action === 'missing-consent') {
        Toast.show({
          type: 'info',
          position: 'top',
          text1: t('paymentRedirect.needConsent'),
        })
        await returnToWelcome(true)
        return
      }

      if (action === 'invalid-onboarding') {
        await returnToWelcome()
        return
      }

      if (action === 'update-existing-profile') {
        try {
          await signUpUser({ ...profile, ...onboardingData })
          clearOnboardingData()
        } catch (error) {
          if (__DEV__) console.warn('Failed to update the existing profile:', error)
          Toast.show({
            type: 'error',
            position: 'top',
            text1: t('paymentRedirect.signupErr'),
          })
        }
      }

      if (action === 'open-existing-profile' || action === 'update-existing-profile') {
        clearConsentData()
        analytics.capture(analyticsEvents.loginCompleted)
        router.replace(HOME_ROUTE)
        return
      }

      const fallbackName = `GlowSeeker_${userId.slice(-6)}`
      await signUpUser({
        ...onboardingData,
        name: user?.firstName || user?.username || fallbackName,
      })
      clearOnboardingData()
      clearConsentData()
      analytics.capture(analyticsEvents.signupCompleted)

      try {
        const email = user?.primaryEmailAddress?.emailAddress ?? ''
        const { granted } = await freeInit(getToken, email)
        if (granted) {
          await queryClient.invalidateQueries({ queryKey: ['checkFree', userId] })
          analytics.capture(analyticsEvents.freeActivated, { source: 'signup' })
        }
      } catch (error) {
        if (__DEV__) console.warn('Failed to initialize free scans after signup:', error)
      }

      router.replace(HOME_ROUTE)
    } catch (error) {
      console.error('[PostAuthRedirect] Unexpected redirect error:', error)
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t('paymentRedirect.signupErr'),
      })
      await returnToWelcome()
    }
  }, [
    analytics,
    clearConsentData,
    clearOnboardingData,
    consentData,
    getRawUser,
    getToken,
    isSignedIn,
    onboardingData,
    queryClient,
    returnToWelcome,
    router,
    signUpUser,
    syncLocalConsents,
    t,
    user?.firstName,
    user?.primaryEmailAddress?.emailAddress,
    user?.username,
    userId,
  ])

  useEffect(() => {
    if (!isAuthLoaded || (isSignedIn && !isUserLoaded) || hasStarted.current) return

    hasStarted.current = true
    void runRedirect()
  }, [isAuthLoaded, isSignedIn, isUserLoaded, runRedirect])

  return { displayName: user?.firstName || user?.username || '' }
}
