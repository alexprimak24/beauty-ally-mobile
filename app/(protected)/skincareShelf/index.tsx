import { useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { scale } from '@/design/responsiveNew'
import { RoutineCalendar } from '@/features/skincareShelf/components/RoutineCalendar'
import { RoutineCompletionModal } from '@/features/skincareShelf/components/RoutineCompletionModal'
import { RoutineEntryActionsSheet } from '@/features/skincareShelf/components/RoutineEntryActionsSheet'
import { RoutineFastActions } from '@/features/skincareShelf/components/RoutineFastActions'
import { RoutineList } from '@/features/skincareShelf/components/RoutineList'
import { SkincareShelfGuides } from '@/features/skincareShelf/components/SkincareShelfGuides'
import { SkincareShelfTopBar } from '@/features/skincareShelf/components/SkincareShelfTopBar'
import { useSkincareShelfController } from '@/features/skincareShelf/hooks/useSkincareShelfController'

export default function MySkincareShelf() {
  const { height, width } = useWindowDimensions()
  const shelf = useSkincareShelfController()
  const actions = shelf.entryActions

  return (
    <>
      <View className="absolute top-0 z-0 h-1/2 w-full bg-lightBg" />
      <View className="absolute bottom-0 z-0 h-1/2 w-full bg-lightBg" />

      <SafeAreaView className="flex-1" edges={['top']}>
        <SkincareShelfTopBar
          dateLabel={shelf.dateLabel}
          onAddProduct={shelf.addProduct}
          onBack={shelf.goBack}
          onJumpToToday={shelf.jumpToToday}
          streak={shelf.routineCalendar?.current_streak ?? 0}
        />

        <RoutineList
          eveningEntries={shelf.eveningEntries}
          firstItemRef={shelf.firstItemRef}
          header={
            <View style={{ width: '100%', marginBottom: scale(8), paddingTop: scale(8) }}>
              <RoutineCalendar
                ref={shelf.calendarListRef}
                completionDays={shelf.routineCalendar?.days}
                onDayPress={shelf.selectDay}
                onViewableItemsChanged={shelf.onViewableWeeksChanged}
                selectedDate={shelf.selectedDate}
                viewabilityConfig={shelf.viewabilityConfig}
                weeks={shelf.weeks}
                width={width}
              />

              {shelf.isTodaySelected ? (
                <RoutineFastActions
                  expanded={shelf.isFastActionsExpanded}
                  onComplete={shelf.openCompletion}
                  onEditOrder={shelf.editOrder}
                  onToggleExpanded={() => shelf.setIsFastActionsExpanded((current) => !current)}
                />
              ) : null}
            </View>
          }
          isApplyDisabled={actions.isApplyDisabled}
          isDeleteDisabled={actions.isDeleteDisabled}
          isLoading={shelf.isLoadingRoutine}
          listRef={shelf.mainScrollRef}
          morningEntries={shelf.morningEntries}
          onApplyToggle={actions.toggleApplied}
          onDelete={actions.requestDelete}
          onEdit={actions.edit}
          onFavoriteToggle={actions.toggleFavorite}
          onLongPress={actions.openMenu}
          onPurchase={actions.purchase}
        />
      </SafeAreaView>

      <SkincareShelfGuides
        firstItemY={shelf.firstItemY}
        onDismissDateGuide={() => void shelf.dismissDateGuide()}
        onDismissSwipeGuide={() => void shelf.dismissSwipeGuide()}
        showDateGuide={shelf.showDateGuide}
        showSwipeGuide={shelf.showSwipeGuide}
      />

      <RoutineEntryActionsSheet
        entry={actions.selectedEntry}
        onClose={actions.closeMenu}
        onDelete={actions.deleteSelectedEntry}
        onEdit={actions.editSelectedEntry}
        onReorder={actions.reorderSelectedEntry}
        onViewProduct={actions.viewSelectedProduct}
        visible={actions.isMenuVisible}
      />

      <RoutineCompletionModal
        description={shelf.completionTheme.description}
        height={height}
        onClose={shelf.closeCompletion}
        onComplete={(type) => void shelf.completeRoutine(type)}
        themeColor={shelf.completionTheme.color}
        title={shelf.completionTheme.title}
        type={shelf.completionType}
      />
    </>
  )
}
