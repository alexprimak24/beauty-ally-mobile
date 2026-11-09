import type { ShelfEntryItem } from '../types'
import { useFavoritesMutation } from '@/hooks/useFavoritesMutation'
import { useOpenLink } from '@/hooks/useOpenLink'
import {
  useDeleteRoutineEntry,
  useRemoveProductFromSkincareMutation,
  useToggleRoutineEntryDone,
} from '@/features/routine'
import { main } from '@/utils/i18n/keyConstants'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { skincareShelfText } from '../constants'

type ShowInfo = (message: string, type?: 'info' | 'success') => void

interface UseRoutineEntryActionsOptions {
  anchorDate: string
  eveningEntries: ShelfEntryItem[]
  morningEntries: ShelfEntryItem[]
  selectedDate: string
  showInfo: ShowInfo
}

export function useRoutineEntryActions({
  anchorDate,
  eveningEntries,
  morningEntries,
  selectedDate,
  showInfo,
}: UseRoutineEntryActionsOptions) {
  const router = useRouter()
  const { openLink } = useOpenLink()
  const { t } = useTranslation(main)
  const [selectedEntry, setSelectedEntry] = useState<ShelfEntryItem | null>(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const { deleteRoutineEntryAsync, isDeletingRoutineEntry } = useDeleteRoutineEntry()
  const { removeProductFromSkincareAsync, isRemovingProductFromSkincare } =
    useRemoveProductFromSkincareMutation()
  const { toggleRoutineEntryDoneAsync, isTogglingRoutineEntryDone } = useToggleRoutineEntryDone()
  const { mutate: mutateFavorite } = useFavoritesMutation()

  const openMenu = useCallback((entry: ShelfEntryItem) => {
    setSelectedEntry(entry)
    setIsMenuVisible(true)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuVisible(false)
    setSelectedEntry(null)
  }, [])

  const toggleApplied = useCallback(
    async (entry: ShelfEntryItem) => {
      if (selectedDate < anchorDate) {
        showInfo(t(skincareShelfText.toasts.dayPassed))
        return
      }

      if (selectedDate > anchorDate) {
        showInfo(t(skincareShelfText.toasts.dayNotArrived))
        return
      }

      showInfo(
        entry.appliedToday
          ? t(skincareShelfText.toasts.markedNotApplied)
          : t(skincareShelfText.toasts.markedApplied),
        'success',
      )

      try {
        await toggleRoutineEntryDoneAsync({
          routineEntryID: entry.routineEntryID,
          date: selectedDate,
        })
      } catch (error) {
        console.error('Failed to toggle routine entry', error)
        showInfo(t(skincareShelfText.toasts.toggleFailed))
      }
    },
    [anchorDate, selectedDate, showInfo, t, toggleRoutineEntryDoneAsync],
  )

  const deleteSingleEntry = useCallback(
    async (entry: ShelfEntryItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      try {
        await deleteRoutineEntryAsync({
          id: entry.routineEntryID,
          date: selectedDate,
          productCheckID: entry.productCheckID,
        })
        showInfo(t(skincareShelfText.toasts.removedFromRoutine))
      } catch (error) {
        console.error('Failed to delete routine entry', error)
      }
    },
    [deleteRoutineEntryAsync, selectedDate, showInfo, t],
  )

  const deleteProductEverywhere = useCallback(
    async (entry: ShelfEntryItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      try {
        await removeProductFromSkincareAsync({
          id: entry.productCheckID,
          source: 'skincare_shelf',
        })
        showInfo(t(skincareShelfText.toasts.removedFromRoutine))
      } catch (error) {
        console.error('Failed to delete product routine entries', error)
      }
    },
    [removeProductFromSkincareAsync, showInfo, t],
  )

  const requestDelete = useCallback(
    (entry: ShelfEntryItem) => {
      const siblingEntry = [...morningEntries, ...eveningEntries].find(
        (item) =>
          item.productCheckID === entry.productCheckID &&
          item.routineEntryID !== entry.routineEntryID,
      )
      const routineLabel =
        entry.routineType === 'morning'
          ? t(skincareShelfText.menu.morningRoutine)
          : t(skincareShelfText.menu.eveningRoutine)

      if (siblingEntry) {
        Alert.alert(
          t(skincareShelfText.alerts.removeRoutineEntryMultiTitle),
          t(skincareShelfText.alerts.removeRoutineEntryMultiDescription),
          [
            { text: t(skincareShelfText.alerts.cancel), style: 'cancel' },
            {
              text: t(skincareShelfText.alerts.removeThisEntry, { routine: routineLabel }),
              style: 'destructive',
              onPress: () => void deleteSingleEntry(entry),
            },
            {
              text: t(skincareShelfText.alerts.removeEverywhere),
              style: 'destructive',
              onPress: () => void deleteProductEverywhere(entry),
            },
          ],
        )
        return
      }

      Alert.alert(
        t(skincareShelfText.alerts.removeRoutineEntryTitle),
        t(skincareShelfText.alerts.removeRoutineEntryDescription),
        [
          { text: t(skincareShelfText.alerts.cancel), style: 'cancel' },
          {
            text: t(skincareShelfText.alerts.confirm),
            style: 'destructive',
            onPress: () => void deleteSingleEntry(entry),
          },
        ],
      )
    },
    [deleteProductEverywhere, deleteSingleEntry, eveningEntries, morningEntries, t],
  )

  const toggleFavorite = useCallback(
    (entry: ShelfEntryItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      mutateFavorite({
        action: entry.isFavorites ? 'removed' : 'added',
        id: entry.productCheckID,
        source: 'skincare_shelf',
      })
      showInfo(t(skincareShelfText.toasts.favoritesUpdated), 'success')
    },
    [mutateFavorite, showInfo, t],
  )

  const edit = useCallback(
    (entry: ShelfEntryItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      router.push({
        pathname: '/(protected)/(modals)/edit/scan-details',
        params: { scanId: entry.productCheckID, fromShelf: 'true' },
      })
    },
    [router],
  )

  const purchase = useCallback(
    (entry: ShelfEntryItem) => {
      if (entry.purchaseLink) {
        openLink(entry.purchaseLink)
        return
      }

      router.push({
        pathname: '/(protected)/(modals)/edit/scan-details',
        params: { scanId: entry.productCheckID, isUrl: 'true', fromShelf: 'true' },
      })
    },
    [openLink, router],
  )

  const viewSelectedProduct = useCallback(() => {
    if (!selectedEntry) return

    const { frontImage: frontUriPreview, productCheckID: scanId } = selectedEntry
    closeMenu()
    router.push({ pathname: '/result/[scanId]', params: { scanId, frontUriPreview } })
  }, [closeMenu, router, selectedEntry])

  const reorderSelectedEntry = useCallback(() => {
    if (!selectedEntry) return

    const section = selectedEntry.routineType
    closeMenu()
    router.push({
      pathname: '/(protected)/skincareShelf/reorder',
      params: { date: selectedDate, section },
    })
  }, [closeMenu, router, selectedDate, selectedEntry])

  const editSelectedEntry = useCallback(() => {
    if (!selectedEntry) return

    const entry = selectedEntry
    closeMenu()
    edit(entry)
  }, [closeMenu, edit, selectedEntry])

  const deleteSelectedEntry = useCallback(() => {
    if (!selectedEntry) return

    const entry = selectedEntry
    closeMenu()
    requestDelete(entry)
  }, [closeMenu, requestDelete, selectedEntry])

  return {
    closeMenu,
    deleteSelectedEntry,
    edit,
    editSelectedEntry,
    isApplyDisabled: isTogglingRoutineEntryDone,
    isDeleteDisabled: isDeletingRoutineEntry || isRemovingProductFromSkincare,
    isMenuVisible,
    openMenu,
    purchase,
    reorderSelectedEntry,
    requestDelete,
    selectedEntry,
    toggleApplied,
    toggleFavorite,
    viewSelectedProduct,
  }
}
