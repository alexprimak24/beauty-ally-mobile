import { images } from '@/constants/images'
import { useFavoritesMutation } from '@/hooks/useFavoritesMutation'
import { useProductCheckById } from '@/hooks/useProductCheckById'
import { useRemoveProductFromSkincareMutation } from '@/features/routine'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { components, main } from '@/utils/i18n/keyConstants'
import { mapVerdict, verdictFromApi } from '@/utils/mapVerdict'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'

import { resultVerdictConfig } from '../constants'
import {
  getBestTimeCardConfig,
  getBreakoutRiskCardConfig,
  getCompatibilityCardConfig,
  getFrequencyCardConfig,
} from '../model'

type ResultParams = {
  scanId: string
  frontUri?: string | string[]
  frontUriPreview?: string | string[]
  backUri?: string | string[]
  backUriPreview?: string | string[]
  haptics?: string | string[]
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function useScanResultController() {
  const params = useLocalSearchParams<ResultParams>()
  const scanId = firstParam(params.scanId) ?? ''
  const { t } = useTranslation(main)
  const { t: componentsT } = useTranslation(components)
  const favoriteMutation = useFavoritesMutation()
  const removeSkincareMutation = useRemoveProductFromSkincareMutation()
  const [productToConfigure, setProductToConfigure] = useState<ProductChecksEntry | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const hasPlayedResultHaptics = useRef(false)
  const { data: productCheck, isLoading, refetch } = useProductCheckById({ scanId })

  const localFrontUri = firstParam(params.frontUri)
  const localFrontPreviewUri = firstParam(params.frontUriPreview)
  const localBackUri = firstParam(params.backUri)
  const localBackPreviewUri = firstParam(params.backUriPreview)
  const shouldPlayHaptics = firstParam(params.haptics) === 'true'
  const notFoundImage = images.imageNotFoundGreen

  const frontSource = useMemo(() => {
    const uri = localFrontUri || productCheck?.frontImage || localFrontPreviewUri
    return uri ? { uri } : notFoundImage
  }, [localFrontPreviewUri, localFrontUri, notFoundImage, productCheck?.frontImage])
  const backSource = useMemo(() => {
    const uri = localBackUri || productCheck?.backImage || localBackPreviewUri
    return uri ? { uri } : notFoundImage
  }, [localBackPreviewUri, localBackUri, notFoundImage, productCheck?.backImage])
  const frontPreviewSource = useMemo(() => {
    const previewUri = localFrontPreviewUri || localFrontUri
    return previewUri ? { uri: previewUri } : undefined
  }, [localFrontPreviewUri, localFrontUri])
  const backPreviewSource = useMemo(() => {
    const previewUri = localBackPreviewUri || localBackUri
    return previewUri ? { uri: previewUri } : undefined
  }, [localBackPreviewUri, localBackUri])
  const hasBackImage = Boolean(localBackUri || productCheck?.backImage || localBackPreviewUri)

  const verdict = useMemo(() => {
    const apiVerdict = verdictFromApi(productCheck?.matchSummary)
    if (!apiVerdict) return null

    const { key, intKey } = mapVerdict({ verdict: apiVerdict })
    return {
      config: resultVerdictConfig[key],
      label: t(intKey),
    }
  }, [productCheck?.matchSummary, t])

  const cards = useMemo(
    () => ({
      bestTime: getBestTimeCardConfig(productCheck?.bestTime ?? ''),
      breakoutRisk: getBreakoutRiskCardConfig(productCheck?.breakoutRisk),
      frequency: getFrequencyCardConfig(
        productCheck?.frequency?.times ?? '',
        productCheck?.frequency?.period,
      ),
      routineCompatibility: getCompatibilityCardConfig(productCheck?.routineCompatibility),
    }),
    [productCheck],
  )

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  const toggleFavorite = useCallback(() => {
    favoriteMutation.mutate({
      action: productCheck?.isFavorites ? 'removed' : 'added',
      id: scanId,
      source: 'scan_result',
    })
  }, [favoriteMutation, productCheck?.isFavorites, scanId])

  const toggleSkincare = useCallback(() => {
    if (!productCheck) return

    if (!productCheck.inSkincare) {
      setProductToConfigure(productCheck)
      return
    }

    Alert.alert(
      componentsT('scanEntry.removeConfirm.title'),
      componentsT('scanEntry.removeConfirm.message'),
      [
        { text: componentsT('scanEntry.removeConfirm.cancel'), style: 'cancel' },
        {
          text: componentsT('scanEntry.removeConfirm.confirm'),
          style: 'destructive',
          onPress: () => {
            removeSkincareMutation.removeProductFromSkincare({
              id: scanId,
              source: 'scan_result',
            })
            Toast.show({
              type: 'info',
              position: 'top',
              text1: componentsT('scanEntry.toast.skincareRemoved'),
              topOffset: 70,
            })
          },
        },
      ],
    )
  }, [componentsT, productCheck, removeSkincareMutation, scanId])

  useEffect(() => {
    if (!shouldPlayHaptics || !productCheck || hasPlayedResultHaptics.current) return

    hasPlayedResultHaptics.current = true
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }, 180)

    return () => clearTimeout(timer)
  }, [productCheck, shouldPlayHaptics])

  return {
    backSource,
    backPreviewSource,
    cards,
    closeRoutineConfiguration: () => setProductToConfigure(null),
    favoritePending: favoriteMutation.isPending,
    frontSource,
    frontPreviewSource,
    hasBackImage,
    hasLocalImages: Boolean(localFrontUri || localBackUri),
    isLoading,
    productCheck,
    productToConfigure,
    refresh,
    refreshing,
    removeFromSkincarePending: removeSkincareMutation.isRemovingProductFromSkincare,
    retry: refetch,
    scanId,
    toggleFavorite,
    toggleSkincare,
    verdict,
  }
}
