import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function useTimeAgo(dateString?: string | null) {
  const { t } = useTranslation('common')
  const [now, setNow] = useState(() => new Date())

  // re-tick every 30s so “Just now / X minutes ago” stays fresh
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const value = useMemo(() => {
    if (!dateString) return t('timeAgo.now')

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return t('timeAgo.now')

    const min = differenceInMinutes(now, date)
    if (min < 1) return t('timeAgo.now')
    if (min < 60) return t('timeAgo.minutes', { count: min })

    const hr = differenceInHours(now, date)
    if (hr < 24) return t('timeAgo.hours', { count: hr })

    const days = differenceInDays(now, date)
    if (days < 7) return t('timeAgo.days', { count: days })
    if (days < 30) {
      const weeks = Math.max(1, Math.floor(days / 7))
      return t('timeAgo.weeks', { count: weeks })
    }

    const months = differenceInMonths(now, date)
    if (months < 12) return t('timeAgo.months', { count: months })

    const years = differenceInYears(now, date)
    return t('timeAgo.years', { count: years })
  }, [dateString, now, t])

  return value
}
