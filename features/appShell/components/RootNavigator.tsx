import { Stack } from 'expo-router'

export function RootNavigator() {
  return (
    <Stack
      screenOptions={{
        animation: 'none',
        contentStyle: { backgroundColor: '#FFF' },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected)" />
    </Stack>
  )
}
