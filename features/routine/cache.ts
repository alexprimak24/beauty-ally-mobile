import { RAW_PRODUCT_CHECKS_KEYS } from '@/hooks/useInfiniteProductChecksBase'
import type { ProductChecksResponse } from '@/services/productChecks'
import type {
  GetRoutineCalendarRes,
  GetRoutineForDateRes,
  RoutineCalendarDay,
} from '@/services/routine'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query'

import { calendarDayFromRoutine, recomputeRoutineSummary } from './model'

export interface RoutineMutationContext {
  previousRoutine?: GetRoutineForDateRes
}

interface QueryBackup {
  data: unknown
  key: QueryKey
}

export interface CreateRoutineEntryMutationContext {
  productCheckBackups: QueryBackup[]
}

export interface RemoveProductFromSkincareMutationContext {
  backups: QueryBackup[]
}

function isRawProductChecksRoot(
  root: unknown,
): root is (typeof RAW_PRODUCT_CHECKS_KEYS)[keyof typeof RAW_PRODUCT_CHECKS_KEYS] {
  const roots = Object.values(RAW_PRODUCT_CHECKS_KEYS) as string[]
  return typeof root === 'string' && roots.includes(root)
}

function productCheckCacheKeys(queryClient: QueryClient, productCheckID: string) {
  return queryClient
    .getQueryCache()
    .findAll()
    .map((query) => query.queryKey)
    .filter(
      (key) =>
        Array.isArray(key) &&
        (isRawProductChecksRoot(key[0]) ||
          (key[0] === queryKeys.productCheck.all[0] && key[1] === productCheckID)),
    )
}

export function updateRoutineCalendarCaches(
  queryClient: QueryClient,
  date: string,
  updater: (day: RoutineCalendarDay) => RoutineCalendarDay,
) {
  queryClient.setQueriesData<GetRoutineCalendarRes>(
    { queryKey: queryKeys.routineCalendar.all },
    (old) =>
      old
        ? {
            ...old,
            days: old.days.map((day) => (day.date === date ? updater(day) : day)),
          }
        : old,
  )
}

export async function optimisticallyMarkProductInSkincare(
  queryClient: QueryClient,
  productCheckID: string,
): Promise<CreateRoutineEntryMutationContext> {
  await Promise.all(
    Object.values(RAW_PRODUCT_CHECKS_KEYS).map((root) =>
      queryClient.cancelQueries({ queryKey: [root] }),
    ),
  )
  await queryClient.cancelQueries({ queryKey: queryKeys.productCheck.byId(productCheckID) })

  const productCheckBackups: QueryBackup[] = []

  for (const key of productCheckCacheKeys(queryClient, productCheckID)) {
    const previous = queryClient.getQueryData(key)
    if (!previous) continue

    productCheckBackups.push({ key, data: previous })

    if (key[0] === RAW_PRODUCT_CHECKS_KEYS.excludingSkincare) {
      queryClient.setQueryData<InfiniteData<ProductChecksResponse>>(key, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                entries: page.entries.filter((entry) => entry.id !== productCheckID),
              })),
            }
          : old,
      )
      continue
    }

    if (isRawProductChecksRoot(key[0])) {
      queryClient.setQueryData<InfiniteData<ProductChecksResponse>>(key, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                entries: page.entries.map((entry) =>
                  entry.id === productCheckID ? { ...entry, inSkincare: true } : entry,
                ),
              })),
            }
          : old,
      )
      continue
    }

    queryClient.setQueryData(key, (old: ProductChecksEntry | undefined) =>
      old ? { ...old, inSkincare: true } : old,
    )
  }

  return { productCheckBackups }
}

function addBackup(backups: QueryBackup[], seenKeys: Set<string>, key: QueryKey, data: unknown) {
  const cacheKey = JSON.stringify(key)
  if (seenKeys.has(cacheKey)) return

  seenKeys.add(cacheKey)
  backups.push({ key, data })
}

export async function optimisticallyRemoveProductFromSkincare(
  queryClient: QueryClient,
  productCheckID: string,
): Promise<RemoveProductFromSkincareMutationContext> {
  await Promise.all([
    ...Object.values(RAW_PRODUCT_CHECKS_KEYS).map((root) =>
      queryClient.cancelQueries({ queryKey: [root] }),
    ),
    queryClient.cancelQueries({ queryKey: queryKeys.productCheck.byId(productCheckID) }),
    queryClient.cancelQueries({ queryKey: queryKeys.routine.all }),
  ])

  const backups: QueryBackup[] = []
  const seenKeys = new Set<string>()

  for (const key of productCheckCacheKeys(queryClient, productCheckID)) {
    const previous = queryClient.getQueryData(key)
    if (!previous) continue

    addBackup(backups, seenKeys, key, previous)

    if (key[0] === RAW_PRODUCT_CHECKS_KEYS.skincare) {
      queryClient.setQueryData<InfiniteData<ProductChecksResponse>>(key, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                entries: page.entries.filter((entry) => entry.id !== productCheckID),
              })),
            }
          : old,
      )
      continue
    }

    if (isRawProductChecksRoot(key[0])) {
      queryClient.setQueryData<InfiniteData<ProductChecksResponse>>(key, (old) =>
        old
          ? {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                entries: page.entries.map((entry) =>
                  entry.id === productCheckID
                    ? { ...entry, inSkincare: false, routine_config: null }
                    : entry,
                ),
              })),
            }
          : old,
      )
      continue
    }

    queryClient.setQueryData(key, (old: ProductChecksEntry | undefined) =>
      old ? { ...old, inSkincare: false, routine_config: null } : old,
    )
  }

  for (const query of queryClient.getQueryCache().findAll({ queryKey: queryKeys.routine.all })) {
    const key = query.queryKey
    const previous = queryClient.getQueryData<GetRoutineForDateRes>(key)
    const date = Array.isArray(key) && typeof key[1] === 'string' ? key[1] : null
    if (!previous || !date) continue

    addBackup(backups, seenKeys, key, previous)
    const nextRoutine = recomputeRoutineSummary({
      ...previous,
      morning: previous.morning
        .filter((item) => item.product_check_id !== productCheckID)
        .map((item, index) => ({ ...item, position: index })),
      evening: previous.evening
        .filter((item) => item.product_check_id !== productCheckID)
        .map((item, index) => ({ ...item, position: index })),
    })

    queryClient.setQueryData<GetRoutineForDateRes>(key, nextRoutine)

    for (const calendarQuery of queryClient
      .getQueryCache()
      .findAll({ queryKey: queryKeys.routineCalendar.all })) {
      const calendarKey = calendarQuery.queryKey
      const previousCalendar = queryClient.getQueryData(calendarKey)
      if (previousCalendar) addBackup(backups, seenKeys, calendarKey, previousCalendar)
    }

    updateRoutineCalendarCaches(queryClient, date, (day) =>
      calendarDayFromRoutine(day, nextRoutine),
    )
  }

  return { backups }
}

export function restoreQueryBackups(queryClient: QueryClient, backups: QueryBackup[] = []) {
  backups.forEach(({ key, data }) => queryClient.setQueryData(key, data))
}
