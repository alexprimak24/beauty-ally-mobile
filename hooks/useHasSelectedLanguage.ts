// hooks/useHasSelectedLanguage.ts
import { useUser as useClerkUser } from '@clerk/expo'
import { useMemo } from 'react'
import { languageOptions } from '@/constants/onboarding/onboardingData'
import { useOnboarding } from '@/hooks/useOnboarding'
import { codeFromLngTag } from '@/utils/i18n/map'
import { useUser } from './useGetUser'

interface Options {
  injectedLngTag?: string // ← from parent if you have it
}

export function useHasSelectedLanguage(opts?: Options) {
  const { isSignedIn } = useClerkUser()
  const { data: user } = useUser()
  const { onboardingData } = useOnboarding()
  const language = onboardingData.language

  const code = useMemo(() => {
    // 1) Signed-in user profile wins
    if (isSignedIn && user?.profile?.language) {
      return languageOptions.find((l) => l.english === user.profile.language)?.code ?? 'EN'
    }

    // 2) Onboarding selection
    if (language) {
      return languageOptions.find((l) => l.english === language)?.code ?? 'EN'
    }

    // 3) Parent-injected lngTag fallback (e.g., from AsyncStorage or system)
    if (opts?.injectedLngTag) {
      return codeFromLngTag(opts.injectedLngTag)
    }

    // 4) Default
    return 'EN'
  }, [isSignedIn, user?.profile?.language, language, opts?.injectedLngTag])

  return { code } // ← string like "EN" | "UA" | ...
}
