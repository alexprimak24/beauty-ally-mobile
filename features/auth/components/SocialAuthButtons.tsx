import { Platform, View } from 'react-native'

import type { btnVariant } from '@/constants/btnVariants'
import { useSocialAuth, type SocialAuthMode, type SocialAuthProvider } from '../hooks/useSocialAuth'
import AppleSignBtn from './AppleSignBtn'
import GoogleSignBtn from './GoogleSignBtn'

interface SocialAuthButtonsProps {
  mode?: SocialAuthMode
  variant?: btnVariant
}

export function SocialAuthButtons({
  mode = 'sign-up',
  variant = 'primary',
}: SocialAuthButtonsProps) {
  const { authenticate, isAuthenticating } = useSocialAuth(mode)
  const providers: SocialAuthProvider[] =
    Platform.OS === 'ios' ? ['apple', 'google'] : ['google', 'apple']

  return (
    <View className="flex-col items-center justify-center gap-5">
      {providers.map((provider) =>
        provider === 'apple' ? (
          <AppleSignBtn
            key={provider}
            disabled={isAuthenticating}
            onPress={() => void authenticate(provider)}
            variant={variant}
          />
        ) : (
          <GoogleSignBtn
            key={provider}
            disabled={isAuthenticating}
            onPress={() => void authenticate(provider)}
            variant={variant}
          />
        ),
      )}
    </View>
  )
}
