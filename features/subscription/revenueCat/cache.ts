import AsyncStorage from '@react-native-async-storage/async-storage'
import { z } from 'zod'

import type { RevenueCatEntitlementsCache } from './types'

const ENTITLEMENTS_CACHE_KEY = 'rc_entitlements_cache_v1'

const entitlementsCacheSchema = z.object({
  expiresAtMs: z.number().nullable(),
  isPro: z.boolean(),
  lastSyncedAtMs: z.number().nullable(),
  plan: z.enum(['monthly', 'yearly']).nullable(),
  productId: z.string().nullable(),
})

export async function loadRevenueCatEntitlementsCache(): Promise<RevenueCatEntitlementsCache | null> {
  try {
    const raw = await AsyncStorage.getItem(ENTITLEMENTS_CACHE_KEY)
    if (!raw) return null

    const parsed = entitlementsCacheSchema.safeParse(JSON.parse(raw) as unknown)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export async function saveRevenueCatEntitlementsCache(
  snapshot: RevenueCatEntitlementsCache,
): Promise<void> {
  try {
    await AsyncStorage.setItem(ENTITLEMENTS_CACHE_KEY, JSON.stringify(snapshot))
  } catch {
    // This cache only improves startup UX; RevenueCat remains the source of truth.
  }
}
