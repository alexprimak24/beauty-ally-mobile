import { Trans, useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, View } from 'react-native'

import OptionSecondaryBtn from '@/components/ui/OptionSecondaryBtn'
import PrimaryBtn from '@/components/ui/PrimaryBtn'
import PrimaryContainer from '@/components/ui/PrimaryContainer'
import { currentTreatmentOptions } from '@/constants/onboarding/onboardingData'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { onboarding } from '@/utils/i18n/keyConstants'
import { useMultiSelectQuestion } from '../hooks/useMultiSelectQuestion'
import type { ProfileQuestionVariant } from './ChoiceQuestion'

const treatmentValues = currentTreatmentOptions.map((option) => option.value)

interface ActiveTreatmentsQuestionProps {
  disabled?: boolean
  initial?: string
  onConfirm: (value: string) => void | Promise<void>
  variant?: ProfileQuestionVariant
}

export function ActiveTreatmentsQuestion({
  disabled = false,
  initial,
  onConfirm,
  variant = 'onboarding',
}: ActiveTreatmentsQuestionProps) {
  const { select, selected, value } = useMultiSelectQuestion({
    exclusiveValue: 'no',
    initial,
    knownValues: treatmentValues,
  })
  const { type } = useRTokens()
  const { t } = useTranslation(onboarding)
  const isOnboarding = variant === 'onboarding'

  return (
    <PrimaryContainer showHeader={isOnboarding}>
      <View
        className="flex-1 flex-col"
        style={{ paddingVertical: isOnboarding ? undefined : scale(40) }}
      >
        <View>
          <Text className="mb-3 font-iSansM font-medium text-dark" style={{ fontSize: type.xl4 }}>
            <Trans
              ns={onboarding}
              i18nKey="currentTreatment.title"
              components={{ strong: <Text className="font-isSansB font-bold" /> }}
            />
          </Text>
          <Text
            className="mb-6 w-[85%] font-iSansM font-medium text-darkDisabled"
            style={{ fontSize: type.base }}
          >
            {t('currentTreatment.subtitle')}
          </Text>
        </View>

        <View className="mb-6 flex-1">
          <FlatList
            data={currentTreatmentOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item, index }) => (
              <View>
                <OptionSecondaryBtn
                  example={item.explanation ? t(item.explanation) : ''}
                  focused={selected.includes(item.value)}
                  icon={item.icon}
                  onPress={() => select(item.value)}
                  showDisclaimerTooltip={item.tooltipNeeded}
                  text={t(item.label)}
                />
                {index === 0 ? (
                  <View
                    style={{
                      height: StyleSheet.hairlineWidth,
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      marginHorizontal: scale(32),
                      marginTop: -scale(4),
                      marginBottom: scale(16),
                    }}
                  />
                ) : null}
              </View>
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
