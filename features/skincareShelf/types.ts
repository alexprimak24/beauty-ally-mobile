export type RoutineType = 'morning' | 'evening'
export type RoutineCompletionType = RoutineType | 'all'

export interface ShelfEntryItem {
  id: string
  routineEntryID: string
  productCheckID: string
  productName: string
  frontImage: string
  isFavorites: boolean
  purchaseLink?: string
  isRunningLow?: boolean
  routineType: RoutineType
  frequencyDisplay: string
  appliedToday: boolean
  stepNumber: number
}

export interface ReorderRoutineEntry {
  id: string
  frontImage: string
  productCheckID: string
  productName: string
  routineEntryID: string
  routineType: RoutineType
}

export interface CalendarDayItem {
  id: string
  dayStr: string
  dateNum: string
  dayIndex: number
}

export interface CalendarWeekItem {
  id: string
  days: CalendarDayItem[]
}
