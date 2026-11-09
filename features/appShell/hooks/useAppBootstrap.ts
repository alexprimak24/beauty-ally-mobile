import {
  addSkincareShelfReminderResponseListener,
  clearLastSkincareShelfReminderResponse,
  getLastSkincareShelfReminderResponse,
  SKINCARE_SHELF_NOTIFICATION_ROUTE,
} from '@/utils/notifications/skincareShelfReminders'
import { useFonts } from 'expo-font'
import { router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'

const appFonts = {
  'InstrumentSans-Regular': require('@/assets/fonts/InstrumentSans/InstrumentSans-Regular.ttf'),
  'InstrumentSans-Italic': require('@/assets/fonts/InstrumentSans/InstrumentSans-Italic.ttf'),
  'InstrumentSans-Medium': require('@/assets/fonts/InstrumentSans/InstrumentSans-Medium.ttf'),
  'InstrumentSans-SemiBold': require('@/assets/fonts/InstrumentSans/InstrumentSans-SemiBold.ttf'),
  'InstrumentSans-Bold': require('@/assets/fonts/InstrumentSans/InstrumentSans-Bold.ttf'),
  'Quicksand-Regular': require('@/assets/fonts/Quicksand/Quicksand-Regular.ttf'),
  'Quicksand-Medium': require('@/assets/fonts/Quicksand/Quicksand-Medium.ttf'),
  'Quicksand-SemiBold': require('@/assets/fonts/Quicksand/Quicksand-SemiBold.ttf'),
  'Quicksand-Bold': require('@/assets/fonts/Quicksand/Quicksand-Bold.ttf'),
}

export function useAppBootstrap() {
  const [startupSplashVisible, setStartupSplashVisible] = useState(true)
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false)
  const [fontsLoaded, fontError] = useFonts(appFonts)

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    const openSkincareShelf = () => {
      setTimeout(() => router.push(SKINCARE_SHELF_NOTIFICATION_ROUTE), 0)
    }
    const lastResponse = getLastSkincareShelfReminderResponse()
    if (lastResponse) {
      clearLastSkincareShelfReminderResponse()
      openSkincareShelf()
    }

    const subscription = addSkincareShelfReminderResponseListener(openSkincareShelf)
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (!fontsLoaded || nativeSplashHidden) return

    const hideNativeSplash = async () => {
      await SplashScreen.hideAsync()
      setNativeSplashHidden(true)
    }
    void hideNativeSplash()
  }, [fontsLoaded, nativeSplashHidden])

  return {
    dismissStartupSplash: useCallback(() => setStartupSplashVisible(false), []),
    fontsLoaded,
    nativeSplashHidden,
    startupSplashVisible,
  }
}
