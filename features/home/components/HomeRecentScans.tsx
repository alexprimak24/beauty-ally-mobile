import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import { useRouter } from 'expo-router'

import EmptyRecentUploads from './EmptyRecentUploads'
import ErrorCard from '@/components/ui/ErrorCard'
import LoadingSpinner from '@/components/ui/LoadingIndicator'
import PressEffectWrapper from '@/components/ui/PressEffectWrapper'
import { icons } from '@/constants/icons'
import { useRTokens } from '@/design/useRTokens'
import { useDeleteMutation } from '@/hooks/useDeleteMutation'
import { useFavoritesMutation } from '@/hooks/useFavoritesMutation'
import { useRemoveProductFromSkincareMutation } from '@/features/routine'
import ConfigureRoutineModal from '@/features/routine/components/ConfigureRoutineModal'
import ProductCheckCard from '@/features/productCollection/components/ProductCheckCard'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { components, main } from '@/utils/i18n/keyConstants'

interface HomeRecentScansProps {
  entries: ProductChecksEntry[]
  hasError: boolean
  isLoading: boolean
}

export function HomeRecentScans({ entries, hasError, isLoading }: HomeRecentScansProps) {
  const router = useRouter()
  const { sizes, type } = useRTokens()
  const { t } = useTranslation(main)
  const { t: componentsT } = useTranslation(components)
  const [productToConfigure, setProductToConfigure] = useState<ProductChecksEntry | null>(null)
  const deleteMutation = useDeleteMutation()
  const favoriteMutation = useFavoritesMutation()
  const removeSkincareMutation = useRemoveProductFromSkincareMutation()

  return (
    <>
      <Text
        className="mb-4 ml-4 mt-5 font-quicksandSemiBold text-dark"
        style={{ fontSize: type.xl }}
      >
        {componentsT('home.recentlyScanned', { defaultValue: 'Recently scanned:' })}
      </Text>

      {isLoading && (
        <View className="self-center">
          <LoadingSpinner />
        </View>
      )}

      {hasError && <ErrorCard message={t('home.errorLoading')} />}

      {entries.length === 0 && !isLoading && !hasError && (
        <EmptyRecentUploads onPressScan={() => router.push('/scan?side=front')} />
      )}

      {!hasError &&
        entries.map((item) => (
          <ProductCheckCard
            key={item.id}
            onToggleFavorites={() =>
              favoriteMutation.mutate({
                action: item.isFavorites ? 'removed' : 'added',
                id: item.id,
                source: 'home',
              })
            }
            onToggleFavoritesDisabled={favoriteMutation.isPending}
            onToggleSkincare={() =>
              removeSkincareMutation.removeProductFromSkincare({ id: item.id, source: 'home' })
            }
            onToggleSkincareDisabled={removeSkincareMutation.isRemovingProductFromSkincare}
            onDelete={() => deleteMutation.mutate({ id: item.id })}
            onDeleteDisabled={deleteMutation.isPending}
            entry={item}
            variant="secondary"
            onConfigureRoutine={setProductToConfigure}
          />
        ))}

      {entries.length > 0 && !hasError && (
        <View className="mb-5 items-center justify-center px-6 py-3">
          <PressEffectWrapper
            fillAll={false}
            onPress={() => router.push('/history')}
            containerClassName="bg-dark px-6 py-3 flex-row rounded-full w-min"
            className="flex-row items-center justify-center"
          >
            <Image
              source={icons.history}
              style={{ width: sizes.historyImg, height: sizes.historyImg }}
            />
            <Text className="ml-2 font-quicksandSemiBold text-white" style={{ fontSize: type.sm }}>
              {t('home.viewAll')}
            </Text>
          </PressEffectWrapper>
        </View>
      )}

      <ConfigureRoutineModal
        analyticsSource="home"
        product={productToConfigure}
        onClose={() => setProductToConfigure(null)}
      />
    </>
  )
}
