import { format, startOfToday } from 'date-fns'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useProductCheckById } from '@/hooks/useProductCheckById'
import {
  buildRoutineEntryPayloads,
  createRoutineSchedule,
  useCreateRoutineEntry,
  useDeleteRoutineEntry,
  useRemoveProductFromSkincareMutation,
  useRoutineSchedule,
} from '@/features/routine'
import {
  useUpdateFrontImage,
  useUpdateName,
  useUpdatePurchaseLink,
} from '@/hooks/useUpdateProductChecks'
import { isSafeHttpUrl } from '@/utils/isSafeHttpUrl'

export function useScanDetailsEditor() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    fromShelf?: string
    isUrl?: string
    scanId: string
  }>()
  const scanId = params.scanId
  const isFromShelf = params.fromShelf === 'true'
  const shouldHighlightUrl = params.isUrl === 'true'
  const initializedProductID = useRef<string | null>(null)

  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingRoutine, setIsSavingRoutine] = useState(false)
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false)
  const {
    isInvalid: isRoutineScheduleInvalid,
    resetSchedule,
    schedule,
    setFrequency: setRoutineFrequency,
    togglePeriod: toggleRoutinePeriod,
    toggleWeekday: toggleRoutineWeekday,
  } = useRoutineSchedule()

  const { data: productCheck } = useProductCheckById({
    scanId,
    includeRoutineConfig: true,
  })
  const { updateNameAsync, isUpdatingName } = useUpdateName()
  const { updateLinkAsync, isUpdatingLink } = useUpdatePurchaseLink()
  const { updateFrontImageAsync, isUpdatingFrontImage } = useUpdateFrontImage()
  const { createRoutineEntryAsync } = useCreateRoutineEntry()
  const { deleteRoutineEntryAsync } = useDeleteRoutineEntry()
  const { removeProductFromSkincareAsync } = useRemoveProductFromSkincareMutation()

  useEffect(() => {
    if (!productCheck || initializedProductID.current === productCheck.id) return

    initializedProductID.current = productCheck.id
    setName(productCheck.productName)
    setLink(productCheck.purchaseLink ?? '')
    resetSchedule(createRoutineSchedule(isFromShelf ? productCheck.routine_config : undefined))
  }, [isFromShelf, productCheck, resetSchedule])

  const pickImage = useCallback(async () => {
    if (isUploading) return
    setIsUploading(true)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [1, 1],
        quality: 0.9,
      })
      if (result.canceled) return

      await updateFrontImageAsync({ scanId, img_uri: result.assets[0].uri })
      router.back()
    } catch (error) {
      console.error('Photo selection/upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }, [isUploading, router, scanId, updateFrontImageAsync])

  const saveRoutineSchedule = useCallback(async () => {
    if (!isFromShelf || !productCheck) return

    const morningEntryID = productCheck.routine_config?.morning?.routine_entry_id
    const eveningEntryID = productCheck.routine_config?.evening?.routine_entry_id
    const hasExistingEntries = !!morningEntryID || !!eveningEntryID
    setIsSavingRoutine(true)

    try {
      if (!schedule.morning.isSelected && !schedule.evening.isSelected) {
        if (hasExistingEntries || productCheck.inSkincare) {
          await removeProductFromSkincareAsync({ id: scanId, source: 'skincare_shelf' })
        }
        return
      }

      for (const payload of buildRoutineEntryPayloads(scanId, schedule)) {
        await createRoutineEntryAsync(payload)
      }

      if (!schedule.morning.isSelected && morningEntryID) {
        await deleteRoutineEntryAsync({
          id: morningEntryID,
          date: format(startOfToday(), 'yyyy-MM-dd'),
          productCheckID: scanId,
        })
      }
      if (!schedule.evening.isSelected && eveningEntryID) {
        await deleteRoutineEntryAsync({
          id: eveningEntryID,
          date: format(startOfToday(), 'yyyy-MM-dd'),
          productCheckID: scanId,
        })
      }
    } finally {
      setIsSavingRoutine(false)
    }
  }, [
    createRoutineEntryAsync,
    deleteRoutineEntryAsync,
    isFromShelf,
    productCheck,
    removeProductFromSkincareAsync,
    scanId,
    schedule,
  ])

  const save = useCallback(async () => {
    if (!productCheck) return

    const updates: Promise<unknown>[] = []
    const trimmedLink = link.trim()

    if (trimmedLink && trimmedLink !== productCheck.purchaseLink) {
      if (!isSafeHttpUrl(trimmedLink)) return
      updates.push(updateLinkAsync({ scanId, purchaseLink: trimmedLink }))
    }
    if (name && name !== productCheck.productName) {
      updates.push(updateNameAsync({ scanId, productName: name }))
    }

    try {
      await Promise.all(updates)
      await saveRoutineSchedule()
      router.back()
    } catch (error) {
      console.error('Failed to update scan details', error)
    }
  }, [
    link,
    name,
    productCheck,
    router,
    saveRoutineSchedule,
    scanId,
    updateLinkAsync,
    updateNameAsync,
  ])

  const isSaving =
    isUpdatingName || isUpdatingLink || isUpdatingFrontImage || isSavingRoutine || isUploading

  return {
    closeInfoModal: () => setIsInfoModalVisible(false),
    isFromShelf,
    isInfoModalVisible,
    isSaveDisabled: !productCheck || isSaving || isRoutineScheduleInvalid,
    isSaving,
    isUploading,
    link,
    name,
    openInfoModal: () => setIsInfoModalVisible(true),
    pickImage,
    productCheck,
    save,
    schedule,
    setLink,
    setName,
    setRoutineFrequency,
    shouldHighlightUrl,
    toggleRoutinePeriod,
    toggleRoutineWeekday,
  }
}
