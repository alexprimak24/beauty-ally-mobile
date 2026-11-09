import { useTranslation } from 'react-i18next'
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LanguagePickerButton } from '@/components/ui/LanguagePickerButton'
import WelcomeUser from '@/components/ui/WelcomeUser'
import { ProfileHistoryButton } from '@/features/profile/components/ProfileHistoryButton'
import { ProfileIdentityEditor } from '@/features/profile/components/ProfileIdentityEditor'
import { ProfileLogoutButton } from '@/features/profile/components/ProfileLogoutButton'
import { ProfileSettingsSection } from '@/features/profile/components/ProfileSettingsSection'
import { SkinProfilePanel } from '@/features/profile/components/SkinProfilePanel'
import { useProfileSettings } from '@/features/profile/hooks/useProfileSettings'
import { main } from '@/utils/i18n/keyConstants'

export default function ProfileScreen() {
  const { t } = useTranslation(main)
  const { handleLanguageChange, handleSignOut, isUpdatingLanguage, languageCode } =
    useProfileSettings()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="bg-base flex-1 px-6 pb-20 pt-4">
          <View className="flex-1 flex-col gap-5 pb-20">
            <WelcomeUser
              variant="secondary"
              startText={t('profile.welcomeStart')}
              right={
                <LanguagePickerButton
                  initial={languageCode}
                  onChange={handleLanguageChange}
                  showCode
                  floating={false}
                  isUpdating={isUpdatingLanguage}
                />
              }
            />
            <ProfileIdentityEditor />
            <View className="mb-3 mt-6 gap-6">
              <SkinProfilePanel />
              <ProfileHistoryButton />
            </View>
            <ProfileSettingsSection onAccountDelete={handleSignOut} />
            <ProfileLogoutButton onLogout={handleSignOut} />
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}
