import { use } from 'react'
import { ConsentContext } from '@/context/consentContext'

function useConsent() {
  const context = use(ConsentContext)
  if (!context) throw new Error('useConsent must be used within ConsentProvider')
  return context
}

export { useConsent }
