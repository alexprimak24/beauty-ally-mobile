import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases'

export type RevenueCatPlan = 'monthly' | 'yearly'
type RevenueCatEntitlementsStatus = 'idle' | 'loading' | 'ready' | 'stale' | 'error'
type RevenueCatPaywallStatus = 'idle' | 'loading' | 'ready' | 'error'
type RevenueCatOperationStatus = 'idle' | 'loading' | 'error'

export interface RevenueCatIdentity {
  isReady: boolean
  rcAppUserId: string | null
  error: unknown | null
}

export interface RevenueCatEntitlements {
  status: RevenueCatEntitlementsStatus
  customerInfo: CustomerInfo | null
  isPro: boolean
  expiresAtMs: number | null
  plan: RevenueCatPlan | null
  productId: string | null
  lastSyncedAtMs: number | null
}

export type RevenueCatEntitlementData = Pick<
  RevenueCatEntitlements,
  'customerInfo' | 'isPro' | 'expiresAtMs' | 'plan' | 'productId'
>

export type RevenueCatEntitlementsCache = Omit<RevenueCatEntitlements, 'status' | 'customerInfo'>

export interface RevenueCatPaywall {
  status: RevenueCatPaywallStatus
  offerings: PurchasesOfferings | null
  currentOffering: PurchasesOffering | null
  packages: {
    monthly?: PurchasesPackage
    yearly?: PurchasesPackage
  }
}

export interface RevenueCatOperations {
  purchasing: RevenueCatOperationStatus
  restoring: RevenueCatOperationStatus
  refreshingEntitlements: RevenueCatOperationStatus
  refreshingOfferings: RevenueCatOperationStatus
}

interface RevenueCatActions {
  refreshEntitlements: () => Promise<void>
  refreshOfferings: () => Promise<void>
  purchaseMonthly: () => Promise<void>
  purchaseYearly: () => Promise<void>
  restore: () => Promise<void>
}

export interface RevenueCatContextValue {
  identity: RevenueCatIdentity
  entitlements: RevenueCatEntitlements
  paywall: RevenueCatPaywall
  ops: RevenueCatOperations
  actions: RevenueCatActions
}
