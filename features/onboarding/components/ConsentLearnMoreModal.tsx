import PrimaryBtn from '@/components/ui/PrimaryBtn'
import { onboarding } from '@/utils/i18n/keyConstants'
import { Modal, Text, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Trans, useTranslation } from 'react-i18next'

interface ConsentLearnMoreModalProps {
  onClose: () => void
  visible: boolean
}

export function ConsentLearnMoreModal({ onClose, visible }: ConsentLearnMoreModalProps) {
  const { t } = useTranslation(onboarding)

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View className="flex-1 justify-end bg-[rgba(0,0,0,0.35)]">
        <Animated.View
          className="rounded-t-3xl bg-white px-6 pb-8 pt-4 shadow-2xl"
          entering={FadeIn.duration(300)}
        >
          <View className="mb-3 h-1.5 w-12 self-center rounded-full bg-neutral-300" />
          <Text className="mb-2 font-quicksandBold text-2xl text-dark">
            {t('congratulations.modal.title')}
          </Text>
          <Text className="font-quicksandMedium text-base leading-7 text-gray-800">
            <Trans
              components={{ br: <Text>{'\n'}</Text> }}
              i18nKey="congratulations.modal.explanation"
              ns={onboarding}
            />
          </Text>
          <View className="mt-4 items-center">
            <PrimaryBtn onPress={onClose} text={t('actions.close')} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}
