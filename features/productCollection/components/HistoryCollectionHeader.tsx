import ErrorCard from '@/components/ui/ErrorCard'
import FilterOptions from '@/components/ui/FilterOptions'
import { SearchInput } from '@/components/ui/SearchInput'
import { main } from '@/utils/i18n/keyConstants'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

interface HistoryCollectionHeaderProps {
  hasError: boolean
  onFilterChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export function HistoryCollectionHeader({
  hasError,
  onFilterChange,
  onSearchChange,
}: HistoryCollectionHeaderProps) {
  const { t } = useTranslation(main)

  return (
    <>
      <View className="w-full items-center rounded-b-3xl px-4 pb-6">
        <SearchInput
          containerClassName="mb-8 mt-12 bg-white"
          iconColor="#212529"
          onQueryChange={onSearchChange}
          placeholder={t('history.searchPlaceholder')}
        />
        <FilterOptions onFilterChange={onFilterChange} />
      </View>
      {hasError ? <ErrorCard message={t('history.loadingErr')} /> : null}
    </>
  )
}
