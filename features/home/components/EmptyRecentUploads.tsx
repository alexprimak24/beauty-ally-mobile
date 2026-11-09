import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import { images } from '@/constants/images'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import PressEffectWrapper from '@/components/ui/PressEffectWrapper'

export default function EmptyRecentUploads({ onPressScan }: { onPressScan: () => void }) {
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(components)

  return (
    <View className="mb-4 mt-4 flex-1 items-center justify-center px-6">
      <Image
        source={images.entryEmpty}
        resizeMode="contain"
        style={{ marginBottom: 24, width: sizes.emtryCardW, height: sizes.emtryCardH }}
      />

      <Text
        className="mb-2 text-center font-quicksandSemiBold text-dark"
        style={{ fontSize: type.lg }}
      >
        {t('emptyRecentUploads.title')}
      </Text>

      <Text
        className="mb-4 text-center font-quicksand text-dark/70"
        style={{ fontSize: type.base }}
      >
        <Trans
          ns={components}
          i18nKey="emptyRecentUploads.hint"
          components={{ strong: <Text className="font-quicksandSemiBold" /> }}
        />
      </Text>

      <PressEffectWrapper
        onPress={onPressScan}
        containerClassName="bg-dark px-6 py-3 rounded-full"
        className="flex-row items-center justify-center"
        fillAll={false}
      >
        <Ionicons name="arrow-down-circle" size={sizes.historyImg} color="#fff" />
        <Text className="ml-2 font-quicksandSemiBold text-white" style={{ fontSize: type.base }}>
          {t('emptyRecentUploads.cta')}
        </Text>
      </PressEffectWrapper>
    </View>
  )
}
