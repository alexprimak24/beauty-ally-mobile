import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { languageOptions } from '@/constants/onboarding/onboardingData'
import { useHasSelectedLanguage } from '@/hooks/useHasSelectedLanguage'
import { useOnboarding } from '@/hooks/useOnboarding'
import { LANGUAGE_KEY } from '@/utils/i18n/languageDetector'
import AnimatedBackButton from './AnimatedBackBtn'
import { LanguagePickerButton } from './LanguagePickerButton'
import ProgressBar from './ProgressBar'

function OnboardingHeader({ langPickerVisible = false }: { langPickerVisible?: boolean }) {
  const router = useRouter()
  const { setOnboardingData } = useOnboarding()
  const { i18n } = useTranslation()
  const [injectedLngTag, setInjectedLngTag] = useState<string | null>(null)
  const { code } = useHasSelectedLanguage({
    injectedLngTag: injectedLngTag ?? undefined,
  })

  function switchLanguage(lng: string) {
    i18n.changeLanguage(lng) // this will also trigger `cacheUserLanguage`

    const language = languageOptions.find((lngObj) => lngObj.longCode === lng)?.english ?? 'English'

    setOnboardingData({ language })
  }

  useEffect(() => {
    if (langPickerVisible) {
      ;(async () => {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY)
        if (saved) return setInjectedLngTag(saved)
        const sys = Localization.getLocales()[0]?.languageTag ?? 'en-US'
        setInjectedLngTag(sys)
      })()
    }
  }, [langPickerVisible])

  return (
    <View className="z-10 mb-4 w-full flex-row items-center">
      <AnimatedBackButton onPress={() => router.back()} />
      <View className="flex-1 flex-row items-center gap-2">
        <ProgressBar />
        {langPickerVisible && (
          <LanguagePickerButton
            initial={code}
            onChange={(longCode) => switchLanguage(longCode)}
            top={6}
            right={10}
            showCode
            floating={false}
          />
        )}
      </View>
    </View>
  )
}

export default OnboardingHeader
