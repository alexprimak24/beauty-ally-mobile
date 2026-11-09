import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Pressable, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { PRIVACY_POLICY, TERMS_OF_USE } from '@/constants/usefulLinks'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import SheetBackground from './SheetBackground'
import { SocialAuthButtons } from './SocialAuthButtons'

interface SignInSheetProps {
  onClose: () => void
}

export function SignInSheet({ onClose }: SignInSheetProps) {
  const translateY = useSharedValue(500)
  const { type, bp } = useRTokens()
  const { t } = useTranslation(components)

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.exp) })
  }, [translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View
      accessibilityViewIsModal
      className="absolute bottom-0 z-50 w-full overflow-hidden"
      style={[animatedStyle, { borderTopLeftRadius: scale(42), borderTopRightRadius: scale(42) }]}
    >
      <SheetBackground>
        <View className="mb-8 flex-row items-center justify-between">
          <Text className="font-bold text-dark" style={{ fontSize: type.xl }}>
            {t('signInSheet.title')}
          </Text>
          <Pressable
            accessibilityLabel={t('common.close', { defaultValue: 'Close' })}
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center"
            hitSlop={8}
            onPress={onClose}
          >
            <AntDesign name="close" size={28} />
          </Pressable>
        </View>

        <SocialAuthButtons
          mode="sign-in"
          variant={bp === 'tablet' || bp === 'large' ? 'primary' : 'secondary'}
        />

        <Text
          className="mt-6 text-center font-quicksand text-dark"
          style={{ fontSize: type.xs, lineHeight: Math.round(type.xs * 1.55) }}
        >
          <Trans
            ns={components}
            i18nKey="signInSheet.legal"
            components={{
              privacy: (
                <Text
                  className="font-quicksandSemiBold underline"
                  onPress={() => void Linking.openURL(PRIVACY_POLICY)}
                />
              ),
              terms: (
                <Text
                  className="font-quicksandSemiBold underline"
                  onPress={() => void Linking.openURL(TERMS_OF_USE)}
                />
              ),
            }}
          />
        </Text>
      </SheetBackground>
    </Animated.View>
  )
}
