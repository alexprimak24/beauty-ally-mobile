import { common } from '@/utils/i18n/keyConstants'
import i18next from 'i18next'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// ✅ 1. Define a clean map of symbols
// This ensures that even if the phone wants to show "US$" or "CA$", we know we just want "$"
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  AUD: '$',
  CAD: '$',
  HKD: '$',
  NZD: '$',
  SGD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  UAH: '₴',
  INR: '₹',
  BRL: 'R$', // Brazil usually keeps R$
  RUB: '₽',
  TRY: '₺',
}

type PeriodSuffix = (opts?: { isYearly?: boolean }) => string
type WithPeriodSuffix = (priceText: string, opts?: { isYearly?: boolean }) => string

type MoneyFmt = (value: number, currency?: string) => string
type PriceWithPeriodFmt = (
  value: number,
  opts?: { currency?: string; isYearly?: boolean },
) => string

export function usePriceFormatter() {
  // ⚠️ Make sure your 'common.json' actually has 'billing.perYearSuffix' keys.
  // If they are in 'onboarding', change 'common' to 'onboarding' below.
  const { i18n, t } = useTranslation(common)

  // Safety check for locale
  const locale = i18n?.language || i18next.language || 'en-US'

  const formatterByCurrency = useMemo(() => {
    const cache = new Map<string, Intl.NumberFormat>()

    return (currency: string) => {
      const key = currency.toUpperCase()
      const cached = cache.get(key)
      if (cached) return cached

      // We prefer 'narrowSymbol' (usually gives '$' instead of 'US$')
      // but some old Android versions ignore this options.
      const makeNF = (currencyDisplay: 'narrowSymbol' | 'symbol' | 'code') =>
        new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: key,
          currencyDisplay,
          maximumFractionDigits: 2,
          minimumFractionDigits: 2, // Ensure 5.00 instead of 5
        })

      try {
        const nf = makeNF('narrowSymbol')
        cache.set(key, nf)
        return nf
      } catch {
        try {
          const nf = makeNF('symbol')
          cache.set(key, nf)
          return nf
        } catch {
          // Fallback to basic ISO code if everything fails
          const nf = makeNF('code')
          cache.set(key, nf)
          return nf
        }
      }
    }
  }, [locale])

  const formatMoney: MoneyFmt = useCallback(
    (value, currencyInput = 'USD') => {
      const currency = currencyInput.toUpperCase()
      const formatter = formatterByCurrency(currency)
      let formatted = formatter.format(value) // e.g., "5,00 US$" or "5,00 USD"

      const targetSymbol = CURRENCY_SYMBOLS[currency]

      // --- 🧹 THE CLEANING LOGIC ---

      if (targetSymbol) {
        // Case A: The string ALREADY contains the symbol (e.g. "US$ 5,00" or "5,00 $")
        if (formatted.includes(targetSymbol)) {
          // Remove any A-Z letters (like "US", "CA", "AU") surrounding the symbol
          // This turns "US$ 5,00" -> "$ 5,00"
          formatted = formatted.replace(/[A-Z]+/g, '').trim()
        }
        // Case B: The string DOES NOT contain the symbol, only code (e.g. "5,00 USD")
        else {
          // Replace the ISO code (USD) with the Symbol ($)
          formatted = formatted.replace(currency, targetSymbol).trim()
        }
      }

      // Final cleanup: Remove extra spaces created by removing letters
      // e.g., "$  5,00" -> "$ 5,00"
      formatted = formatted.replace(/\s+/g, ' ').trim()

      return formatted
    },
    [formatterByCurrency],
  )

  const getPeriodSuffix: PeriodSuffix = useCallback(
    (opts) => {
      const isYearly = opts?.isYearly ?? false
      // ✅ ENSURE these keys exist in your translation files!
      // In common.json:
      // "billing": { "perYearSuffix": "/ year", "perMonthSuffix": "/ month" }
      // Or localized: "/ año", "/ mes", etc.
      return isYearly
        ? t('billing.perYearSuffix', { defaultValue: '/yr' })
        : t('billing.perMonthSuffix', { defaultValue: '/mo' })
    },
    [t],
  )

  const formatPriceWithPeriod: PriceWithPeriodFmt = useCallback(
    (value, opts) => {
      const currency = opts?.currency ?? 'USD'
      const isYearly = opts?.isYearly ?? false
      // Clean money + Suffix
      return `${formatMoney(value, currency)} ${getPeriodSuffix({ isYearly })}`
    },
    [formatMoney, getPeriodSuffix],
  )

  const addPeriodSuffix: WithPeriodSuffix = useCallback(
    (priceText, opts) => {
      return `${priceText} ${getPeriodSuffix(opts)}`
    },
    [getPeriodSuffix],
  )

  return { locale, formatMoney, formatPriceWithPeriod, getPeriodSuffix, addPeriodSuffix }
}
