import { Redirect, Stack } from 'expo-router'

import { useAuth } from '@clerk/expo'
import { LayoutErrorBoundary } from '@/features/appShell/components/LayoutErrorBoundary'
import { LayoutGateState } from '@/features/appShell/components/LayoutGateState'

export const ErrorBoundary = LayoutErrorBoundary

export default function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <LayoutGateState variant="loading" />
  if (!isSignedIn) return <Redirect href="/(auth)/onboarding/welcome" />

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(tabs)"
        options={{ gestureDirection: 'horizontal', gestureEnabled: true }}
      />
      <Stack.Screen
        name="scan/index"
        options={{ animation: 'slide_from_bottom', animationDuration: 350, gestureEnabled: true }}
      />
      <Stack.Screen
        name="result/[scanId]"
        options={{ animation: 'slide_from_bottom', animationDuration: 350, gestureEnabled: true }}
      />
      <Stack.Screen
        name="favorites/index"
        options={{ fullScreenGestureEnabled: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="skincareShelf"
        options={{ fullScreenGestureEnabled: false, gestureEnabled: true }}
      />
      <Stack.Screen
        name="notifications/index"
        options={{ gestureDirection: 'horizontal', gestureEnabled: true }}
      />
      <Stack.Screen
        name="(modals)"
        options={{ gestureDirection: 'horizontal', gestureEnabled: true, presentation: 'modal' }}
      />
    </Stack>
  )
}
