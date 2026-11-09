export type SubscriptionPlan = 'monthly' | 'yearly' | null
export type SelectableSubscriptionPlan = Exclude<SubscriptionPlan, null>

export type PaywallLoadingState = 'freeScans' | 'purchasing' | 'restoring' | 'switching' | null

interface StoreProductPrice {
  currencyCode: string
  introPrice?: { price: number } | null
  price: number
}

interface BuildPlanPricingOptions {
  formatMoney: (value: number, currency: string) => string
  plan: SelectableSubscriptionPlan
  product?: StoreProductPrice
}

export interface PlanPricing {
  hasIntro: boolean
  introPrice: string | null
  mainPrice: string
  monthlyEquivalent: string | null
  standardPrice: string | null
}

export type PaymentPlanSuffixKey =
  'paymentPage.subscribed.monthSuffix' | 'paymentPage.subscribed.yearSuffix'

export function getPaymentPlanSuffixKey(plan: SubscriptionPlan): PaymentPlanSuffixKey | null {
  if (plan === 'monthly') return 'paymentPage.subscribed.monthSuffix'
  if (plan === 'yearly') return 'paymentPage.subscribed.yearSuffix'
  return null
}

export function buildPlanPricing({
  formatMoney,
  plan,
  product,
}: BuildPlanPricingOptions): PlanPricing {
  if (!product) {
    return {
      hasIntro: false,
      introPrice: null,
      mainPrice: '—',
      monthlyEquivalent: null,
      standardPrice: null,
    }
  }

  const standardPrice = formatMoney(product.price, product.currencyCode)
  const introValue = product.introPrice?.price
  const hasIntro = introValue !== undefined
  const introPrice = hasIntro ? formatMoney(introValue, product.currencyCode) : null
  const selectedPrice = introValue ?? product.price

  return {
    hasIntro,
    introPrice,
    mainPrice: introPrice ?? standardPrice,
    monthlyEquivalent:
      plan === 'yearly' ? formatMoney(selectedPrice / 12, product.currencyCode) : null,
    standardPrice,
  }
}

export function isPurchaseCancelled(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  return 'userCancelled' in error && error.userCancelled === true
}

export function getPaywallAudience(
  entitlementStatus: string,
  isPro: boolean,
): 'prospect' | 'subscriber' | 'unknown' {
  if (entitlementStatus === 'error') return 'unknown'
  return isPro ? 'subscriber' : 'prospect'
}

export function getPaywallEntryPoint(isPro: boolean, isSignin: boolean) {
  if (isPro) return 'subscription_management' as const
  return isSignin ? ('signed_in' as const) : ('onboarding' as const)
}

export function getPaywallCloseReason(isManaging: boolean, isSignin: boolean) {
  if (isManaging) return 'back_manage' as const
  return isSignin ? ('close_signedin' as const) : ('close_back' as const)
}
