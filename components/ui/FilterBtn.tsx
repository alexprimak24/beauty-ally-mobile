import { clsx } from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text } from 'react-native'
import { useRTokens } from '@/design/useRTokens'
import { detectEntryStyle } from '@/utils/detectEntryStyle'
import { components } from '@/utils/i18n/keyConstants'
import PressEffectWrapper from './PressEffectWrapper'

interface FilterBtnProps {
  onPressScan: (filter: string) => void
  active?: boolean
  filter: string // canonical value your API expects ('' | 'Generally Suitable' | 'Might Not Align' | 'Low Match')
}

function FilterBtn({ onPressScan, active = false, filter }: FilterBtnProps) {
  const { t } = useTranslation(components)
  const { icon } = detectEntryStyle(filter)
  const { type } = useRTokens()

  // Map canonical value -> stable id used in i18n
  const idByValue: Record<string, 'generallySuitable' | 'mightNotAlign' | 'lowMatch' | undefined> =
    {
      'Generally Suitable': 'generallySuitable',
      'Might Not Align': 'mightNotAlign',
      'Low Match': 'lowMatch',
    }
  const verdictId = idByValue[filter]

  const label =
    filter === '' ? t('filter.all') : verdictId ? t(`filter.verdicts.${verdictId}`) : filter // fallback if an unknown filter sneaks in

  return (
    <PressEffectWrapper
      onPress={() => onPressScan(filter)}
      className={clsx(
        active ? 'bg-dark' : 'bg-white',
        'mr-4 flex-row items-center justify-center rounded-full px-6 py-2 text-center',
      )}
    >
      {icon && filter !== '' && (
        <Image source={icon} className={filter === 'Might Not Align' ? 'h-4 w-5' : 'h-5 w-5'} />
      )}
      <Text
        className={clsx(
          active ? 'text-white' : 'text-dark',
          filter !== '' && 'ml-2',
          'font-quicksandSemiBold',
        )}
        style={{ fontSize: type.base }}
      >
        {label}
      </Text>
    </PressEffectWrapper>
  )
}

export default FilterBtn
