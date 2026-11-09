import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import Slider from '@react-native-community/slider'

import PrimaryBtn from '@/components/ui/PrimaryBtn'
import PrimaryContainer from '@/components/ui/PrimaryContainer'
import { icons } from '@/constants/icons'
import { sunscreenFreqOptions } from '@/constants/onboarding/onboardingData'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { onboarding } from '@/utils/i18n/keyConstants'
import { getInitialSunscreenSelection, getSunscreenSelection } from '../model'
import type { ProfileQuestionVariant } from './ChoiceQuestion'

interface SunscreenQuestionProps {
  disabled?: boolean
  initial?: string
  onConfirm: (value: string) => void | Promise<void>
  variant?: ProfileQuestionVariant
}

export function SunscreenQuestion({
  disabled = false,
  initial,
  onConfirm,
  variant = 'onboarding',
}: SunscreenQuestionProps) {
  const [selection, setSelection] = useState(() => getInitialSunscreenSelection(initial))
  const { type } = useRTokens()
  const { t } = useTranslation(onboarding)
  const isOnboarding = variant === 'onboarding'
  const option = sunscreenFreqOptions[selection.index]

  useEffect(() => {
    if (!initial) return
    setSelection((current) => (current.value ? current : getInitialSunscreenSelection(initial)))
  }, [initial])

  return (
    <PrimaryContainer showHeader={isOnboarding}>
      <View
        className="flex-1 flex-col justify-between"
        style={{ paddingVertical: isOnboarding ? undefined : scale(40) }}
      >
        <Text
          className="mb-3 mt-2 font-iSansM font-medium text-dark"
          style={{ fontSize: type.xl4 }}
        >
          <Trans
            ns={onboarding}
            i18nKey="sunscreenUsage.title"
            components={{ br: <Text>{'\n'}</Text> }}
          />
        </Text>

        <View className="flex-1 items-center justify-center pb-10">
          <Text
            className="mb-6 font-quicksandBold font-bold text-dark"
            style={{ fontSize: type.xl2 }}
          >
            {t(option.label)}
          </Text>
          <Slider
            disabled={disabled}
            maximumValue={sunscreenFreqOptions.length - 1}
            minimumTrackTintColor="#212529"
            minimumValue={0}
            onValueChange={(index) => setSelection(getSunscreenSelection(index))}
            step={1}
            style={{ width: '90%' }}
            thumbTintColor="#FFF"
            value={selection.index}
          />
          <View className="mt-12 min-h-[55px] w-[90%] items-center rounded-full bg-lightBg text-center">
            <View className="absolute -top-6 z-10">
              <Image source={icons.notice} className="size-9" />
            </View>
            <View className="my-3 flex-1 justify-center px-8">
              <Text
                className="text-center font-iSansM font-medium text-darkDisabled"
                style={{ fontSize: type.sm }}
              >
                <Trans
                  ns={onboarding}
                  i18nKey="sunscreenUsage.subtitle"
                  components={{ br: <Text>{'\n'}</Text> }}
                />
              </Text>
            </View>
          </View>
        </View>

        <PrimaryBtn
          disabled={!selection.value || disabled}
          loading={disabled}
          onPress={() => void onConfirm(selection.value)}
          text={t(isOnboarding ? 'actions.continue' : 'actions.update')}
        />
      </View>
    </PrimaryContainer>
  )
}
