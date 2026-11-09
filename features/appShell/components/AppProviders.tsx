import PostHogSessionTracker from '@/components/PostHogSessionTracker'
import { ConsentProvider } from '@/context/consentContext'
import { OnboardingProvider } from '@/context/onboardingContext'
import { RevenueCatProvider } from '@/features/subscription/revenueCat'
import { queryClient } from '@/utils/tanstack/queryClient'
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { PostHogProvider } from 'posthog-react-native'
import type { PropsWithChildren } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { LayoutGateState } from './LayoutGateState'

export function AppProviders({ children }: PropsWithChildren) {
  const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  const posthogKey = process.env.EXPO_PUBLIC_POSTHOG_KEY

  if (!clerkKey) throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY')
  if (!posthogKey) throw new Error('Missing EXPO_PUBLIC_POSTHOG_KEY')

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
        <ClerkLoading>
          <LayoutGateState variant="loading" />
        </ClerkLoading>
        <ClerkLoaded>
          <RevenueCatProvider>
            <ThemeProvider value={DefaultTheme}>
              <OnboardingProvider>
                <ConsentProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <PostHogProvider
                      apiKey={posthogKey}
                      autocapture={false}
                      options={{ host: 'https://us.i.posthog.com' }}
                    >
                      <PostHogSessionTracker />
                      {children}
                    </PostHogProvider>
                  </GestureHandlerRootView>
                </ConsentProvider>
              </OnboardingProvider>
            </ThemeProvider>
          </RevenueCatProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </QueryClientProvider>
  )
}
