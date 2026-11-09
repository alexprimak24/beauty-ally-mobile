import AsyncStorage from '@react-native-async-storage/async-storage'
import { addDays, format, getDay, startOfToday, startOfWeek, subWeeks } from 'date-fns'
import * as Haptics from 'expo-haptics'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FlatList, FlatListProps, SectionList, ViewInstance } from 'react-native'
import Toast from 'react-native-toast-message'

import { scale } from '@/design/responsiveNew'
import { useAnalytics } from '@/hooks/useAnalytics'
import {
  useCompleteRoutineDay,
  useCompleteRoutineGroup,
  useGetRoutineCalendar,
  useGetRoutineForDate,
} from '@/features/routine'
import { useSkincareShelfReminderSync } from '@/hooks/useSkincareShelfReminderSync'
import { analyticsEvents } from '@/utils/analytics'
import { main } from '@/utils/i18n/keyConstants'
import { useDateFnsLocale } from '@/utils/i18n/useDateFnsLocale'

import { fullDayTheme, routineHeaderThemes, skincareShelfText } from '../constants'
import { buildCalendarWeeks, toShelfItems } from '../model'
import type { CalendarWeekItem, RoutineCompletionType, ShelfEntryItem } from '../types'
import type { RoutineSection } from '../components/RoutineList'
import { useRoutineEntryActions } from './useRoutineEntryActions'

const TOAST_TOP = scale(70)

function createCalendarRange() {
  const today = startOfToday()
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const startDate = subWeeks(currentWeekStart, 2)

  return {
    anchorDate: format(today, 'yyyy-MM-dd'),
    endDate: addDays(startDate, 34),
    initialDayIndex: (getDay(today) + 6) % 7,
    startDate,
    today,
  }
}

export function useSkincareShelfController() {
  const router = useRouter()
  const analytics = useAnalytics()
  const { t } = useTranslation(main)
  const locale = useDateFnsLocale()
  const [calendarRange] = useState(createCalendarRange)
  const [selectedDate, setSelectedDate] = useState(calendarRange.anchorDate)
  const [isFastActionsExpanded, setIsFastActionsExpanded] = useState(false)
  const [completionType, setCompletionType] = useState<RoutineCompletionType | null>(null)
  const [showDateGuide, setShowDateGuide] = useState(false)
  const [showSwipeGuide, setShowSwipeGuide] = useState(false)
  const [firstItemY, setFirstItemY] = useState(() => scale(350))
  const mainScrollRef = useRef<SectionList<ShelfEntryItem, RoutineSection>>(null)
  const calendarListRef = useRef<FlatList<CalendarWeekItem>>(null)
  const firstItemRef = useRef<ViewInstance>(null)
  const currentDayIndexRef = useRef(calendarRange.initialDayIndex)

  const showInfo = useCallback((message: string, type: 'info' | 'success' = 'info') => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      topOffset: TOAST_TOP,
      autoHide: true,
      visibilityTime: 4000,
    })
  }, [])

  const weeks = useMemo(
    () => buildCalendarWeeks(calendarRange.startDate, locale, t),
    [calendarRange.startDate, locale, t],
  )
  const from = useMemo(() => format(calendarRange.startDate, 'yyyy-MM-dd'), [calendarRange])
  const to = useMemo(() => format(calendarRange.endDate, 'yyyy-MM-dd'), [calendarRange])

  const { routine, isLoadingRoutine, refetchRoutine } = useGetRoutineForDate(selectedDate)
  const { routineCalendar, refetchRoutineCalendar } = useGetRoutineCalendar({
    from,
    to,
    anchorDate: calendarRange.anchorDate,
  })
  const { completeRoutineGroupAsync } = useCompleteRoutineGroup()
  const { completeRoutineDayAsync } = useCompleteRoutineDay()

  const morningEntries = useMemo(
    () => toShelfItems(routine?.morning ?? [], 'morning', t),
    [routine?.morning, t],
  )
  const eveningEntries = useMemo(
    () => toShelfItems(routine?.evening ?? [], 'evening', t),
    [routine?.evening, t],
  )
  const isTodaySelected = selectedDate === calendarRange.anchorDate

  const entryActions = useRoutineEntryActions({
    anchorDate: calendarRange.anchorDate,
    eveningEntries,
    morningEntries,
    selectedDate,
    showInfo,
  })

  useSkincareShelfReminderSync({
    date: selectedDate,
    enabled: isTodaySelected,
    isLoadingRoutine,
    routine,
  })

  useFocusEffect(
    useCallback(() => {
      analytics.capture(analyticsEvents.collectionOpened, { collection: 'skincare' })
    }, [analytics]),
  )

  useFocusEffect(
    useCallback(() => {
      let active = true
      const timer = setTimeout(() => {
        if (!active) return

        refetchRoutine()
        refetchRoutineCalendar()
      }, 250)

      return () => {
        active = false
        clearTimeout(timer)
      }
    }, [refetchRoutine, refetchRoutineCalendar]),
  )

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!isTodaySelected) {
        const hasSeenDateJump = await AsyncStorage.getItem('@guide_date_jump')
        if (hasSeenDateJump !== 'true') {
          setShowDateGuide(true)
          return
        }
      }

      const hasProducts = morningEntries.length > 0 || eveningEntries.length > 0
      if (!isTodaySelected || !hasProducts || isLoadingRoutine) return

      const hasSeenSwipe = await AsyncStorage.getItem('@guide_swipe_apply')
      if (hasSeenSwipe === 'true') return

      setTimeout(() => {
        firstItemRef.current?.measureInWindow((_x, y) => {
          if (y > 0) setFirstItemY(y)
        })
      }, 300)
      setShowSwipeGuide(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [
    eveningEntries.length,
    isLoadingRoutine,
    isTodaySelected,
    morningEntries.length,
    selectedDate,
  ])

  const dismissDateGuide = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    await AsyncStorage.setItem('@guide_date_jump', 'true')
    setShowDateGuide(false)
  }, [])

  const dismissSwipeGuide = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    await AsyncStorage.setItem('@guide_swipe_apply', 'true')
    setShowSwipeGuide(false)
  }, [])

  const selectDay = useCallback((date: string, dayIndex: number) => {
    setSelectedDate(date)
    currentDayIndexRef.current = dayIndex
  }, [])

  const jumpToToday = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedDate(calendarRange.anchorDate)
    currentDayIndexRef.current = calendarRange.initialDayIndex
    calendarListRef.current?.scrollToIndex({ index: 2, animated: true })
    mainScrollRef.current?.getScrollResponder()?.scrollTo({ y: 0, animated: true })

    if (showDateGuide) void dismissDateGuide()
  }, [calendarRange, dismissDateGuide, showDateGuide])

  const onViewableWeeksChanged = useRef<
    NonNullable<FlatListProps<CalendarWeekItem>['onViewableItemsChanged']>
  >(({ viewableItems }) => {
    const visibleWeek = viewableItems[0]?.item
    const nextDate = visibleWeek?.days[currentDayIndexRef.current]?.id
    if (nextDate) setSelectedDate((current) => (current === nextDate ? current : nextDate))
  }).current

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  const openCompletion = useCallback(
    (type: RoutineCompletionType) => {
      if (selectedDate !== calendarRange.anchorDate && type !== 'all') return
      setCompletionType(type)
    },
    [calendarRange.anchorDate, selectedDate],
  )

  const completeRoutine = useCallback(
    async (type: RoutineCompletionType) => {
      try {
        if (type === 'all') {
          await completeRoutineDayAsync({ date: selectedDate })
        } else {
          await completeRoutineGroupAsync({ date: selectedDate, routineType: type })
          showInfo(
            type === 'morning'
              ? t(skincareShelfText.toasts.morningLogged)
              : t(skincareShelfText.toasts.eveningLogged),
            'success',
          )
        }

        analytics.capture(analyticsEvents.routineCompleted, {
          scope: type === 'all' ? 'day' : type,
        })
        refetchRoutine()
        refetchRoutineCalendar()
      } catch (error) {
        console.error('Failed to complete routine', error)
      }
    },
    [
      analytics,
      completeRoutineDayAsync,
      completeRoutineGroupAsync,
      refetchRoutine,
      refetchRoutineCalendar,
      selectedDate,
      showInfo,
      t,
    ],
  )

  const completionTheme = useMemo(() => {
    if (completionType === 'morning') {
      return {
        title: t(skincareShelfText.alerts.completeMorningTitle),
        description: t(skincareShelfText.alerts.completeMorningDescription),
        color: routineHeaderThemes.morning.bg,
      }
    }

    if (completionType === 'evening') {
      return {
        title: t(skincareShelfText.alerts.completeEveningTitle),
        description: t(skincareShelfText.alerts.completeEveningDescription),
        color: routineHeaderThemes.evening.bg,
      }
    }

    return {
      title: t(skincareShelfText.fullDay.title),
      description: t(skincareShelfText.fullDay.description),
      color: fullDayTheme.bg,
    }
  }, [completionType, t])

  const dateLabel = useMemo(() => {
    if (selectedDate === calendarRange.anchorDate) return t(skincareShelfText.today)

    const [year, month, day] = selectedDate.split('-').map(Number)
    return format(new Date(year, month - 1, day), 'd MMMM', { locale })
  }, [calendarRange.anchorDate, locale, selectedDate, t])

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.push('/(protected)/(tabs)')
  }, [router])

  const addProduct = useCallback(() => {
    router.push('/(protected)/skincareShelf/addToRoutine')
  }, [router])

  const editOrder = useCallback(() => {
    router.push({
      pathname: '/(protected)/skincareShelf/reorder',
      params: { date: selectedDate },
    })
  }, [router, selectedDate])

  return {
    addProduct,
    calendarListRef,
    closeCompletion: () => setCompletionType(null),
    completeRoutine,
    completionTheme,
    completionType,
    dateLabel,
    dismissDateGuide,
    dismissSwipeGuide,
    editOrder,
    entryActions,
    eveningEntries,
    firstItemRef,
    firstItemY,
    goBack,
    isFastActionsExpanded,
    isLoadingRoutine,
    isTodaySelected,
    jumpToToday,
    mainScrollRef,
    morningEntries,
    onViewableWeeksChanged,
    openCompletion,
    routineCalendar,
    selectDay,
    selectedDate,
    setIsFastActionsExpanded,
    showDateGuide,
    showSwipeGuide,
    viewabilityConfig,
    weeks,
  }
}
