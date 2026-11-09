import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import ConfigureRoutineModal from '@/features/routine/components/ConfigureRoutineModal'
import {
  AddToRoutineHeader,
  AddToRoutineSearchHeader,
} from '@/features/skincareShelf/components/AddToRoutineHeader'
import { AddToRoutineList } from '@/features/skincareShelf/components/AddToRoutineList'
import { useAddToRoutineProducts } from '@/features/skincareShelf/hooks/useAddToRoutineProducts'

export default function AddToRoutineModal() {
  const router = useRouter()
  const products = useAddToRoutineProducts()

  return (
    <SafeAreaView className="flex-1 bg-lightBg" edges={['top']}>
      <AddToRoutineHeader onBack={() => router.back()} />
      <AddToRoutineList
        entries={products.entries}
        header={
          <AddToRoutineSearchHeader
            hasError={!!products.error}
            onQueryChange={products.onQueryChange}
          />
        }
        isFetchingNextPage={products.isFetchingNextPage}
        isLoading={products.isLoading}
        onContentSizeChange={products.onContentSizeChange}
        onEndReached={products.onEndReached}
        onRefresh={products.onRefresh}
        onSelectProduct={products.selectProduct}
        query={products.query}
        refreshing={products.refreshing}
      />

      <ConfigureRoutineModal
        analyticsSource="skincare_add_to_routine"
        product={products.selectedProduct}
        onClose={products.closeRoutineConfiguration}
      />
    </SafeAreaView>
  )
}
