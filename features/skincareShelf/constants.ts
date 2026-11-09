export const skincareShelfText = {
  today: 'common:today',
  weekdays: {
    short: {
      mo: 'common:weekdays.short.mo',
      tu: 'common:weekdays.short.tu',
      we: 'common:weekdays.short.we',
      th: 'common:weekdays.short.th',
      fr: 'common:weekdays.short.fr',
      sa: 'common:weekdays.short.sa',
      su: 'common:weekdays.short.su',
    },
  },
  header: {
    morningRoutine: 'mySkincareShelf.header.morningRoutine',
    eveningRoutine: 'mySkincareShelf.header.eveningRoutine',
  },
  fastActions: {
    title: 'mySkincareShelf.fastActions.title',
    editOrder: 'mySkincareShelf.fastActions.editOrder',
    morning: 'mySkincareShelf.fastActions.morning',
    evening: 'mySkincareShelf.fastActions.evening',
    completeFullDay: 'mySkincareShelf.fastActions.completeFullDay',
  },
  frequency: {
    daily: 'mySkincareShelf.frequency.daily',
    specificDays: 'mySkincareShelf.frequency.specificDays',
  },
  alerts: {
    completeMorningTitle: 'mySkincareShelf.alerts.completeMorningTitle',
    completeEveningTitle: 'mySkincareShelf.alerts.completeEveningTitle',
    completeMorningDescription: 'mySkincareShelf.alerts.completeMorningDescription',
    completeEveningDescription: 'mySkincareShelf.alerts.completeEveningDescription',
    removeRoutineEntryTitle: 'mySkincareShelf.alerts.removeRoutineEntryTitle',
    removeRoutineEntryDescription: 'mySkincareShelf.alerts.removeRoutineEntryDescription',
    removeRoutineEntryMultiTitle: 'mySkincareShelf.alerts.removeRoutineEntryMultiTitle',
    removeRoutineEntryMultiDescription: 'mySkincareShelf.alerts.removeRoutineEntryMultiDescription',
    removeThisEntry: 'mySkincareShelf.alerts.removeThisEntry',
    removeEverywhere: 'mySkincareShelf.alerts.removeEverywhere',
    cancel: 'mySkincareShelf.alerts.cancel',
    confirm: 'mySkincareShelf.alerts.confirm',
  },
  toasts: {
    morningLogged: 'mySkincareShelf.toasts.morningLogged',
    eveningLogged: 'mySkincareShelf.toasts.eveningLogged',
    dayPassed: 'mySkincareShelf.toasts.dayPassed',
    dayNotArrived: 'mySkincareShelf.toasts.dayNotArrived',
    markedApplied: 'mySkincareShelf.toasts.markedApplied',
    markedNotApplied: 'mySkincareShelf.toasts.markedNotApplied',
    toggleFailed: 'mySkincareShelf.toasts.toggleFailed',
    removedFromRoutine: 'mySkincareShelf.toasts.removedFromRoutine',
    favoritesUpdated: 'mySkincareShelf.toasts.favoritesUpdated',
  },
  guides: {
    dateTitle: 'mySkincareShelf.guides.dateTitle',
    dateDescription: 'mySkincareShelf.guides.dateDescription',
    dateButton: 'mySkincareShelf.guides.dateButton',
    swipeTitle: 'mySkincareShelf.guides.swipeTitle',
    swipeDescription: 'mySkincareShelf.guides.swipeDescription',
    swipeButton: 'mySkincareShelf.guides.swipeButton',
  },
  menu: {
    morningRoutine: 'mySkincareShelf.menu.morningRoutine',
    eveningRoutine: 'mySkincareShelf.menu.eveningRoutine',
    viewProductDetails: 'mySkincareShelf.menu.viewProductDetails',
    editEntry: 'mySkincareShelf.menu.editEntry',
    reorderSequence: 'mySkincareShelf.menu.reorderSequence',
    removeFromRoutine: 'mySkincareShelf.menu.removeFromRoutine',
  },
  fullDay: {
    title: 'mySkincareShelf.fullDay.title',
    description: 'mySkincareShelf.fullDay.description',
  },
} as const

export const reorderRoutineText = {
  empty: 'reorderRoutine.empty.noEntries',
  errors: {
    saveFailed: 'reorderRoutine.errors.saveFailed',
  },
  headerTitle: 'reorderRoutine.headerTitle',
  sectionHeader: {
    evening: 'reorderRoutine.sectionHeader.eveningRoutine',
    morning: 'reorderRoutine.sectionHeader.morningRoutine',
  },
  segmented: {
    evening: 'reorderRoutine.segmented.evening',
    morning: 'reorderRoutine.segmented.morning',
  },
} as const

export const weekdayKeys = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'] as const

export const skincareShelfColors = {
  dark: '#212529',
  lightBg: '#f4f6f8',
  lightBlue: '#def2ff',
  lightPink: '#fdebf6',
  inactiveText: '#8E8E93',
  strongRed: '#F43F5E',
  lightGreen: '#d6f5d6',
} as const

export const routineHeaderThemes = {
  morning: {
    bg: '#E0F2FE',
    text: '#0369A1',
    icon: '#0369A1',
    circle1: 'rgba(254, 240, 138, 0.6)',
    circle2: 'rgba(255, 255, 255, 0.7)',
    circle3: 'rgba(255, 255, 255, 0.9)',
  },
  evening: {
    bg: '#EEF1FF',
    text: '#6F7FCF',
    icon: '#6F7FCF',
    circle1: 'rgba(184, 192, 234, 0.4)',
    circle2: 'rgba(255, 255, 255, 0.5)',
    circle3: 'rgba(220, 226, 255, 0.6)',
  },
} as const

export const fullDayTheme = {
  bg: '#F5EFE6',
  text: '#8B7E74',
  accent: '#4A4036',
} as const
