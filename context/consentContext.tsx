import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useMemo, useState } from 'react'

export interface ConsentRecord {
  userID?: string
  consentVersion: string
  policyVersion: string
  termsVersion: string
  consentType: 'health_data' | 'terms_privacy'
  consentedAt: string // ISO UTC
  withdrawnAt?: string | null
  locale?: string
  method: 'onboarding' | 'settings'
  textHash?: string
}

interface ConsentContextValue {
  consentData: ConsentRecord[]
  setConsent: (value: ConsentRecord[]) => void
  clearConsentData: () => void
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined)

function ConsentProvider({ children }: PropsWithChildren) {
  const [consentData, setConsentData] = useState<ConsentRecord[]>([])
  const setConsent = useCallback((value: ConsentRecord[]) => {
    setConsentData((prev) => {
      const map = new Map(prev.map((item) => [item.textHash, item]))
      value.forEach((item) => map.set(item.textHash, item)) // overwrite if same id
      return Array.from(map.values())
    })
  }, [])
  const clearConsentData = useCallback(() => {
    setConsentData([])
  }, [])

  const value = useMemo(
    () => ({ consentData, setConsent, clearConsentData }),
    [clearConsentData, consentData, setConsent],
  )

  return <ConsentContext value={value}>{children}</ConsentContext>
}

export { ConsentContext, ConsentProvider }
