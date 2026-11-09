import { useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { scale } from '@/design/responsiveNew'
import { useGetRoutineForDate, useReorderRoutineEntries } from '@/features/routine'
import { main } from '@/utils/i18n/keyConstants'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { reorderRoutineText } from '../constants'
import {
  buildReorderRoutinePayload,
  getRoutineOrderSignature,
  hasRoutineOrderChanged,
  resolveInitialReorderSection,
  toReorderRoutineEntries,
} from '../model'
import type { ReorderRoutineEntry, RoutineType } from '../types'

export function useReorderRoutine() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { t } = useTranslation(main)
  const params = useLocalSearchParams<{ date?: string; section?: RoutineType }>()
  const selectedDate = params.date ?? new Date().toISOString().slice(0, 10)
  const initialSection: RoutineType = params.section === 'evening' ? 'evening' : 'morning'
  const { routine, isLoadingRoutine } = useGetRoutineForDate(selectedDate)
  const { reorderRoutineEntriesAsync, isReorderingRoutineEntries } = useReorderRoutineEntries()

  const [selectedSection, setSelectedSection] = useState<RoutineType>(initialSection)
  const [morningEntries, setMorningEntries] = useState<ReorderRoutineEntry[]>([])
  const [eveningEntries, setEveningEntries] = useState<ReorderRoutineEntry[]>([])
  const [initialMorningSignature, setInitialMorningSignature] = useState('')
  const [initialEveningSignature, setInitialEveningSignature] = useState('')
  const [listRevision, setListRevision] = useState(0)

  useEffect(() => {
    if (!routine) return

    const nextMorning = toReorderRoutineEntries(routine.morning, 'morning')
    const nextEvening = toReorderRoutineEntries(routine.evening, 'evening')

    setMorningEntries(nextMorning)
    setEveningEntries(nextEvening)
    setInitialMorningSignature(getRoutineOrderSignature(nextMorning))
    setInitialEveningSignature(getRoutineOrderSignature(nextEvening))
    setSelectedSection(resolveInitialReorderSection(initialSection, nextMorning, nextEvening))
  }, [initialSection, routine])

  const entries = selectedSection === 'morning' ? morningEntries : eveningEntries
  const setEntries = selectedSection === 'morning' ? setMorningEntries : setEveningEntries
  const hasChanges = useMemo(
    () =>
      hasRoutineOrderChanged(
        morningEntries,
        eveningEntries,
        initialMorningSignature,
        initialEveningSignature,
      ),
    [eveningEntries, initialEveningSignature, initialMorningSignature, morningEntries],
  )

  const switchSection = useCallback(
    (nextSection: RoutineType) => {
      if (nextSection === selectedSection) return
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      setSelectedSection(nextSection)
    },
    [selectedSection],
  )

  const goBack = useCallback(() => router.back(), [router])

  const reorderEntries = useCallback(
    (nextEntries: ReorderRoutineEntry[]) => {
      setEntries(nextEntries)

      // DraggableFlatList can retain stale Fabric cell measurements after a drop.
      // Remounting the list clears those transforms without discarding the new order.
      setListRevision((current) => current + 1)
    },
    [setEntries],
  )

  const save = useCallback(async () => {
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      await reorderRoutineEntriesAsync(buildReorderRoutinePayload(morningEntries, eveningEntries))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routine.byDate(selectedDate) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routine.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routineCalendar.all }),
      ])
      router.back()
    } catch (error) {
      console.error('Failed to reorder routine', error)
      Toast.show({
        type: 'info',
        position: 'top',
        text1: t(reorderRoutineText.errors.saveFailed),
        topOffset: scale(70),
      })
    }
  }, [
    eveningEntries,
    morningEntries,
    queryClient,
    reorderRoutineEntriesAsync,
    router,
    selectedDate,
    t,
  ])

  return {
    entries,
    hasChanges,
    isLoading: isLoadingRoutine,
    isSaving: isReorderingRoutineEntries,
    listRevision,
    onBack: goBack,
    reorderEntries,
    save,
    selectedSection,
    switchSection,
  }
}
