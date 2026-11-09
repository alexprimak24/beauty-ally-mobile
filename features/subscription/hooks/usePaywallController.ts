import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth, useUser } from '@clerk/expo'
import { useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'

import { useRevenueCat } from '../revenueCat'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useCheckFree } from '@/hooks/useDBEntitlements'
import { usePriceFormatter } from '@/hooks/usePriceFormatter'
import { freeInit } from '@/services/entitlements'
import { analyticsEvents } from '@/utils/analytics'
import { onboarding } from '@/utils/i18n/keyConstants'
import { showRequestErrorToast } from '@/utils/showErrorToast'
import {
  buildPlanPricing,
  getPaywallAudience,
  getPaywallCloseReason,
  getPaywallEntryPoint,
  isPurchaseCancelled,
  type PaywallLoadingState,
  type SelectableSubscriptionPlan,
} from '../model'

const HOME_ROUTE = '/(protected)/(tabs)' as const
const SUCCESS_ROUTE = '/(auth)/payment/success' as const

export function usePaywallController() {
  const { getToken, userId } = useAuth()
  const { user } = useUser()
  const { isSignin: isSigninParam } = useLocalSearchParams<{
    isSignin?: string | string[]
  }>()
  const isSignin = (Array.isArray(isSigninParam) ? isSigninParam[0] : isSigninParam) === 'true'
  const queryClient = useQueryClient()
  const router = useRouter()
  const analytics = useAnalytics()
  const paywallViewedOnce = useRef(false)
  const { data: freeData, isError: isFreeError, isLoading: isFreeLoading } = useCheckFree()
  const { actions, entitlements, ops, paywall } = useRevenueCat()
  const { t } = useTranslation(onboarding)
  const { formatMoney, getPeriodSuffix } = usePriceFormatter()
  const [loadingState, setLoadingState] = useState<PaywallLoadingState>(null)
  const [isManaging, setIsManaging] = useState(false)
  const [plan, setPlan] = useState<SelectableSubscriptionPlan>('yearly')
  const [wantsFreeScans, setWantsFreeScans] = useState(false)

  const isPro = entitlements.isPro
  const activePlan = entitlements.plan
  const isYearly = plan === 'yearly'
  const isCurrentActivePlan = isPro && plan === activePlan
  const busy = ops.purchasing === 'loading' || ops.restoring === 'loading'
  const hasActivatedFree = freeData?.hasEntry === true
  const isFreeOptionDisabled = hasActivatedFree || isFreeLoading || isFreeError

  const yearlyPricing = useMemo(
    () =>
      buildPlanPricing({
        formatMoney,
        plan: 'yearly',
        product: paywall.packages.yearly?.product,
      }),
    [formatMoney, paywall.packages.yearly?.product],
  )
  const monthlyPricing = useMemo(
    () =>
      buildPlanPricing({
        formatMoney,
        plan: 'monthly',
        product: paywall.packages.monthly?.product,
      }),
    [formatMoney, paywall.packages.monthly?.product],
  )

  const yearlyBillingText = useMemo(() => {
    if (!isPro && yearlyPricing.hasIntro) {
      return `${t('paymentPage.card.firstYear')} ${yearlyPricing.introPrice ?? ''}, ${t('paymentPage.card.then')} ${yearlyPricing.standardPrice ?? ''}${getPeriodSuffix({ isYearly: true })}`
    }
    return t('paymentPage.card.cancelAnytime')
  }, [getPeriodSuffix, isPro, t, yearlyPricing])

  const monthlyBillingText = useMemo(() => {
    if (!isPro && monthlyPricing.hasIntro) {
      return `${t('paymentPage.card.firstMonth')} ${monthlyPricing.introPrice ?? ''}, ${t('paymentPage.card.then')} ${monthlyPricing.standardPrice ?? ''}${getPeriodSuffix({ isYearly: false })}`
    }
    return t('paymentPage.card.cancelAnytime')
  }, [getPeriodSuffix, isPro, monthlyPricing, t])

  const selectPlan = useCallback(
    (nextPlan: SelectableSubscriptionPlan) => {
      if (wantsFreeScans || plan === nextPlan) return
      void Haptics.selectionAsync()
      setPlan(nextPlan)
      analytics.capture(analyticsEvents.paywallPlanSelected, { plan: nextPlan })
    },
    [analytics, plan, wantsFreeScans],
  )

  const selectFreeScans = useCallback(
    (selected: boolean) => {
      if (isFreeOptionDisabled) return
      void Haptics.selectionAsync()
      setWantsFreeScans(selected)
    },
    [isFreeOptionDisabled],
  )

  const continueFree = useCallback(async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress ?? ''
      const data = await freeInit(getToken, email)
      if (data.granted) analytics.capture(analyticsEvents.freeActivated, { source: 'paywall' })

      Toast.show({
        type: 'success',
        position: 'top',
        text1: data.granted
          ? t('paymentPage.toast.freeActivated')
          : t('paymentPage.toast.freeAlready'),
      })
      await queryClient.invalidateQueries({ queryKey: ['checkFree', userId] })
      router.replace(HOME_ROUTE)
    } catch (error: unknown) {
      showRequestErrorToast(error)
    }
  }, [analytics, getToken, queryClient, router, t, user?.primaryEmailAddress?.emailAddress, userId])

  const handleNextStep = useCallback(async () => {
    if (busy || loadingState) return

    if (wantsFreeScans) {
      setLoadingState('freeScans')
      await continueFree()
      setLoadingState(null)
      return
    }

    const selectedPackage = isYearly ? paywall.packages.yearly : paywall.packages.monthly
    if (paywall.status !== 'ready' || !selectedPackage) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: t(
          paywall.status === 'ready'
            ? 'rcContext.errors.packageNotAvailable'
            : 'paymentPage.loading.loadingPaywall.message',
        ),
      })
      return
    }

    setLoadingState(isManaging ? 'switching' : 'purchasing')
    try {
      if (isYearly) await actions.purchaseYearly()
      else await actions.purchaseMonthly()

      Toast.show({
        type: 'success',
        position: 'top',
        text1: isManaging
          ? isYearly
            ? `${t('paymentPage.toast.switchYearly')} 🎉`
            : `${t('paymentPage.toast.switchMonthly')} 🎉`
          : `${t('paymentPage.toast.premiumUn')} 🎉`,
      })
      analytics.capture(analyticsEvents.subscriptionCompleted, {
        operation: isManaging ? 'switch' : 'purchase',
        plan,
      })
      router.push(SUCCESS_ROUTE)
    } catch (error: unknown) {
      if (!isPurchaseCancelled(error) && __DEV__) console.warn('Purchase did not complete:', error)
    } finally {
      setLoadingState(null)
    }
  }, [
    actions,
    analytics,
    busy,
    continueFree,
    isManaging,
    isYearly,
    loadingState,
    paywall.packages.monthly,
    paywall.packages.yearly,
    paywall.status,
    plan,
    router,
    t,
    wantsFreeScans,
  ])

  const handleRestore = useCallback(async () => {
    if (busy || loadingState) return
    setLoadingState('restoring')
    try {
      await actions.restore()
      analytics.capture(analyticsEvents.subscriptionRestoreCompleted)
    } catch (error: unknown) {
      if (!isPurchaseCancelled(error) && __DEV__) console.warn('Restore did not complete:', error)
    } finally {
      setLoadingState(null)
    }
  }, [actions, analytics, busy, loadingState])

  const handleClose = useCallback(() => {
    analytics.capture(analyticsEvents.paywallClosed, {
      reason: getPaywallCloseReason(isManaging, isSignin),
    })

    if (isManaging) {
      setIsManaging(false)
    } else if (isSignin) {
      router.replace(HOME_ROUTE)
    } else {
      router.back()
    }
  }, [analytics, isManaging, isSignin, router])

  const startManaging = useCallback(() => {
    void Haptics.selectionAsync()
    setPlan(activePlan ?? 'yearly')
    setIsManaging(true)
  }, [activePlan])

  useEffect(() => {
    if (
      paywallViewedOnce.current ||
      entitlements.status === 'idle' ||
      entitlements.status === 'loading'
    ) {
      return
    }

    paywallViewedOnce.current = true
    analytics.capture(analyticsEvents.paywallViewed, {
      audience: getPaywallAudience(entitlements.status, isPro),
      entry_point: getPaywallEntryPoint(isPro, isSignin),
    })
  }, [analytics, entitlements.status, isPro, isSignin])

  useEffect(() => {
    if (hasActivatedFree && wantsFreeScans) setWantsFreeScans(false)
  }, [hasActivatedFree, wantsFreeScans])

  const interactivePlansStyle = useAnimatedStyle(() => ({
    opacity: withTiming(wantsFreeScans ? 0.4 : 1, { duration: 250 }),
    transform: [{ scale: withTiming(wantsFreeScans ? 0.98 : 1, { duration: 250 }) }],
  }))

  const activeLoadingKey = loadingState ?? 'default'

  return {
    activePlan,
    busy,
    handleClose,
    handleNextStep,
    handleRestore,
    hasActivatedFree,
    interactivePlansStyle,
    isCurrentActivePlan,
    isFreeOptionDisabled,
    isManaging,
    isPro,
    isYearly,
    loadingMessage: t(`paymentPage.loading.${activeLoadingKey}.message`, {
      defaultValue: 'Processing...',
    }),
    loadingState,
    loadingSubMessage: t(`paymentPage.loading.${activeLoadingKey}.subMessage`, {
      defaultValue: '',
    }),
    monthlyBillingText,
    monthlyPeriod: getPeriodSuffix({ isYearly: false }),
    monthlyPricing,
    paywallStatus: paywall.status,
    plan,
    selectFreeScans,
    selectPlan,
    startManaging,
    wantsFreeScans,
    yearlyBillingText,
    yearlyPeriod: getPeriodSuffix({ isYearly: true }),
    yearlyPricing,
  }
}
