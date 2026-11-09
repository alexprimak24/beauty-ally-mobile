import i18n from 'i18next'
import type { Resource, ResourceKey } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { languageOptions } from '@/constants/onboarding/onboardingData'
import { languageDetector } from './languageDetector'

// ---- Namespaces present in every language
const NS = ['common', 'components', 'errors', 'main', 'onboarding'] as const
type Namespace = (typeof NS)[number]
type Bundle = Record<Namespace, ResourceKey>

// ---- Static require map (Metro needs literal paths)
const LOCALE_BUNDLES: Record<string, Bundle> = {
  // English (US)
  'en-US': {
    common: require('./locales/en-US/common.json'),
    components: require('./locales/en-US/components.json'),
    errors: require('./locales/en-US/errors.json'),
    main: require('./locales/en-US/main.json'),
    onboarding: require('./locales/en-US/onboarding.json'),
  },

  // Portuguese (Brazil)
  'pt-BR': {
    common: require('./locales/pt-BR/common.json'),
    components: require('./locales/pt-BR/components.json'),
    errors: require('./locales/pt-BR/errors.json'),
    main: require('./locales/pt-BR/main.json'),
    onboarding: require('./locales/pt-BR/onboarding.json'),
  },

  // Russian (Russia)
  'ru-RU': {
    common: require('./locales/ru-RU/common.json'),
    components: require('./locales/ru-RU/components.json'),
    errors: require('./locales/ru-RU/errors.json'),
    main: require('./locales/ru-RU/main.json'),
    onboarding: require('./locales/ru-RU/onboarding.json'),
  },

  // Chinese (Simplified, Hans script)
  'zh-Hans': {
    common: require('./locales/zh-Hans/common.json'),
    components: require('./locales/zh-Hans/components.json'),
    errors: require('./locales/zh-Hans/errors.json'),
    main: require('./locales/zh-Hans/main.json'),
    onboarding: require('./locales/zh-Hans/onboarding.json'),
  },

  // Arabic
  ar: {
    common: require('./locales/ar/common.json'),
    components: require('./locales/ar/components.json'),
    errors: require('./locales/ar/errors.json'),
    main: require('./locales/ar/main.json'),
    onboarding: require('./locales/ar/onboarding.json'),
  },

  // Hindi (India)
  'hi-IN': {
    common: require('./locales/hi-IN/common.json'),
    components: require('./locales/hi-IN/components.json'),
    errors: require('./locales/hi-IN/errors.json'),
    main: require('./locales/hi-IN/main.json'),
    onboarding: require('./locales/hi-IN/onboarding.json'),
  },

  // Ukrainian (Ukraine)
  'uk-UA': {
    common: require('./locales/uk-UA/common.json'),
    components: require('./locales/uk-UA/components.json'),
    errors: require('./locales/uk-UA/errors.json'),
    main: require('./locales/uk-UA/main.json'),
    onboarding: require('./locales/uk-UA/onboarding.json'),
  },

  // Polish (Poland)
  'pl-PL': {
    common: require('./locales/pl-PL/common.json'),
    components: require('./locales/pl-PL/components.json'),
    errors: require('./locales/pl-PL/errors.json'),
    main: require('./locales/pl-PL/main.json'),
    onboarding: require('./locales/pl-PL/onboarding.json'),
  },

  // Korean (Korea)
  'ko-KR': {
    common: require('./locales/ko-KR/common.json'),
    components: require('./locales/ko-KR/components.json'),
    errors: require('./locales/ko-KR/errors.json'),
    main: require('./locales/ko-KR/main.json'),
    onboarding: require('./locales/ko-KR/onboarding.json'),
  },

  // Japanese (Japan)
  'ja-JP': {
    common: require('./locales/ja-JP/common.json'),
    components: require('./locales/ja-JP/components.json'),
    errors: require('./locales/ja-JP/errors.json'),
    main: require('./locales/ja-JP/main.json'),
    onboarding: require('./locales/ja-JP/onboarding.json'),
  },

  // Spanish (Spain)
  'es-ES': {
    common: require('./locales/es-ES/common.json'),
    components: require('./locales/es-ES/components.json'),
    errors: require('./locales/es-ES/errors.json'),
    main: require('./locales/es-ES/main.json'),
    onboarding: require('./locales/es-ES/onboarding.json'),
  },

  // French (France)
  'fr-FR': {
    common: require('./locales/fr-FR/common.json'),
    components: require('./locales/fr-FR/components.json'),
    errors: require('./locales/fr-FR/errors.json'),
    main: require('./locales/fr-FR/main.json'),
    onboarding: require('./locales/fr-FR/onboarding.json'),
  },

  // German (Germany)
  'de-DE': {
    common: require('./locales/de-DE/common.json'),
    components: require('./locales/de-DE/components.json'),
    errors: require('./locales/de-DE/errors.json'),
    main: require('./locales/de-DE/main.json'),
    onboarding: require('./locales/de-DE/onboarding.json'),
  },
}

// ---- Build i18next resources from your `languageOptions`
const resources: Resource = {}

for (const { longCode } of languageOptions) {
  const lc = longCode
  const base = lc.split(/[-_]/)[0] // 'en-US' -> 'en', 'zh-Hans' -> 'zh'
  const bundle = LOCALE_BUNDLES[lc] || LOCALE_BUNDLES[base]

  if (!bundle) continue

  if (!resources[lc]) resources[lc] = {}
  if (!resources[base]) resources[base] = {}

  for (const ns of NS) {
    resources[lc][ns] = bundle[ns]
    if (!resources[base][ns]) resources[base][ns] = bundle[ns]
  }
}

// eslint-disable-next-line import/no-named-as-default-member -- i18next's default instance exposes the plugin API.
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: NS as unknown as string[],
    defaultNS: 'common',
    compatibilityJSON: 'v4',
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
    nonExplicitSupportedLngs: true,
  })

export default i18n
