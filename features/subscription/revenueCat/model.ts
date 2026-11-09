import type { CustomerInfo, PurchasesOffering } from 'react-native-purchases'

import type {
  RevenueCatEntitlementData,
  RevenueCatEntitlements,
  RevenueCatEntitlementsCache,
  RevenueCatOperations,
  RevenueCatPaywall,
  RevenueCatPlan,
} from './types'

const ENTITLEMENT_KEY = 'pro'

const PRODUCT_ID_TO_PLAN = {
  'com.sycrafted.beautyally.premium.monthly': 'monthly',
  'beautyally_pro:monthly-v2': 'monthly',
  'com.sycrafted.beautyally.premium.yearly': 'yearly',
  'beautyally_pro:yearly-v2': 'yearly',
} as const satisfies Record<string, RevenueCatPlan>

export const initialRevenueCatEntitlements: RevenueCatEntitlements = {
  status: 'idle',
  customerInfo: null,
  isPro: false,
  expiresAtMs: null,
  plan: null,
  productId: null,
  lastSyncedAtMs: null,
}

export const initialRevenueCatPaywall: RevenueCatPaywall = {
  status: 'idle',
  offerings: null,
  currentOffering: null,
  packages: {},
}

export const initialRevenueCatOperations: RevenueCatOperations = {
  purchasing: 'idle',
  restoring: 'idle',
  refreshingEntitlements: 'idle',
  refreshingOfferings: 'idle',
}

function isKnownProductId(productId: string): productId is keyof typeof PRODUCT_ID_TO_PLAN {
  return Object.prototype.hasOwnProperty.call(PRODUCT_ID_TO_PLAN, productId)
}

export function getRevenueCatPlan(productId?: string | null): RevenueCatPlan | null {
  return productId && isKnownProductId(productId) ? PRODUCT_ID_TO_PLAN[productId] : null
}

export function deriveRevenueCatEntitlements(info: CustomerInfo | null): RevenueCatEntitlementData {
  const entitlement = info?.entitlements.active[ENTITLEMENT_KEY] ?? null
  const activeSubscription =
    info?.activeSubscriptions.find((id) => getRevenueCatPlan(id) !== null) ?? null
  const productId = activeSubscription ?? entitlement?.productIdentifier ?? null

  return {
    customerInfo: info,
    isPro: Boolean(entitlement),
    expiresAtMs: entitlement?.expirationDateMillis ?? null,
    plan: getRevenueCatPlan(productId),
    productId,
  }
}

export function pickRevenueCatPackages(
  offering: PurchasesOffering | null,
): RevenueCatPaywall['packages'] {
  if (!offering?.availablePackages.length) return {}

  return {
    monthly: offering.availablePackages.find(
      (item) => getRevenueCatPlan(item.product.identifier) === 'monthly',
    ),
    yearly: offering.availablePackages.find(
      (item) => getRevenueCatPlan(item.product.identifier) === 'yearly',
    ),
  }
}

export function createRevenueCatCacheSnapshot(
  entitlements: RevenueCatEntitlementData,
  lastSyncedAtMs: number,
): RevenueCatEntitlementsCache {
  return {
    isPro: entitlements.isPro,
    expiresAtMs: entitlements.expiresAtMs,
    plan: entitlements.plan,
    productId: entitlements.productId,
    lastSyncedAtMs,
  }
}
