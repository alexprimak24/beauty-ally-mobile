import 'react-native-gesture-handler'
import '../utils/i18n'
import './global.css'

import AppStartupSplash from '@/components/ui/AppStartupSplash'
import { AppProviders } from '@/features/appShell/components/AppProviders'
import { AppToast } from '@/features/appShell/components/AppToast'
import { LayoutErrorBoundary } from '@/features/appShell/components/LayoutErrorBoundary'
import { RootNavigator } from '@/features/appShell/components/RootNavigator'
import { useAppBootstrap } from '@/features/appShell/hooks/useAppBootstrap'
import * as Sentry from '@sentry/react-native'
import * as SplashScreen from 'expo-splash-screen'
import * as WebBrowser from 'expo-web-browser'
import { View } from 'react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
})

void SplashScreen.preventAutoHideAsync()
WebBrowser.maybeCompleteAuthSession()

export const ErrorBoundary = LayoutErrorBoundary

function RootLayout() {
  const bootstrap = useAppBootstrap()

  if (!bootstrap.fontsLoaded) return null

  return (
    <AppProviders>
      <View style={{ flex: 1 }}>
        <RootNavigator />
        {bootstrap.startupSplashVisible && bootstrap.nativeSplashHidden ? (
          <AppStartupSplash
            appReady={bootstrap.fontsLoaded}
            onFinish={bootstrap.dismissStartupSplash}
          />
        ) : null}
      </View>
      <AppToast />
    </AppProviders>
  )
}

export default Sentry.wrap(RootLayout)
