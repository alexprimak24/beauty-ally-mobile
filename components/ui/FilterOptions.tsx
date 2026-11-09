import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { components } from '@/utils/i18n/keyConstants'
import FilterBtn from './FilterBtn'

interface FilterOptionsProps {
  onFilterChange: (filter: string) => void
}

function FilterOptions({ onFilterChange }: FilterOptionsProps) {
  const { t } = useTranslation(components)
  const [activeFilter, setActiveFilter] = useState('')

  // Internal keys -> canonical filter values you send to the API / list
  const verdictMap = {
    generallySuitable: 'Generally Suitable',
    mightNotAlign: 'Might Not Align',
    lowMatch: 'Low Match',
  } as const

  const filters: { label: string; value: string }[] = [
    { label: t('filter.all'), value: '' },
    { label: t('filter.verdicts.generallySuitable'), value: verdictMap.generallySuitable },
    { label: t('filter.verdicts.mightNotAlign'), value: verdictMap.mightNotAlign },
    { label: t('filter.verdicts.lowMatch'), value: verdictMap.lowMatch },
  ]

  const onPressScan = (filter: string) => {
    onFilterChange(filter)
    setActiveFilter(filter)
  }

  return (
    <View className="w-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="flex-row"
      >
        {filters.map((f) => (
          <FilterBtn
            key={f.value || 'all'}
            onPressScan={onPressScan}
            filter={f.value} // what the list logic expects
            active={activeFilter === f.value}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default FilterOptions
