import { useRevenueCat } from '../revenueCat'

import { getPaymentPlanSuffixKey } from '../model'
import { usePaymentSuccessTransition } from './usePaymentSuccessTransition'

export function usePaymentSuccessController() {
  const { entitlements } = useRevenueCat()
  const transition = usePaymentSuccessTransition()

  return {
    ...transition,
    isActive: entitlements.isPro,
    planSuffixKey: getPaymentPlanSuffixKey(entitlements.plan),
  }
}
