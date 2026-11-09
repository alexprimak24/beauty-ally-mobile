import { MainTabBar } from '@/components/navigation/MainTabBar'
import { ProfileGate } from '@/features/appShell/components/ProfileGate'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <ProfileGate>
      <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <MainTabBar {...props} />}>
        <Tabs.Screen name="index" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="profile" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="history" options={{ tabBarButton: () => null }} />
      </Tabs>
    </ProfileGate>
  )
}
