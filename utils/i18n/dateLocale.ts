import type { Locale } from 'date-fns'
import { arSA, de, enUS, es, fr, hi, ja, ko, pl, ptBR, ru, uk, zhCN } from 'date-fns/locale'
import i18n from '.'

const DATE_FNS_LOCALES: Record<string, Locale> = {
  'en-US': enUS,
  'pt-BR': ptBR,
  'ru-RU': ru,
  'zh-Hans': zhCN,
  ar: arSA,
  'hi-IN': hi,
  'uk-UA': uk,
  'pl-PL': pl,
  'ko-KR': ko,
  'ja-JP': ja,
  'es-ES': es,
  'fr-FR': fr,
  'de-DE': de,

  en: enUS,
  pt: ptBR,
  ru,
  zh: zhCN,
  hi,
  uk,
  pl,
  ko,
  ja,
  es,
  fr,
  de,
}

export function getDateFnsLocale(lng?: string): Locale {
  const resolved = lng || i18n.resolvedLanguage || i18n.language || 'en-US'
  const base = resolved.split(/[-_]/)[0]

  return DATE_FNS_LOCALES[resolved] || DATE_FNS_LOCALES[base] || enUS
}
