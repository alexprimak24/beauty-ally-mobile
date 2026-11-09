import EmptyMySkincareCard from './EmptyMySkincareCard'
import LoadingBlueSpinner from '@/components/ui/LoadingBlueSpinner'
import SkincareRoutineRow from './SkincareShelfEntry'
import { scale } from '@/design/responsiveNew'
import type { ReactElement, RefObject } from 'react'
import { useCallback, useMemo } from 'react'
import type { SectionList as SectionListInstance, ViewInstance } from 'react-native'
import { Platform, SectionList, View } from 'react-native'

import { skincareShelfColors } from '../constants'
import type { RoutineType, ShelfEntryItem } from '../types'
import { RoutineSectionHeader } from './RoutineSectionHeader'

export interface RoutineSection {
  data: ShelfEntryItem[]
  type: RoutineType
}

interface RoutineListProps {
  eveningEntries: ShelfEntryItem[]
  firstItemRef: RefObject<ViewInstance | null>
  header: ReactElement
  isApplyDisabled: boolean
  isDeleteDisabled: boolean
  isLoading: boolean
  listRef: RefObject<SectionListInstance<ShelfEntryItem, RoutineSection> | null>
  morningEntries: ShelfEntryItem[]
  onApplyToggle: (entry: ShelfEntryItem) => void
  onDelete: (entry: ShelfEntryItem) => void
  onEdit: (entry: ShelfEntryItem) => void
  onFavoriteToggle: (entry: ShelfEntryItem) => void
  onLongPress: (entry: ShelfEntryItem) => void
  onPurchase: (entry: ShelfEntryItem) => void
}

export function RoutineList({
  eveningEntries,
  firstItemRef,
  header,
  isApplyDisabled,
  isDeleteDisabled,
  isLoading,
  listRef,
  morningEntries,
  onApplyToggle,
  onDelete,
  onEdit,
  onFavoriteToggle,
  onLongPress,
  onPurchase,
}: RoutineListProps) {
  const sections = useMemo<RoutineSection[]>(() => {
    const nextSections: RoutineSection[] = []
    if (morningEntries.length) nextSections.push({ data: morningEntries, type: 'morning' })
    if (eveningEntries.length) nextSections.push({ data: eveningEntries, type: 'evening' })
    return nextSections
  }, [eveningEntries, morningEntries])

  const renderItem = useCallback(
    ({
      index,
      item,
      section,
    }: {
      index: number
      item: ShelfEntryItem
      section: RoutineSection
    }) => {
      const isFirstVisibleEntry =
        index === 0 &&
        (section.type === 'morning' || (section.type === 'evening' && morningEntries.length === 0))

      return (
        <View
          ref={isFirstVisibleEntry ? firstItemRef : undefined}
          collapsable={false}
          style={{ paddingHorizontal: scale(16), paddingBottom: scale(8) }}
        >
          <SkincareRoutineRow
            entry={item}
            isApplyDisabled={isApplyDisabled}
            isDeleteDisabled={isDeleteDisabled}
            isInteractive
            isLastItem={index === section.data.length - 1}
            onApplyToggle={onApplyToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onFavoriteToggle={onFavoriteToggle}
            onLongPressOptions={onLongPress}
            onPressPurchase={onPurchase}
          />
        </View>
      )
    },
    [
      firstItemRef,
      isApplyDisabled,
      isDeleteDisabled,
      morningEntries.length,
      onApplyToggle,
      onDelete,
      onEdit,
      onFavoriteToggle,
      onLongPress,
      onPurchase,
    ],
  )

  return (
    <SectionList
      ref={listRef}
      contentContainerStyle={{
        backgroundColor: skincareShelfColors.lightBg,
        flexGrow: 1,
        paddingBottom: scale(100),
      }}
      initialNumToRender={4}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        isLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <LoadingBlueSpinner />
          </View>
        ) : (
          <View className="flex-1 py-10">
            <EmptyMySkincareCard />
          </View>
        )
      }
      ListHeaderComponent={header}
      maxToRenderPerBatch={4}
      removeClippedSubviews={Platform.OS === 'android'}
      renderItem={renderItem}
      renderSectionHeader={({ section }) => <RoutineSectionHeader type={section.type} />}
      sections={sections}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      updateCellsBatchingPeriod={40}
      windowSize={5}
    />
  )
}
