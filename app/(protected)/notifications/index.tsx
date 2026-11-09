import { FlatList, RefreshControl, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { GlassBackButton } from '@/components/ui/GlassBackButton'
import LoadingSpinner from '@/components/ui/LoadingIndicator'
import { useRTokens } from '@/design/useRTokens'
import { NotificationCard } from '@/features/notifications/components/NotificationCard'
import { NotificationsEmptyState } from '@/features/notifications/components/NotificationsEmptyState'
import { useNotificationsScreen } from '@/features/notifications/hooks/useNotificationsScreen'

export default function NotificationsScreen() {
  const { type } = useRTokens()
  const {
    isLoading,
    markingNotificationId,
    notifications,
    onRefresh,
    openNotification,
    refreshing,
  } = useNotificationsScreen()

  return (
    <SafeAreaView className="bg-base flex-1 px-4 pt-4">
      <GlassBackButton zIndex={10} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            item={item}
            onPress={() => openNotification(item)}
            disabled={markingNotificationId === item.id}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={<View style={{ marginBottom: type.paddingBottom }} />}
        ListEmptyComponent={
          isLoading ? (
            <View className="mt-20 items-center">
              <LoadingSpinner />
            </View>
          ) : (
            <NotificationsEmptyState />
          )
        }
        contentContainerStyle={{
          paddingBottom: 28,
          flexGrow: notifications.length > 0 ? 0 : 1,
        }}
      />
    </SafeAreaView>
  )
}
