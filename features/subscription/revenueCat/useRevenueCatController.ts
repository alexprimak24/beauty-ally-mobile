import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { onboarding } from '@/utils/i18n/keyConstants'
import { loadRevenueCatEntitlementsCache, saveRevenueCatEntitlementsCache } from './cache'
import {
  createRevenueCatCacheSnapshot,
  deriveRevenueCatEntitlements,
  initialRevenueCatEntitlements,
  initialRevenueCatOperations,
  initialRevenueCatPaywall,
  pickRevenueCatPackages,
} from './model'
import {
  getRevenueCatCustomerInfo,
  getRevenueCatOfferings,
  isRevenueCatPurchaseCancelled,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  subscribeToRevenueCatCustomerInfo,
} from './purchases'
import type {
  RevenueCatContextValue,
  RevenueCatEntitlementData,
  RevenueCatEntitlements,
  RevenueCatOperations,
  RevenueCatPaywall,
  RevenueCatPlan,
} from './types'
import { useRevenueCatIdentity } from './useRevenueCatIdentity'

export function useRevenueCatController(): RevenueCatContextValue {
  const { t } = useTranslation(onboarding)
  const identity = useRevenueCatIdentity()
  const [entitlements, setEntitlements] = useState<RevenueCatEntitlements>(
    initialRevenueCatEntitlements,
  )
  const [paywall, setPaywall] = useState<RevenueCatPaywall>(initialRevenueCatPaywall)
  const [ops, setOps] = useState<RevenueCatOperations>(initialRevenueCatOperations)
  const entitlementsInFlight = useRef(false)
  const offeringsInFlight = useRef(false)

  const applyEntitlements = useCallback((next: RevenueCatEntitlementData) => {
    const lastSyncedAtMs = Date.now()
    setEntitlements((current) => ({
      ...current,
      ...next,
      status: 'ready',
      lastSyncedAtMs,
    }))
    void saveRevenueCatEntitlementsCache(createRevenueCatCacheSnapshot(next, lastSyncedAtMs))
  }, [])

  useEffect(() => {
    let active = true

    void loadRevenueCatEntitlementsCache().then((cached) => {
      if (!active || !cached) return
      setEntitlements((current) => ({
        ...current,
        ...cached,
        status: current.status === 'idle' ? 'stale' : current.status,
      }))
    })

    return () => {
      active = false
    }
  }, [])

  const refreshEntitlements = useCallback(async () => {
    if (!identity.isReady || entitlementsInFlight.current) return
    entitlementsInFlight.current = true
    setOps((current) => ({ ...current, refreshingEntitlements: 'loading' }))
    setEntitlements((current) => ({ ...current, status: 'loading' }))

    try {
      applyEntitlements(deriveRevenueCatEntitlements(await getRevenueCatCustomerInfo()))
      setOps((current) => ({ ...current, refreshingEntitlements: 'idle' }))
    } catch (error) {
      setEntitlements((current) => ({
        ...current,
        status: current.customerInfo ? 'stale' : 'error',
      }))
      setOps((current) => ({ ...current, refreshingEntitlements: 'error' }))
      if (__DEV__) console.warn('RC refreshEntitlements error:', error)
    } finally {
      entitlementsInFlight.current = false
    }
  }, [applyEntitlements, identity.isReady])

  const refreshOfferings = useCallback(async () => {
    if (!identity.isReady || offeringsInFlight.current) return
    offeringsInFlight.current = true
    setOps((current) => ({ ...current, refreshingOfferings: 'loading' }))
    setPaywall((current) => ({ ...current, status: 'loading' }))

    try {
      const offerings = await getRevenueCatOfferings()
      const currentOffering = offerings.current ?? null
      setPaywall({
        status: 'ready',
        offerings,
        currentOffering,
        packages: pickRevenueCatPackages(currentOffering),
      })
      setOps((current) => ({ ...current, refreshingOfferings: 'idle' }))
    } catch (error) {
      setPaywall((current) => ({ ...current, status: 'error' }))
      setOps((current) => ({ ...current, refreshingOfferings: 'error' }))
      if (__DEV__) console.warn('RC refreshOfferings error:', error)
    } finally {
      offeringsInFlight.current = false
    }
  }, [identity.isReady])

  useEffect(() => {
    if (!identity.isReady) return
    void refreshEntitlements()
    void refreshOfferings()
  }, [identity.isReady, refreshEntitlements, refreshOfferings])

  useEffect(() => {
    if (!identity.isReady) return
    return subscribeToRevenueCatCustomerInfo((info) => {
      applyEntitlements(deriveRevenueCatEntitlements(info))
    })
  }, [applyEntitlements, identity.isReady])

  const purchaseByPlan = useCallback(
    async (plan: RevenueCatPlan) => {
      if (!identity.isReady) return
      const selectedPackage = paywall.packages[plan]
      if (!selectedPackage) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: t('rcContext.errors.packageNotAvailable'),
        })
        return
      }

      setOps((current) => ({ ...current, purchasing: 'loading' }))
      try {
        const info = await purchaseRevenueCatPackage(selectedPackage)
        applyEntitlements(deriveRevenueCatEntitlements(info))
        setOps((current) => ({ ...current, purchasing: 'idle' }))
      } catch (error) {
        const cancelled = isRevenueCatPurchaseCancelled(error)
        setOps((current) => ({ ...current, purchasing: cancelled ? 'idle' : 'error' }))
        if (!cancelled) {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: t('rcContext.errors.purchaseFailed'),
          })
          if (__DEV__) console.warn('RC purchase error:', error)
        }
        throw error
      }
    },
    [applyEntitlements, identity.isReady, paywall.packages, t],
  )

  const purchaseMonthly = useCallback(() => purchaseByPlan('monthly'), [purchaseByPlan])
  const purchaseYearly = useCallback(() => purchaseByPlan('yearly'), [purchaseByPlan])

  const restore = useCallback(async () => {
    if (!identity.isReady) return
    setOps((current) => ({ ...current, restoring: 'loading' }))

    try {
      const info = await restoreRevenueCatPurchases()
      applyEntitlements(deriveRevenueCatEntitlements(info))
      Toast.show({ type: 'success', position: 'top', text1: t('paymentPage.toast.restored') })
      setOps((current) => ({ ...current, restoring: 'idle' }))
    } catch (error) {
      Toast.show({ type: 'error', position: 'top', text1: t('paymentPage.toast.restoreErr') })
      setOps((current) => ({ ...current, restoring: 'error' }))
      if (__DEV__) console.warn('RC restore error:', error)
      throw error
    }
  }, [applyEntitlements, identity.isReady, t])

  return useMemo(
    () => ({
      identity,
      entitlements,
      paywall,
      ops,
      actions: {
        refreshEntitlements,
        refreshOfferings,
        purchaseMonthly,
        purchaseYearly,
        restore,
      },
    }),
    [
      entitlements,
      identity,
      ops,
      paywall,
      purchaseMonthly,
      purchaseYearly,
      refreshEntitlements,
      refreshOfferings,
      restore,
    ],
  )
}
