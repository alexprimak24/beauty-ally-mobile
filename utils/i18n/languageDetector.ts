import type { LanguageDetectorAsyncModule } from 'i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import { Platform } from 'react-native'

export const LANGUAGE_KEY = 'language'

const canUseAsyncStorage = Platform.OS !== 'web' || typeof window !== 'undefined'

export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: (callback: (lng: string) => void) => {
    async function detectLanguage() {
      try {
        // 1. Check if user saved a language
        const saved = canUseAsyncStorage ? await AsyncStorage.getItem(LANGUAGE_KEY) : null
        if (saved) {
          return callback(saved)
        }

        // 2. Otherwise, get system locale
        const locales = Localization.getLocales()
        const systemLang = locales.length > 0 ? locales[0].languageTag : 'en-US'
        return callback(systemLang)
      } catch {
        return callback('en-US') // 3. Hard fallback
      }
    }

    detectLanguage()
  },
  cacheUserLanguage: async (lng: string) => {
    if (!canUseAsyncStorage) return

    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lng)
    } catch (error) {
      if (__DEV__) console.warn('Error saving language', error)
    }
  },
}

// const switchLanguage = (lng: string) => {
//   i18n.changeLanguage(lng) // this will also trigger `cacheUserLanguage`
// }
