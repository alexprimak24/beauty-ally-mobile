import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="onboarding"
        options={{ animation: 'none', gestureDirection: 'horizontal', gestureEnabled: true }}
      />
      <Stack.Screen
        name="payment"
        options={{ gestureDirection: 'horizontal', gestureEnabled: true }}
      />
    </Stack>
  )
}
