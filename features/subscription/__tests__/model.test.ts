/// <reference types="jest" />

import {
  buildPlanPricing,
  getPaymentPlanSuffixKey,
  getPaywallAudience,
  getPaywallCloseReason,
  getPaywallEntryPoint,
  isPurchaseCancelled,
} from '../model'

describe('subscription model', () => {
  it('maps known plans to their localized suffixes', () => {
    expect(getPaymentPlanSuffixKey('monthly')).toBe('paymentPage.subscribed.monthSuffix')
    expect(getPaymentPlanSuffixKey('yearly')).toBe('paymentPage.subscribed.yearSuffix')
    expect(getPaymentPlanSuffixKey(null)).toBeNull()
  })

  it('formats regular and introductory yearly pricing', () => {
    const formatMoney = (value: number, currency: string) => `${currency} ${value.toFixed(2)}`

    expect(
      buildPlanPricing({
        formatMoney,
        plan: 'yearly',
        product: { currencyCode: 'USD', price: 120 },
      }),
    ).toEqual({
      hasIntro: false,
      introPrice: null,
      mainPrice: 'USD 120.00',
      monthlyEquivalent: 'USD 10.00',
      standardPrice: 'USD 120.00',
    })

    expect(
      buildPlanPricing({
        formatMoney,
        plan: 'yearly',
        product: { currencyCode: 'USD', introPrice: { price: 0 }, price: 120 },
      }),
    ).toEqual({
      hasIntro: true,
      introPrice: 'USD 0.00',
      mainPrice: 'USD 0.00',
      monthlyEquivalent: 'USD 0.00',
      standardPrice: 'USD 120.00',
    })

    expect(
      buildPlanPricing({
        formatMoney,
        plan: 'monthly',
        product: { currencyCode: 'EUR', price: 12 },
      }),
    ).toEqual({
      hasIntro: false,
      introPrice: null,
      mainPrice: 'EUR 12.00',
      monthlyEquivalent: null,
      standardPrice: 'EUR 12.00',
    })
  })

  it('uses a safe placeholder while store products are unavailable', () => {
    expect(
      buildPlanPricing({
        formatMoney: (value, currency) => `${currency} ${value}`,
        plan: 'monthly',
      }),
    ).toEqual({
      hasIntro: false,
      introPrice: null,
      mainPrice: '—',
      monthlyEquivalent: null,
      standardPrice: null,
    })
  })

  it('recognizes purchase cancellation without treating arbitrary errors as cancellation', () => {
    expect(isPurchaseCancelled({ userCancelled: true })).toBe(true)
    expect(isPurchaseCancelled(new Error('network'))).toBe(false)
    expect(isPurchaseCancelled(null)).toBe(false)
  })

  it('derives stable analytics dimensions', () => {
    expect(getPaywallAudience('error', false)).toBe('unknown')
    expect(getPaywallAudience('ready', true)).toBe('subscriber')
    expect(getPaywallAudience('ready', false)).toBe('prospect')
    expect(getPaywallEntryPoint(true, false)).toBe('subscription_management')
    expect(getPaywallEntryPoint(false, true)).toBe('signed_in')
    expect(getPaywallEntryPoint(false, false)).toBe('onboarding')
    expect(getPaywallCloseReason(true, false)).toBe('back_manage')
    expect(getPaywallCloseReason(false, true)).toBe('close_signedin')
    expect(getPaywallCloseReason(false, false)).toBe('close_back')
  })
})
