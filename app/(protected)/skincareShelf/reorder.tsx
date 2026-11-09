import { View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import LoadingSecondarySpinner from '@/components/ui/LoadingSecondaryIndicator'
import { ReorderRoutineHeader } from '@/features/skincareShelf/components/ReorderRoutineHeader'
import { ReorderRoutineList } from '@/features/skincareShelf/components/ReorderRoutineList'
import { ReorderRoutineSectionHeader } from '@/features/skincareShelf/components/ReorderRoutineSectionHeader'
import { RoutineTypeToggle } from '@/features/skincareShelf/components/RoutineTypeToggle'
import { useReorderRoutine } from '@/features/skincareShelf/hooks/useReorderRoutine'

export default function ReorderRoutineScreen() {
  const insets = useSafeAreaInsets()
  const reorder = useReorderRoutine()

  return (
    <>
      <View className="absolute inset-0 bg-lightBg" />
      <SafeAreaView className="flex-1 bg-lightBg" edges={['top']}>
        <ReorderRoutineHeader
          canSave={reorder.hasChanges}
          isSaving={reorder.isSaving}
          onBack={reorder.onBack}
          onSave={() => void reorder.save()}
        />

        {reorder.isLoading ? (
          <View className="flex-1 justify-center">
            <LoadingSecondarySpinner />
          </View>
        ) : (
          <>
            <RoutineTypeToggle value={reorder.selectedSection} onChange={reorder.switchSection} />
            <ReorderRoutineSectionHeader type={reorder.selectedSection} />
            <ReorderRoutineList
              bottomInset={insets.bottom}
              data={reorder.entries}
              listRevision={reorder.listRevision}
              onDragEnd={reorder.reorderEntries}
              section={reorder.selectedSection}
            />
          </>
        )}
      </SafeAreaView>
    </>
  )
}
