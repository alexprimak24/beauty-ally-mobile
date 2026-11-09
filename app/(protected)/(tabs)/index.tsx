import WelcomeUser from '@/components/ui/WelcomeUser'
import { useRTokens } from '@/design/useRTokens'
import BeautyShelf from '@/features/home/components/BeautyShelf'
import FactOfTheDay from '@/features/home/components/FactOfTheDay'
import HomeHeader from '@/features/home/components/HomeHeader'
import { HomeRecentScans } from '@/features/home/components/HomeRecentScans'
import { useHomeDashboard } from '@/features/home/hooks/useHomeDashboard'
import { RefreshControl, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { isError, isLoading, onRefresh, recentEntries, refreshing, welcomeText } =
    useHomeDashboard()
  const { type } = useRTokens()

  return (
    <SafeAreaView className="flex-1 px-4 py-4">
      <ScrollView
        contentContainerStyle={{ paddingBottom: type.paddingBottom, paddingTop: type.paddingTop }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <HomeHeader />
        <WelcomeUser startText={`  ${welcomeText}`} />
        <FactOfTheDay />
        <BeautyShelf />
        <HomeRecentScans entries={recentEntries} hasError={isError} isLoading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  )
}
