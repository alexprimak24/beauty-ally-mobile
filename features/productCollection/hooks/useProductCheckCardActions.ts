import type { RefObject } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import { Easing, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { scheduleOnRN } from 'react-native-worklets'
import { useRouter } from 'expo-router'

import { scale } from '@/design/responsiveNew'
import { useOpenLink } from '@/hooks/useOpenLink'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { components } from '@/utils/i18n/keyConstants'
import { triggerSuccessHaptic } from './useProductCheckCardGesture'

interface ProductCheckCardActionsOptions {
  entry: ProductChecksEntry
  isSwipingRef: RefObject<boolean>
  onConfigureRoutine?: (product: ProductChecksEntry) => void
  onDelete: () => void
  onDeleteDisabled: boolean
  onToggleFavorites: () => void
  onToggleFavoritesDisabled: boolean
  onToggleSkincare: () => void
  onToggleSkincareDisabled: boolean
  translateX: SharedValue<number>
}

const timingConfig = {
  duration: 350,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
}

export function useProductCheckCardActions({
  entry,
  isSwipingRef,
  onConfigureRoutine,
  onDelete,
  onDeleteDisabled,
  onToggleFavorites,
  onToggleFavoritesDisabled,
  onToggleSkincare,
  onToggleSkincareDisabled,
  translateX,
}: ProductCheckCardActionsOptions) {
  const router = useRouter()
  const { t } = useTranslation(components)
  const { openLink } = useOpenLink()

  const showToast = useCallback((type: 'info' | 'success', text1: string) => {
    Toast.show({ type, position: 'top', text1, topOffset: scale(70) })
  }, [])

  const toggleSkincare = useCallback(() => {
    if (onToggleSkincareDisabled) return

    if (entry.inSkincare) {
      Alert.alert(t('scanEntry.removeConfirm.title'), t('scanEntry.removeConfirm.message'), [
        { text: t('scanEntry.removeConfirm.cancel'), style: 'cancel' },
        {
          text: t('scanEntry.removeConfirm.confirm'),
          style: 'destructive',
          onPress: () => {
            onToggleSkincare()
            showToast('info', t('scanEntry.toast.skincareRemoved'))
          },
        },
      ])
      return
    }

    if (onConfigureRoutine) {
      onConfigureRoutine(entry)
      return
    }

    onToggleSkincare()
    showToast('success', t('scanEntry.toast.skincareAdded'))
  }, [entry, onConfigureRoutine, onToggleSkincare, onToggleSkincareDisabled, showToast, t])

  const toggleFavorite = useCallback(() => {
    if (onToggleFavoritesDisabled) return
    onToggleFavorites()
    showToast(
      entry.isFavorites ? 'info' : 'success',
      t(entry.isFavorites ? 'scanEntry.toast.favRemoved' : 'scanEntry.toast.favAdded'),
    )
  }, [entry.isFavorites, onToggleFavorites, onToggleFavoritesDisabled, showToast, t])

  const deleteEntry = useCallback(() => {
    if (onDeleteDisabled) return
    translateX.value = withTiming(0, timingConfig)
    scheduleOnRN(triggerSuccessHaptic)
    onDelete()
    showToast('success', t('scanEntry.toast.deleted'))
  }, [onDelete, onDeleteDisabled, showToast, t, translateX])

  const openDetails = useCallback(() => {
    if (isSwipingRef.current || translateX.value !== 0) return
    router.push({
      pathname: '/result/[scanId]',
      params: {
        scanId: entry.id,
        frontUriPreview: entry.frontImage,
        backUriPreview: entry.backImage,
      },
    })
  }, [entry.backImage, entry.frontImage, entry.id, isSwipingRef, router, translateX])

  const openEditor = useCallback(() => {
    translateX.value = withTiming(0, timingConfig)
    router.push({
      pathname: '/(protected)/(modals)/edit/scan-details',
      params: { scanId: entry.id },
    })
  }, [entry.id, router, translateX])

  const openPurchase = useCallback(() => {
    if (entry.purchaseLink) {
      void openLink(entry.purchaseLink)
      return
    }

    router.push({
      pathname: '/(protected)/(modals)/edit/scan-details',
      params: { scanId: entry.id, isUrl: 'true' },
    })
  }, [entry.id, entry.purchaseLink, openLink, router])

  return {
    deleteEntry,
    openDetails,
    openEditor,
    openPurchase,
    toggleFavorite,
    toggleSkincare,
  }
}
