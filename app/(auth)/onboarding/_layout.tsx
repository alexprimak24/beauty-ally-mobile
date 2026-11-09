import { LayoutErrorBoundary } from '@/features/appShell/components/LayoutErrorBoundary'
import { LayoutGateState } from '@/features/appShell/components/LayoutGateState'
import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export const ErrorBoundary = LayoutErrorBoundary

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <LayoutGateState variant="loading" />
  if (isSignedIn) return <Redirect href="/(auth)/payment/preparing" />

  return <Stack screenOptions={{ headerShown: false }} />
}
