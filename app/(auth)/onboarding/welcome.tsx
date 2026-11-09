import { LanguagePickerButton } from '@/components/ui/LanguagePickerButton'
import PrimaryBtn from '@/components/ui/PrimaryBtn'
import { useRTokens } from '@/design/useRTokens'
import { SignInSheet } from '@/features/auth/components/SignInSheet'
import { useWelcomeScreen } from '@/features/onboarding/hooks/useWelcomeScreen'
import { onboarding } from '@/utils/i18n/keyConstants'
import { VideoView } from 'expo-video'
import { Trans, useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function WelcomeScreen() {
  const welcome = useWelcomeScreen()
  const { type } = useRTokens()
  const { t } = useTranslation(onboarding)

  return (
    <>
      <LanguagePickerButton
        initial={welcome.languageCode}
        onChange={welcome.changeLanguage}
        right={10}
        showCode
        top={6}
      />
      <SafeAreaView className="w-full flex-1 flex-col items-center justify-between bg-[#f4f6f8] px-[25px] pb-[12px] pt-2">
        <View className="max-h-[71%] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#f4f6f8]">
          <VideoView
            allowsPictureInPicture={false}
            contentFit="contain"
            fullscreenOptions={{ enable: true }}
            nativeControls={false}
            player={welcome.player}
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <View className="h-[15%] w-full pt-2">
          <Text
            className="mb-[16px] text-center font-quicksandBold font-bold color-dark"
            style={{ fontSize: type.xl4 }}
          >
            {t('welcome.intro')}
          </Text>
        </View>

        <View className="h-[12%] w-full">
          <PrimaryBtn onPress={welcome.startOnboarding} text={t('welcome.action')} />
          <TouchableOpacity
            accessibilityRole="button"
            className="mt-[8px] w-full flex-row justify-center"
            onPress={welcome.openSignIn}
          >
            <Text style={{ fontSize: type.base }}>
              <Trans
                components={{
                  strong: (
                    <Text
                      className="ml-1 font-iSansSB font-semibold"
                      style={{ fontSize: type.sm }}
                    />
                  ),
                }}
                i18nKey="welcome.signInMsg"
                ns={onboarding}
              />
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {welcome.isSignInOpen ? (
        <>
          <TouchableOpacity
            accessibilityLabel={t('common.close', { defaultValue: 'Close sign in' })}
            accessibilityRole="button"
            activeOpacity={1}
            className="absolute inset-0 z-40 bg-dark/30"
            onPress={welcome.closeSignIn}
          />
          <SignInSheet onClose={welcome.closeSignIn} />
        </>
      ) : null}
    </>
  )
}
