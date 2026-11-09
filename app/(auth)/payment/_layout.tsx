import { Stack } from 'expo-router'

export default function PaymentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    />
  )
}
