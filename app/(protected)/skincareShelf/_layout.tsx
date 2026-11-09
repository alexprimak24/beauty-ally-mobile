import { Stack } from 'expo-router'

export default function SkincareLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ fullScreenGestureEnabled: false }} />
      <Stack.Screen
        name="addToRoutine"
        options={{
          fullScreenGestureEnabled: false,
          gestureEnabled: true,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="reorder"
        options={{
          animation: 'slide_from_bottom',
          animationDuration: 350,
          fullScreenGestureEnabled: false,
          gestureEnabled: true,
        }}
      />
    </Stack>
  )
}
