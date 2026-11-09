export const queryKeys = {
  routine: {
    all: ['routine'] as const,
    byDate: (date: string) => ['routine', date] as const,
  },
  routineCalendar: {
    all: ['routineCalendar'] as const,
    range: (from: string, to: string, anchorDate: string) =>
      ['routineCalendar', { from, to, anchorDate }] as const,
  },
  productChecks: {
    all: ['productChecks'] as const,
  },
  productCheck: {
    all: ['productCheck'] as const,
    byId: (id: string) => ['productCheck', id] as const,
    detail: (id: string, includeRoutineConfig = false) =>
      ['productCheck', id, { includeRoutineConfig }] as const,
  },
}
