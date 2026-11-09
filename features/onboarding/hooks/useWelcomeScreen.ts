import { useCallback, useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEvent } from 'expo'
import * as Localization from 'expo-localization'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useVideoPlayer } from 'expo-video'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { useHasSelectedLanguage } from '@/hooks/useHasSelectedLanguage'
import { useOnboarding } from '@/hooks/useOnboarding'
import { onboarding } from '@/utils/i18n/keyConstants'
import { LANGUAGE_KEY } from '@/utils/i18n/languageDetector'
import { englishFromLongCode } from '@/utils/i18n/map'

function getSystemLanguageTag() {
  return Localization.getLocales()[0]?.languageTag ?? 'en-US'
}

export function useWelcomeScreen() {
  const router = useRouter()
  const { isSignInMsg } = useLocalSearchParams<{ isSignInMsg?: string | string[] }>()
  const { i18n, t } = useTranslation(onboarding)
  const { setOnboardingData } = useOnboarding()
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [initialLanguageTag, setInitialLanguageTag] = useState<string>()
  const hasShownSignInMessage = useRef(false)
  const { code: languageCode } = useHasSelectedLanguage({
    injectedLngTag: initialLanguageTag,
  })

  const player = useVideoPlayer(require('@/assets/tutorial/intro.mp4'), (videoPlayer) => {
    videoPlayer.audioMixingMode = 'mixWithOthers'
    videoPlayer.loop = true
    videoPlayer.muted = true
    videoPlayer.showNowPlayingNotification = false
  })
  const { status } = useEvent(player, 'statusChange', { status: player.status })
  const isVideoReady = status === 'readyToPlay'

  useEffect(() => {
    let isActive = true

    void (async () => {
      let savedLanguageTag: string | null = null
      try {
        savedLanguageTag = await AsyncStorage.getItem(LANGUAGE_KEY)
      } catch (error) {
        if (__DEV__) console.warn('Failed to read the saved language:', error)
      }

      if (!isActive) return

      const languageTag = savedLanguageTag ?? getSystemLanguageTag()
      setInitialLanguageTag(languageTag)
      setOnboardingData({ language: englishFromLongCode(languageTag) })
    })()

    return () => {
      isActive = false
    }
  }, [setOnboardingData])

  useEffect(() => {
    const shouldShowMessage = Array.isArray(isSignInMsg)
      ? isSignInMsg.includes('true')
      : isSignInMsg === 'true'

    if (!shouldShowMessage || hasShownSignInMessage.current) return

    hasShownSignInMessage.current = true
    Toast.show({
      type: 'info',
      position: 'top',
      text1: t('welcome.noAccMsg'),
    })
  }, [isSignInMsg, t])

  useEffect(() => {
    if (!isVideoReady) return

    try {
      if (isSignInOpen) player.pause()
      else player.play()
    } catch (error) {
      if (__DEV__) console.warn('Failed to update the welcome video:', error)
    }
  }, [isSignInOpen, isVideoReady, player])

  useFocusEffect(
    useCallback(() => {
      if (isVideoReady && !isSignInOpen) {
        try {
          player.play()
        } catch (error) {
          if (__DEV__) console.warn('Failed to play the welcome video:', error)
        }
      }

      return () => {
        try {
          if (player.status !== 'idle') player.pause()
        } catch (error) {
          if (__DEV__) console.warn('Failed to pause the welcome video:', error)
        }
      }
    }, [isSignInOpen, isVideoReady, player]),
  )

  const changeLanguage = useCallback(
    (languageTag: string) => {
      void i18n.changeLanguage(languageTag)
      setOnboardingData({ language: englishFromLongCode(languageTag) })
    },
    [i18n, setOnboardingData],
  )

  return {
    changeLanguage,
    closeSignIn: () => setIsSignInOpen(false),
    isSignInOpen,
    languageCode,
    openSignIn: () => setIsSignInOpen(true),
    player,
    startOnboarding: () => router.push('/(auth)/onboarding/gender'),
  }
}
