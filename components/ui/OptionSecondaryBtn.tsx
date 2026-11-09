import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import { clsx } from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ImageSourcePropType } from 'react-native'
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

interface OptionSecondaryBtnProps {
  onPress: () => void
  focused: boolean
  text: string
  icon: ImageSourcePropType
  btnHeight?: number
  roundness?: number
  example?: string
  showDisclaimerTooltip?: boolean
  accessibilityLabel?: string
}

function OptionSecondaryBtn({
  onPress,
  focused,
  text,
  example,
  icon,
  btnHeight = 80,
  roundness = 20,
  showDisclaimerTooltip = false,
  accessibilityLabel,
}: OptionSecondaryBtnProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(components)

  const handleOnPress = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  return (
    <>
      <TouchableOpacity
        onPress={handleOnPress}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? text}
        className={clsx(
          focused ? 'bg-dark' : 'bg-lightBg',
          'mb-5 w-full flex-row items-center px-3 py-2',
        )}
        style={{
          height: scale(btnHeight),
          borderRadius: scale(roundness),
        }}
      >
        <Image
          source={icon}
          className="mr-4"
          style={{ width: sizes.secondaryBtnIcon, height: sizes.secondaryBtnIcon }}
        />

        <View className="flex-1 gap-2 pr-2">
          <Text
            className={clsx(focused ? 'text-white' : 'text-dark', 'font-quicksandBold font-bold')}
            style={{ fontSize: type.xl }}
          >
            {text}
          </Text>

          {!!example && (
            <View className="w-full">
              <Text
                className={clsx(focused ? 'text-white' : 'text-dark', 'font-iSansM font-medium')}
                style={{ fontSize: type.xs }}
              >
                <Text className="font-iSansSB font-semibold">
                  {t('optionSecondary.exampleLabel')}{' '}
                </Text>
                {example}
              </Text>
            </View>
          )}
        </View>
        {/* TOOLTIP USED TO BE NEEDED, NOW IDK, BUT LEAVE JUST IN CASE FOR FUTURE */}
        {/* {showDisclaimerTooltip && (
          <TouchableOpacity
            onPress={() => setShowTooltip(true)}
            accessibilityRole="button"
            accessibilityLabel={t('optionSecondary.tooltip.rxTitle')}
            className="ml-2 size-6 items-center justify-center rounded-full bg-white"
            style={{ backgroundColor: !focused ? '#424446' : '#fff' }}
          >
            <Image
              source={icons.information}
              tintColor={!focused ? '#fff' : '#424446'}
              className="h-[15px] w-[3px]"
            />
          </TouchableOpacity>
        )} */}
      </TouchableOpacity>

      {/* Tooltip Modal */}
      <Modal
        visible={showTooltip}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setShowTooltip(false)}
        >
          <View className="max-w-[320px] items-center justify-center gap-2 rounded-3xl border-2 border-primaryYellow bg-white px-6 py-4 shadow-lg">
            <Text className="text-center font-quicksand text-dark" style={{ fontSize: type.sm }}>
              <Text className="font-quicksandSemiBold">{t('optionSecondary.tooltip.rxTitle')}</Text>
              {'\n\n'}
              {t('optionSecondary.tooltip.rxBody')}
            </Text>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

export default OptionSecondaryBtn
