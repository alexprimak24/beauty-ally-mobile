import type { PostHog } from 'posthog-react-native'

export const analyticsEvents = {
  appOpened: 'app_opened',
  onboardingStarted: 'onboarding_started',
  onboardingStepCompleted: 'onboarding_step_completed',
  onboardingCompleted: 'onboarding_completed',
  consentAccepted: 'consent_accepted',
  signupCompleted: 'signup_completed',
  loginCompleted: 'login_completed',
  paywallViewed: 'paywall_viewed',
  paywallPlanSelected: 'paywall_plan_selected',
  paywallClosed: 'paywall_closed',
  freeActivated: 'free_activated',
  subscriptionCompleted: 'subscription_completed',
  subscriptionRestoreCompleted: 'subscription_restore_completed',
  scanStarted: 'scan_started',
  scanFailed: 'scan_failed',
  scanCompleted: 'scan_completed',
  collectionOpened: 'collection_opened',
  productCollectionChanged: 'product_collection_changed',
  routineCompleted: 'routine_completed',
  notificationOpened: 'notification_opened',
} as const

type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents]
export type AnalyticsScreenName =
  | 'create_account'
  | 'edit_profile'
  | 'favorites'
  | 'history'
  | 'home'
  | 'notifications'
  | 'onboarding_active_treatment'
  | 'onboarding_allergies'
  | 'onboarding_climate'
  | 'onboarding_consent'
  | 'onboarding_gender'
  | 'onboarding_skin_concerns'
  | 'onboarding_skin_type'
  | 'onboarding_summary'
  | 'onboarding_sunscreen'
  | 'onboarding_welcome'
  | 'other'
  | 'payment_redirect'
  | 'payment_success'
  | 'paywall'
  | 'profile'
  | 'scan'
  | 'scan_result'
  | 'skincare_add_to_routine'
  | 'skincare_reorder'
  | 'skincare_shelf'
export type OnboardingStepName =
  | 'gender'
  | 'climate'
  | 'skin_type'
  | 'allergies'
  | 'skin_concerns'
  | 'active_treatment'
  | 'sunscreen_usage'
type ScanSource = 'camera' | 'gallery' | 'unknown'
type ScanMode = 'two_step' | 'both' | 'fast' | 'unknown'
type ProductCollection = 'favorites' | 'skincare'
export type ProductEngagementSource =
  'favorites' | 'history' | 'home' | 'scan_result' | 'skincare_add_to_routine' | 'skincare_shelf'
type RoutinePeriod = 'morning' | 'evening'

const SCREENS_BY_LAST_SEGMENT: Partial<Record<string, AnalyticsScreenName>> = {
  '(tabs)': 'home',
  'active-treatments': 'onboarding_active_treatment',
  favorites: 'favorites',
  history: 'history',
  index: 'home',
  notifications: 'notifications',
  profile: 'profile',
  preparing: 'payment_redirect',
  scan: 'scan',
  gender: 'onboarding_gender',
  climate: 'onboarding_climate',
  'skin-type': 'onboarding_skin_type',
  allergies: 'onboarding_allergies',
  'skin-concerns': 'onboarding_skin_concerns',
  sunscreen: 'onboarding_sunscreen',
  matching: 'onboarding_summary',
  consent: 'onboarding_consent',
  'create-account': 'create_account',
  paywall: 'paywall',
  success: 'payment_success',
  welcome: 'onboarding_welcome',
}

interface AnalyticsEventProperties {
  app_opened: undefined
  onboarding_started: undefined
  onboarding_step_completed: {
    step: number
    step_name: OnboardingStepName
  }
  onboarding_completed: undefined
  consent_accepted: {
    consent_types: ('health_data' | 'terms_privacy')[]
  }
  signup_completed: undefined
  login_completed: undefined
  paywall_viewed: {
    audience: 'prospect' | 'subscriber' | 'unknown'
    entry_point: 'onboarding' | 'signed_in' | 'subscription_management'
  }
  paywall_plan_selected: {
    plan: 'monthly' | 'yearly'
  }
  paywall_closed: {
    reason: 'back_manage' | 'close_back' | 'close_signedin'
  }
  free_activated: {
    source: 'paywall' | 'signup'
  }
  subscription_completed: {
    operation: 'purchase' | 'switch'
    plan: 'monthly' | 'yearly'
  }
  subscription_restore_completed: undefined
  scan_started: {
    mode: Exclude<ScanMode, 'unknown'>
    source: Exclude<ScanSource, 'unknown'>
  }
  scan_failed: {
    mode: ScanMode
    reason: 'polling_error' | 'processing_error' | 'scan_failed'
    source: ScanSource
  }
  scan_completed: {
    mode: ScanMode
    source: ScanSource
  }
  collection_opened: {
    collection: ProductCollection
  }
  product_collection_changed:
    | {
        action: 'added' | 'removed'
        collection: 'favorites'
        source: ProductEngagementSource
      }
    | {
        action: 'added' | 'removed'
        collection: 'skincare'
        routine_periods?: RoutinePeriod[]
        source: ProductEngagementSource
      }
  routine_completed: {
    scope: RoutinePeriod | 'day'
  }
  notification_opened: {
    destination: 'internal' | 'external' | 'none'
    notification_type: 'info' | 'update' | 'warning'
    was_unread: boolean
  }
}

type CaptureArgs<Event extends AnalyticsEventName> =
  AnalyticsEventProperties[Event] extends undefined
    ? [event: Event]
    : [event: Event, properties: AnalyticsEventProperties[Event]]

export interface AnalyticsClient {
  capture: <Event extends AnalyticsEventName>(...args: CaptureArgs<Event>) => void
  identify: (userId: string) => void
  reset: () => void
  screen: (name: AnalyticsScreenName) => void
}

type AnalyticsTransport = Pick<PostHog, 'capture' | 'identify' | 'reset' | 'screen'>

/**
 * The only boundary allowed to call the analytics SDK directly.
 * Event properties must remain non-sensitive: never send profile answers,
 * photos, ingredients, names, email addresses, or raw backend errors.
 */
export function createAnalyticsClient(transport: AnalyticsTransport): AnalyticsClient {
  const capture: AnalyticsClient['capture'] = (...args) => {
    const [event, properties] = args as [AnalyticsEventName, Parameters<PostHog['capture']>[1]?]
    transport.capture(event, properties)
  }

  return {
    capture,
    identify: (userId) => transport.identify(userId),
    reset: () => transport.reset(),
    screen: (name) => void transport.screen(name),
  }
}

export function analyticsScreenFromSegments(
  segments: readonly string[],
): AnalyticsScreenName | null {
  if (segments.length === 0) return null

  const route = segments.join('/')
  const last = segments[segments.length - 1]

  if (route.includes('/result/')) return 'scan_result'
  if (route.includes('/edit/')) return 'edit_profile'
  if (route.includes('/skincareShelf/addToRoutine')) return 'skincare_add_to_routine'
  if (route.includes('/skincareShelf/reorder')) return 'skincare_reorder'
  if (route.includes('/skincareShelf')) return 'skincare_shelf'

  return last ? (SCREENS_BY_LAST_SEGMENT[last] ?? 'other') : 'other'
}
