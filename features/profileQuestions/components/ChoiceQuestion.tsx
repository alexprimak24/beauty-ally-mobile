import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { FlatList, Text, View } from 'react-native'

import OptionPrimaryBtn from '@/components/ui/OptionPrimaryBtn'
import PrimaryBtn from '@/components/ui/PrimaryBtn'
import PrimaryContainer from '@/components/ui/PrimaryContainer'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { onboarding } from '@/utils/i18n/keyConstants'

export type ProfileQuestionVariant = 'edit' | 'onboarding'

interface ChoiceOption {
  explanation?: string | null
  label: string
  value: string
}

interface ChoiceQuestionProps {
  disabled?: boolean
  initial?: string
  onConfirm: (value: string) => void | Promise<void>
  options: readonly ChoiceOption[]
  subtitleKey?: string
  titleKey: string
  variant?: ProfileQuestionVariant
}

export function ChoiceQuestion({
  disabled = false,
  initial,
  onConfirm,
  options,
  subtitleKey,
  titleKey,
  variant = 'onboarding',
}: ChoiceQuestionProps) {
  const [value, setValue] = useState(initial ?? '')
  const { type } = useRTokens()
  const { t } = useTranslation(onboarding)
  const isOnboarding = variant === 'onboarding'

  useEffect(() => {
    if (!initial) return
    setValue((current) => current || initial)
  }, [initial])

  return (
    <PrimaryContainer showHeader={isOnboarding}>
      <View
        className="flex-1 flex-col justify-between"
        style={{ paddingVertical: isOnboarding ? undefined : scale(40) }}
      >
        <View>
          <Text className="mb-3 font-iSansM font-medium text-dark" style={{ fontSize: type.xl4 }}>
            {t(titleKey)}
          </Text>
          {isOnboarding && subtitleKey ? (
            <Text
              className="mb-6 w-[85%] font-iSansM font-medium text-darkDisabled"
              style={{ fontSize: type.base }}
            >
              <Trans
                ns={onboarding}
                i18nKey={subtitleKey}
                components={{ br: <Text>{'\n'}</Text> }}
              />
            </Text>
          ) : null}
        </View>

        <View className="mb-6 flex-1">
          <FlatList
            data={options}
            keyExtractor={(option) => option.value}
            renderItem={({ item }) => (
              <OptionPrimaryBtn
                disabled={disabled}
                explanation={item.explanation ? t(item.explanation) : null}
                focused={value === item.value}
                onPress={() => setValue(item.value)}
                text={t(item.label)}
              />
            )}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingVertical: 5,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <PrimaryBtn
          disabled={!value || disabled}
          loading={disabled}
          onPress={() => void onConfirm(value)}
          text={t(isOnboarding ? 'actions.continue' : 'actions.update')}
        />
      </View>
    </PrimaryContainer>
  )
}
