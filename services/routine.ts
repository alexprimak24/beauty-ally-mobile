import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'
import { mutationSuccessSchema } from './api/schemas'

const frequencyTypeSchema = z.enum(['daily', 'selected_weekdays'])
const routineItemStatusSchema = z.enum(['done', 'skipped', 'pending'])

const routineItemSchema = z.object({
  routine_entry_id: z.string(),
  product_check_id: z.string(),
  product_name: z.string(),
  is_favorites: z.boolean(),
  front_image: z.string().optional(),
  purchase_link: z.string().optional(),
  position: z.number().int().nonnegative(),
  frequency_type: frequencyTypeSchema,
  status: routineItemStatusSchema,
})

const routineSummarySchema = z.object({
  morning_completed: z.boolean(),
  evening_completed: z.boolean(),
  day_completed: z.boolean(),
})

const getRoutineForDateSchema = z.object({
  date: z.string(),
  streak: z.number().int().nonnegative(),
  max_streak: z.number().int().nonnegative(),
  summary: routineSummarySchema,
  morning: z.array(routineItemSchema),
  evening: z.array(routineItemSchema),
})

const routineCalendarDaySchema = z.object({
  date: z.string(),
  any_completed: z.boolean(),
  day_completed: z.boolean(),
  morning_completed: z.boolean(),
  evening_completed: z.boolean(),
})

const getRoutineCalendarSchema = z.object({
  current_streak: z.number().int().nonnegative(),
  max_streak: z.number().int().nonnegative(),
  days: z.array(routineCalendarDaySchema),
})

export type FrequencyType = z.infer<typeof frequencyTypeSchema>
export type RoutineType = 'morning' | 'evening'
export type RoutineItem = z.infer<typeof routineItemSchema>
export type RoutineSummary = z.infer<typeof routineSummarySchema>
export type GetRoutineForDateRes = z.infer<typeof getRoutineForDateSchema>
export type MutationSuccessRes = z.infer<typeof mutationSuccessSchema>
export type RoutineCalendarDay = z.infer<typeof routineCalendarDaySchema>
export type GetRoutineCalendarRes = z.infer<typeof getRoutineCalendarSchema>

export interface CreateRoutineEntryProps {
  productCheckID: string
  routineType: RoutineType
  frequencyType: FrequencyType
  weekdaysMask: number | null
}

export interface ToggleRoutineEntryDoneProps {
  routineEntryID: string
  date: string
}

export interface CompleteRoutineGroupProps {
  date: string
  routineType: RoutineType
}

export interface CompleteRoutineDayProps {
  date: string
}

export interface GetRoutineCalendarProps {
  from: string
  to: string
  anchorDate: string
}

interface ReorderRoutineItem {
  routineEntryID: string
  routineType: RoutineType
  position: number
}

export interface ReorderRoutineEntriesProps {
  items: ReorderRoutineItem[]
}

function mutationRequest(
  getToken: GetToken,
  path: string,
  options: { method: 'DELETE' | 'POST' | 'PUT'; json?: unknown; timeoutMs?: number },
): Promise<MutationSuccessRes> {
  return apiRequest(getToken, path, {
    ...options,
    schema: mutationSuccessSchema,
  })
}

export function getRoutineForDate(getToken: GetToken, date: string): Promise<GetRoutineForDateRes> {
  const params = new URLSearchParams({ date })
  return apiRequest(getToken, `/v1/routine?${params.toString()}`, {
    method: 'GET',
    schema: getRoutineForDateSchema,
    timeoutMs: 6000,
  })
}

export function createRoutineEntry(
  getToken: GetToken,
  entry: CreateRoutineEntryProps,
): Promise<MutationSuccessRes> {
  return mutationRequest(getToken, '/v1/routine/entries', {
    method: 'POST',
    json: {
      product_check_id: entry.productCheckID,
      routine_type: entry.routineType,
      frequency_type: entry.frequencyType,
      weekdays_mask: entry.weekdaysMask,
    },
    timeoutMs: 6000,
  })
}

export function deleteRoutineEntry(getToken: GetToken, id: string): Promise<MutationSuccessRes> {
  return mutationRequest(getToken, `/v1/routine/entries/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    timeoutMs: 6000,
  })
}

export function deleteRoutineEntriesByProductCheckID(
  getToken: GetToken,
  productCheckID: string,
): Promise<MutationSuccessRes> {
  return mutationRequest(
    getToken,
    `/v1/routine/product-checks/${encodeURIComponent(productCheckID)}/entries`,
    { method: 'DELETE', timeoutMs: 8000 },
  )
}

export function toggleRoutineEntryDone(
  getToken: GetToken,
  payload: ToggleRoutineEntryDoneProps,
): Promise<MutationSuccessRes> {
  return mutationRequest(
    getToken,
    `/v1/routine/entries/${encodeURIComponent(payload.routineEntryID)}/log`,
    { method: 'POST', json: { date: payload.date }, timeoutMs: 6000 },
  )
}

export function completeRoutineGroup(
  getToken: GetToken,
  payload: CompleteRoutineGroupProps,
): Promise<MutationSuccessRes> {
  return mutationRequest(getToken, '/v1/routine/complete-group', {
    method: 'POST',
    json: { date: payload.date, routine_type: payload.routineType },
    timeoutMs: 6000,
  })
}

export function completeRoutineDay(
  getToken: GetToken,
  payload: CompleteRoutineDayProps,
): Promise<MutationSuccessRes> {
  return mutationRequest(getToken, '/v1/routine/complete-day', {
    method: 'POST',
    json: { date: payload.date },
    timeoutMs: 6000,
  })
}

export function getRoutineCalendar(
  getToken: GetToken,
  params: GetRoutineCalendarProps,
): Promise<GetRoutineCalendarRes> {
  const searchParams = new URLSearchParams({
    from: params.from,
    to: params.to,
    anchorDate: params.anchorDate,
  })
  return apiRequest(getToken, `/v1/routine/calendar?${searchParams.toString()}`, {
    method: 'GET',
    schema: getRoutineCalendarSchema,
    timeoutMs: 8000,
  })
}

export function reorderRoutineEntries(
  getToken: GetToken,
  payload: ReorderRoutineEntriesProps,
): Promise<MutationSuccessRes> {
  return mutationRequest(getToken, '/v1/routine/reorder', {
    method: 'PUT',
    json: {
      items: payload.items.map((item) => ({
        routine_entry_id: item.routineEntryID,
        routine_type: item.routineType,
        position: item.position,
      })),
    },
    timeoutMs: 8000,
  })
}
