import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import PrimaryBtn from '@/components/ui/PrimaryBtn'
import Container from '@/components/ui/PrimaryContainer'
import { scale } from '@/design/responsiveNew'
import { PurchaseLinkInfoModal } from '@/features/scanDetails/components/PurchaseLinkInfoModal'
import { ScanDetailsFields } from '@/features/scanDetails/components/ScanDetailsFields'
import { ScanDetailsHeader } from '@/features/scanDetails/components/ScanDetailsHeader'
import { ScanDetailsProductImage } from '@/features/scanDetails/components/ScanDetailsProductImage'
import { ScanDetailsRoutineSchedule } from '@/features/scanDetails/components/ScanDetailsRoutineSchedule'
import { scanDetailsText } from '@/features/scanDetails/constants'
import { useScanDetailsEditor } from '@/features/scanDetails/hooks/useScanDetailsEditor'
import { main } from '@/utils/i18n/keyConstants'

export default function ScanDetailsScreen() {
  const { t } = useTranslation(main)
  const editor = useScanDetailsEditor()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Container showHeader={false}>
        <ScanDetailsHeader />

        <View className="flex-1 flex-col justify-between">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: scale(20) }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ScanDetailsProductImage
              imageUri={editor.productCheck?.frontImage}
              isUploading={editor.isUploading}
              onPress={() => void editor.pickImage()}
            />

            <View className="gap-y-5 space-y-5 px-2">
              <ScanDetailsFields
                link={editor.link}
                name={editor.name}
                onLinkChange={editor.setLink}
                onNameChange={editor.setName}
                onOpenLinkInfo={editor.openInfoModal}
                shouldHighlightUrl={editor.shouldHighlightUrl}
              />

              {editor.isFromShelf ? (
                <ScanDetailsRoutineSchedule
                  onFrequencyChange={editor.setRoutineFrequency}
                  onTogglePeriod={editor.toggleRoutinePeriod}
                  onToggleWeekday={editor.toggleRoutineWeekday}
                  schedule={editor.schedule}
                />
              ) : null}
            </View>
          </ScrollView>

          <View className="px-2 pb-8 pt-4">
            <PrimaryBtn
              disabled={editor.isSaveDisabled}
              loading={editor.isSaving}
              onPress={() => void editor.save()}
              text={t(scanDetailsText.buttons.save)}
            />
          </View>
        </View>

        {editor.isInfoModalVisible ? (
          <PurchaseLinkInfoModal onClose={editor.closeInfoModal} visible />
        ) : null}
      </Container>
    </KeyboardAvoidingView>
  )
}
