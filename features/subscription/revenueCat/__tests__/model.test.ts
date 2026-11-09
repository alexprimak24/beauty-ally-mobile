/// <reference types="jest" />

import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases'

import {
  createRevenueCatCacheSnapshot,
  deriveRevenueCatEntitlements,
  getRevenueCatPlan,
  pickRevenueCatPackages,
} from '../model'

function customerInfo(overrides: Partial<CustomerInfo> = {}): CustomerInfo {
  return {
    activeSubscriptions: [],
    entitlements: { active: {}, all: {}, verification: 'NOT_REQUESTED' },
    ...overrides,
  } as unknown as CustomerInfo
}

function purchasePackage(identifier: string): PurchasesPackage {
  return { product: { identifier } } as PurchasesPackage
}

describe('RevenueCat model', () => {
  it('maps platform product identifiers to stable plans', () => {
    expect(getRevenueCatPlan('com.sycrafted.beautyally.premium.monthly')).toBe('monthly')
    expect(getRevenueCatPlan('beautyally_pro:yearly-v2')).toBe('yearly')
    expect(getRevenueCatPlan('unknown')).toBeNull()
    expect(getRevenueCatPlan(null)).toBeNull()
  })

  it('derives active entitlement data and prefers Android base-plan identifiers', () => {
    const info = customerInfo({
      activeSubscriptions: ['beautyally_pro:monthly-v2'],
      entitlements: {
        active: {
          pro: {
            expirationDateMillis: 1_800_000_000_000,
            productIdentifier: 'beautyally_pro',
          },
        },
      } as unknown as CustomerInfo['entitlements'],
    })

    expect(deriveRevenueCatEntitlements(info)).toEqual({
      customerInfo: info,
      isPro: true,
      expiresAtMs: 1_800_000_000_000,
      plan: 'monthly',
      productId: 'beautyally_pro:monthly-v2',
    })
  })

  it('selects monthly and yearly packages from an offering', () => {
    const monthly = purchasePackage('com.sycrafted.beautyally.premium.monthly')
    const yearly = purchasePackage('com.sycrafted.beautyally.premium.yearly')
    const offering = { availablePackages: [yearly, monthly] } as PurchasesOffering

    expect(pickRevenueCatPackages(offering)).toEqual({ monthly, yearly })
    expect(pickRevenueCatPackages(null)).toEqual({})
  })

  it('creates cache-only snapshots without retaining CustomerInfo', () => {
    expect(
      createRevenueCatCacheSnapshot(
        {
          customerInfo: customerInfo(),
          expiresAtMs: null,
          isPro: false,
          plan: null,
          productId: null,
        },
        123,
      ),
    ).toEqual({
      expiresAtMs: null,
      isPro: false,
      lastSyncedAtMs: 123,
      plan: null,
      productId: null,
    })
  })
})
