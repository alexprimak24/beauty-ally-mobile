import EmptyEntryCard from '@/features/productCollection/components/EmptyEntryCard'
import { HistoryCollectionHeader } from '@/features/productCollection/components/HistoryCollectionHeader'
import { ProductCollectionList } from '@/features/productCollection/components/ProductCollectionList'
import { useHistoryCollection } from '@/features/productCollection/hooks/useHistoryCollection'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HistoryScreen() {
  const history = useHistoryCollection()

  return (
    <>
      <View className="absolute top-0 z-0 h-full w-full bg-lightBg" />
      <SafeAreaView className="flex-1">
        <ProductCollectionList
          analyticsSource="history"
          emptyState={<EmptyEntryCard isSearch={Boolean(history.search)} query={history.search} />}
          fetchNextPage={history.fetchNextPage}
          hasNextPage={history.hasNextPage}
          header={
            <HistoryCollectionHeader
              hasError={Boolean(history.error)}
              onFilterChange={history.onMatchSummaryChange}
              onSearchChange={history.onSearchChange}
            />
          }
          isFetchingNextPage={history.isFetchingNextPage}
          isLoading={history.isLoading}
          pages={history.data?.pages}
          refetch={history.refetch}
        />
      </SafeAreaView>
    </>
  )
}
