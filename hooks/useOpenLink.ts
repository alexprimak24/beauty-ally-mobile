import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking } from 'react-native'

interface OpenLinkOptions {
  /** If provided, try this when the primary URL isn’t supported */
  fallbackUrl?: string
  /** Override default alert on error */
  silent?: boolean
}

/**
 * useOpenLink
 * - i18n’d alerts
 * - optional fallback URL
 * - loading flag for UI states (e.g., disable a button briefly)
 */
export function useOpenLink() {
  const { t } = useTranslation('common')
  const [opening, setOpening] = useState(false)

  const openLink = useCallback(
    async (url: string, opts: OpenLinkOptions = {}) => {
      if (!url) return false
      setOpening(true)
      try {
        const supported = await Linking.canOpenURL(url)
        if (supported) {
          await Linking.openURL(url)
          return true
        }

        // try fallback if provided
        if (opts.fallbackUrl) {
          const fallbackSupported = await Linking.canOpenURL(opts.fallbackUrl)
          if (fallbackSupported) {
            await Linking.openURL(opts.fallbackUrl)
            return true
          }
        }

        if (!opts.silent) {
          Alert.alert(t('alerts.oops'), t('errors.openLinkUnsupported'))
        }
        return false
      } catch (err) {
        console.error(err)
        if (!opts.silent) {
          Alert.alert(t('alerts.oops'), t('errors.openLink'))
        }
        return false
      } finally {
        setOpening(false)
      }
    },
    [t],
  )

  return { openLink, opening }
}
