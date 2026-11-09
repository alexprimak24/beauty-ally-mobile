import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getDateFnsLocale } from './dateLocale'

export function useDateFnsLocale() {
  const { i18n } = useTranslation()

  return useMemo(() => {
    return getDateFnsLocale(i18n.resolvedLanguage)
  }, [i18n.resolvedLanguage])
}
