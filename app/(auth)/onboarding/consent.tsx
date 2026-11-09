import checkmarkAnimation from '@/assets/animations/checkmark.json'
import PrimaryBtn from '@/components/ui/PrimaryBtn'
import PrimaryContainer from '@/components/ui/PrimaryContainer'
import { icons } from '@/constants/icons'
import { PRIVACY_POLICY, TERMS_OF_USE } from '@/constants/usefulLinks'
import { useRTokens } from '@/design/useRTokens'
import { ConsentCheckRow } from '@/features/onboarding/components/ConsentCheckRow'
import { ConsentLearnMoreModal } from '@/features/onboarding/components/ConsentLearnMoreModal'
import { useOnboardingConsent } from '@/features/onboarding/hooks/useOnboardingConsent'
import { onboarding } from '@/utils/i18n/keyConstants'
import LottieView from 'lottie-react-native'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

export default function OnboardingConsentScreen() {
  const consent = useOnboardingConsent()
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(onboarding)
  const transition = useSharedValue(0)

  useEffect(() => {
    transition.value = withDelay(
      1_800,
      withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
    )
  }, [transition])

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(transition.value, [0, 1], [0, -40]) },
      { scale: interpolate(transition.value, [0, 1], [1, 0.9]) },
    ],
  }))
  const formStyle = useAnimatedStyle(() => ({
    display: transition.value > 0.01 ? 'flex' : 'none',
    opacity: transition.value,
    transform: [{ translateY: interpolate(transition.value, [0, 1], [20, 0]) }],
  }))

  return (
    <PrimaryContainer>
      <Animated.View className="flex-1 items-center justify-center" style={checkmarkStyle}>
        <Animated.View entering={FadeIn.duration(500)}>
          <LottieView
            autoPlay
            loop={false}
            source={checkmarkAnimation}
            style={{ width: sizes.lottieCheckmark, height: sizes.lottieCheckmark }}
          />
        </Animated.View>
        <Text
          className="mt-2 text-center font-quicksandBold text-dark"
          style={{ fontSize: type.xl4 }}
        >
          <Trans
            components={{ br: <Text>{'\n'}</Text> }}
            i18nKey="congratulations.title"
            ns={onboarding}
          />
        </Text>
      </Animated.View>

      <Animated.View className="mt-[-60px]" style={formStyle}>
        <ScrollView
          bounces={false}
          contentContainerStyle={{ paddingBottom: 40, rowGap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="px-4 text-center font-quicksandSemiBold text-neutral-700"
            style={{ fontSize: type.sm }}
          >
            {t('congratulations.subtitle')}
          </Text>

          <View className="mx-6 items-center justify-center rounded-2xl bg-lightBg px-5 py-3">
            <Image className="mb-1.5 size-5" source={icons.notice} />
            <Text className="text-center font-iSansM text-dark" style={{ fontSize: type.xs }}>
              {t('congratulations.disclamer')}
            </Text>
          </View>

          <ConsentCheckRow
            checked={consent.hasAcceptedTerms}
            disabled={consent.isSubmitting}
            label={
              <Trans
                components={{
                  strong: (
                    <Text
                      className="font-quicksandSemiBold underline"
                      onPress={() => void Linking.openURL(TERMS_OF_USE)}
                    />
                  ),
                  highlight: (
                    <Text
                      className="font-quicksandSemiBold underline"
                      onPress={() => void Linking.openURL(PRIVACY_POLICY)}
                    />
                  ),
                }}
                i18nKey="congratulations.termsPriv"
                ns={onboarding}
              />
            }
            onPress={consent.toggleTerms}
            testID="terms-privacy-checkbox"
          />

          <ConsentCheckRow
            checked={consent.hasAcceptedHealthData}
            disabled={consent.isSubmitting}
            label={
              <Trans
                components={{
                  highlight: <Text className="font-quicksandSemiBold" />,
                  strong: <Text className="font-quicksandSemiBold" />,
                }}
                i18nKey="congratulations.processConsent"
                ns={onboarding}
              />
            }
            onPress={consent.toggleHealthData}
            testID="health-consent-checkbox"
          />

          <TouchableOpacity
            accessibilityRole="button"
            className="mt-[-4px] self-center"
            disabled={consent.isSubmitting}
            onPress={consent.openLearnMore}
          >
            <Text
              className="font-quicksandSemiBold text-neutral-700 underline"
              style={{ fontSize: type.xs }}
            >
              {t('congratulations.learnMsg')}
            </Text>
          </TouchableOpacity>

          <View className="mt-1 px-6">
            <PrimaryBtn
              disabled={!consent.canContinue}
              loading={consent.isSubmitting}
              onPress={() => void consent.acceptConsent()}
              text={t('actions.continue')}
            />
            <Text className="mt-2 text-center text-neutral-500" style={{ fontSize: type.xs }}>
              {t('congratulations.ageConsent')}
            </Text>
          </View>
        </ScrollView>
      </Animated.View>

      <ConsentLearnMoreModal
        onClose={consent.closeLearnMore}
        visible={consent.isLearnMoreVisible}
      />
    </PrimaryContainer>
  )
}
