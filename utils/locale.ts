export function getLocaleSafe(defaultLocale: string = 'en') {
  try {
    return Intl?.DateTimeFormat?.().resolvedOptions().locale ?? defaultLocale
  } catch {
    return defaultLocale
  }
}
