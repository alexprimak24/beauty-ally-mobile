import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Text, TextInput, View } from 'react-native'

import PressEffectWrapper from '@/components/ui/PressEffectWrapper'
import { icons } from '@/constants/icons'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import { useProfileIdentityEditor } from '../hooks/useProfileIdentityEditor'

export function ProfileIdentityEditor() {
  const { t } = useTranslation(components)
  const { sizes, type } = useRTokens()
  const {
    currentName,
    discardName,
    draftName,
    isSavingName,
    isUploadingPicture,
    pickPicture,
    pictureSource,
    saveName,
    setDraftName,
  } = useProfileIdentityEditor()

  return (
    <View className="flex-row items-center">
      <PressEffectWrapper
        fillAll={false}
        onPress={() => void pickPicture()}
        disabled={isUploadingPicture}
      >
        <View style={{ position: 'relative', width: sizes.updPfpImg, height: sizes.updPfpImg }}>
          <Image
            source={pictureSource}
            style={{ borderRadius: 999, width: sizes.updPfpImg, height: sizes.updPfpImg }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />

          {!isUploadingPicture && (
            <View
              className="absolute bottom-0 right-0 items-center justify-center rounded-full bg-white shadow-sm"
              style={{
                width: scale(26),
                height: scale(26),
                borderWidth: 2,
                borderColor: '#fff',
              }}
            >
              <Image source={icons.edit} className="size-3" style={{ opacity: 0.6 }} />
            </View>
          )}

          {isUploadingPicture && (
            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/30">
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </View>
      </PressEffectWrapper>

      <View className="ml-4 flex-1 flex-col justify-between" style={{ height: sizes.updPfpImg }}>
        <Text className="font-quicksandBold text-dark" style={{ fontSize: scale(16) }}>
          {t('updatePfp.title')}
        </Text>

        <View
          className="flex-row items-center rounded-xl border border-lightBg bg-white px-4"
          style={{ borderRadius: scale(20), paddingVertical: scale(10) }}
        >
          <TextInput
            maxLength={50}
            hitSlop={20}
            onChangeText={setDraftName}
            placeholder={currentName || t('updatePfp.placeholder')}
            placeholderTextColor="rgba(33,37,41,0.4)"
            value={draftName}
            className="flex-1 font-quicksandMedium"
            style={{ fontSize: scale(17) }}
            accessibilityLabel={t('updatePfp.placeholder')}
            autoCapitalize="words"
          />
          <Image
            source={icons.edit}
            style={{ opacity: 0.2, width: scale(16), height: scale(16) }}
          />
        </View>

        <View className="flex-row items-center gap-4" style={{ height: sizes.actionBtnsH }}>
          <PressEffectWrapper
            fillAll={false}
            className="items-center rounded-full bg-dark px-6 py-2 shadow-sm"
            disabled={isSavingName}
            onPress={() => void saveName()}
          >
            {isSavingName ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="font-quicksandBold text-white" style={{ fontSize: type.base }}>
                {t('updatePfp.save')}
              </Text>
            )}
          </PressEffectWrapper>

          <PressEffectWrapper className="py-1" onPress={discardName} needPressInOut={false}>
            <Text className="font-quicksandMedium text-darkDisabled" style={{ fontSize: type.sm }}>
              {t('updatePfp.discard')}
            </Text>
          </PressEffectWrapper>
        </View>
      </View>
    </View>
  )
}
