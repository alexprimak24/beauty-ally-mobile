import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import Slider from '@react-native-community/slider'

import PrimaryBtn from '@/components/ui/PrimaryBtn'
import PrimaryContainer from '@/components/ui/PrimaryContainer'
import { icons } from '@/constants/icons'
import { weatherOptions } from '@/constants/onboarding/onboardingData'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { onboarding } from '@/utils/i18n/keyConstants'
import { getClimateSelection, getInitialClimateSelection } from '../model'
import type { ProfileQuestionVariant } from './ChoiceQuestion'

interface ClimateQuestionProps {
  disabled?: boolean
  initial?: string
  onConfirm: (value: string) => void | Promise<void>
  variant?: ProfileQuestionVariant
}

export function ClimateQuestion({
  disabled = false,
  initial,
  onConfirm,
  variant = 'onboarding',
}: ClimateQuestionProps) {
  const [selection, setSelection] = useState(() => getInitialClimateSelection(initial))
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(onboarding)
  const isOnboarding = variant === 'onboarding'
  const option = weatherOptions[selection.index]

  useEffect(() => {
    if (!initial) return
    setSelection((current) => (current.value ? current : getInitialClimateSelection(initial)))
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
          <Trans ns={onboarding} i18nKey="weather.title" components={{ br: <Text>{'\n'}</Text> }} />
        </Text>

        <View className="flex-1 items-center justify-center pb-10">
          <Image
            source={option.icon}
            className="mb-2"
            style={{ width: sizes.pickIcon, height: sizes.pickIcon }}
          />
          <Text
            className="mb-1 font-quicksandBold font-bold text-dark"
            style={{ fontSize: type.xl3 }}
          >
            {t(option.label)}
          </Text>
          <Slider
            disabled={disabled}
            maximumValue={weatherOptions.length - 1}
            minimumTrackTintColor="#212529"
            minimumValue={0}
            onValueChange={(index) => setSelection(getClimateSelection(index))}
            step={1}
            style={{ width: '90%' }}
            thumbTintColor="#FFF"
            value={selection.index}
          />
          <View className="mt-12 min-h-[68px] w-[90%] items-center justify-center rounded-full bg-lightBg">
            <View className="absolute -top-6 z-10">
              <Image source={icons.notice} className="size-9" />
            </View>
            <View className="my-3 px-8">
              <Text
                className="text-center font-iSansM font-medium text-darkDisabled"
                style={{ fontSize: type.sm }}
              >
                <Trans
                  ns={onboarding}
                  i18nKey="weather.subtitle"
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
