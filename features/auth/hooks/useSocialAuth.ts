import { useCallback, useEffect, useState } from 'react'
import { isClerkAPIResponseError, useSSO } from '@clerk/expo'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { useOnboarding } from '@/hooks/useOnboarding'
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation'
import { components } from '@/utils/i18n/keyConstants'

export type SocialAuthProvider = 'apple' | 'google'
export type SocialAuthMode = 'sign-in' | 'sign-up'

const strategies = {
  apple: 'oauth_apple',
  google: 'oauth_google',
} as const

const redirectUrl = AuthSession.makeRedirectUri({
  scheme: 'beautyai',
  path: '(auth)/onboarding',
})

function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => void WebBrowser.coolDownAsync()
  }, [])
}

export function useSocialAuth(mode: SocialAuthMode) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { onboardingData } = useOnboarding()
  const { startSSOFlow } = useSSO()
  const { t } = useTranslation(components)
  const { validate } = useOnboardingValidation()
  useWarmUpBrowser()

  const authenticate = useCallback(
    async (provider: SocialAuthProvider) => {
      if (isAuthenticating) return

      if (mode === 'sign-up') {
        const result = validate(onboardingData)
        if (!result.isValid) {
          Alert.alert(t('auth.alerts.incompleteOnboarding.title'), result.message)
          return
        }
      }

      setIsAuthenticating(true)
      try {
        const { authSessionResult, createdSessionId, setActive } = await startSSOFlow({
          strategy: strategies[provider],
          redirectUrl,
        })

        if (createdSessionId) {
          await setActive?.({ session: createdSessionId })
          return
        }

        if (authSessionResult?.type === 'cancel' || authSessionResult?.type === 'dismiss') return

        Alert.alert(t('auth.alerts.authIncomplete.title'), t('auth.alerts.authIncomplete.message'))
      } catch (error: unknown) {
        if (isClerkAPIResponseError(error)) {
          const clerkError = error.errors[0]
          Alert.alert(
            t('auth.alerts.authFailed.title'),
            clerkError?.message || t('auth.alerts.authFailed.fallback'),
          )
          if (__DEV__) console.warn('[Clerk OAuth Error]', clerkError?.code)
        } else {
          Alert.alert(t('auth.alerts.unknown.title'), t('auth.alerts.unknown.message'))
          console.error('Unexpected OAuth error:', error)
        }
      } finally {
        setIsAuthenticating(false)
      }
    },
    [isAuthenticating, mode, onboardingData, startSSOFlow, t, validate],
  )

  return { authenticate, isAuthenticating }
}
