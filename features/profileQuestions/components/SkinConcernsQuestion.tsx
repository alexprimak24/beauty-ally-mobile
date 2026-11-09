import { useTranslation } from 'react-i18next'
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import OptionPrimaryBtn from '@/components/ui/OptionPrimaryBtn'
import OtherInput from '@/components/ui/OtherInput'
import PrimaryBtn from '@/components/ui/PrimaryBtn'
import PrimaryContainer from '@/components/ui/PrimaryContainer'
import { skinConcernsOptions } from '@/constants/onboarding/onboardingData'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { onboarding } from '@/utils/i18n/keyConstants'
import { useMultiSelectQuestion } from '../hooks/useMultiSelectQuestion'
import type { ProfileQuestionVariant } from './ChoiceQuestion'

const skinConcernValues = skinConcernsOptions.map((option) => option.value)

interface SkinConcernsQuestionProps {
  disabled?: boolean
  initial?: string
  onConfirm: (value: string) => void | Promise<void>
  variant?: ProfileQuestionVariant
}

export function SkinConcernsQuestion({
  disabled = false,
  initial,
  onConfirm,
  variant = 'onboarding',
}: SkinConcernsQuestionProps) {
  const { other, select, selected, setOther, value } = useMultiSelectQuestion({
    exclusiveValue: 'none',
    initial,
    knownValues: skinConcernValues,
    supportsOther: true,
  })
  const { type } = useRTokens()
  const { t } = useTranslation(onboarding)
  const isOnboarding = variant === 'onboarding'

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <PrimaryContainer showHeader={isOnboarding}>
            <View
              className="flex-1 flex-col justify-between"
              style={{ paddingVertical: isOnboarding ? undefined : scale(40) }}
            >
              <View>
                <Text
                  className="mb-3 font-iSansM font-semibold text-dark"
                  style={{ fontSize: type.xl4 }}
                >
                  {t('skinConcerns.title')}
                </Text>
                <Text
                  className="mb-6 w-[85%] font-iSansM font-medium text-darkDisabled"
                  style={{ fontSize: type.base }}
                >
                  {t('skinConcerns.subtitle')}
                </Text>
              </View>

              <View className="mb-6 flex-1">
                <FlatList
                  data={skinConcernsOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item, index }) => (
                    <View>
                      <OptionPrimaryBtn
                        focused={selected.includes(item.value)}
                        onPress={() => select(item.value)}
                        text={t(item.label)}
                      />
                      {index === 0 ? (
                        <View
                          style={{
                            height: StyleSheet.hairlineWidth,
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            marginHorizontal: 32,
                            marginTop: -4,
                            marginBottom: 16,
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
                <OtherInput val={other} onChange={setOther} />
              </View>

              <PrimaryBtn
                disabled={!value || disabled}
                loading={disabled}
                onPress={() => void onConfirm(value)}
                text={t(isOnboarding ? 'actions.continue' : 'actions.update')}
              />
            </View>
          </PrimaryContainer>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
