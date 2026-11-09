import { useUser } from '@/hooks/useGetUser'
import {
  RAW_PRODUCT_CHECKS_KEYS,
  useInfiniteProductChecks,
} from '@/hooks/useInfiniteProductChecksBase'
import { useGetRoutineForDate } from '@/features/routine'
import {
  getTodayRoutineDateString,
  useSkincareShelfReminderSync,
} from '@/hooks/useSkincareShelfReminderSync'
import { mapProfileGenderToKey } from '@/utils/getCompliment'
import { getWelcomeStart } from '@/utils/getWelcomeStart'
import { main } from '@/utils/i18n/keyConstants'
import { useQueryClient } from '@tanstack/react-query'
import { useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getRecentProductEntries } from '../model'

const recentProductQuery = {
  matchSummary: '',
  search: '',
}

export function useHomeDashboard() {
  const { data, isError, isLoading, refetch } = useInfiniteProductChecks(recentProductQuery)
  const { data: userData } = useUser()
  const queryClient = useQueryClient()
  const { t } = useTranslation(main)
  const [refreshing, setRefreshing] = useState(false)

  const todayRoutineDate = getTodayRoutineDateString()
  const { routine: todayRoutine, isLoadingRoutine: isLoadingTodayRoutine } =
    useGetRoutineForDate(todayRoutineDate)

  useSkincareShelfReminderSync({
    date: todayRoutineDate,
    isLoadingRoutine: isLoadingTodayRoutine,
    routine: todayRoutine,
  })

  useFocusEffect(
    useCallback(() => {
      void queryClient.invalidateQueries({
        queryKey: [RAW_PRODUCT_CHECKS_KEYS.all],
        refetchType: 'active',
      })
    }, [queryClient]),
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  const recentEntries = useMemo(() => getRecentProductEntries(data?.pages), [data?.pages])
  const profileGender = userData?.profile?.gender ?? null
  const welcomeText = getWelcomeStart(t, mapProfileGenderToKey(profileGender))

  return {
    isError,
    isLoading,
    onRefresh,
    recentEntries,
    refreshing,
    welcomeText,
  }
}
