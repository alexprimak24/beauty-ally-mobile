import ScanGuideOverlay from '@/features/scan/components/ScanGuideOverlay'
import ScanProcessingOverlay from '@/features/scan/components/ScanProcessingOverlay'
import { SlideMessage } from '@/features/scan/components/SlideMessage'
import { ScanCameraOverlay } from '@/features/scan/components/ScanCameraOverlay'
import { ScanPermissionView } from '@/features/scan/components/ScanPermissionView'
import { useScanController } from '@/features/scan/hooks/useScanController'
import { main } from '@/utils/i18n/keyConstants'
import { CameraView } from 'expo-camera'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

export default function PremiumCameraScreen() {
  const { t } = useTranslation(main)
  const scan = useScanController()

  if (!scan.cameraPermission) return null
  if (!scan.cameraPermission.granted) {
    return <ScanPermissionView onRequest={scan.requestCameraPermissionOrSettings} />
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        key={scan.facing}
        ref={scan.cameraRef}
        facing={scan.facing}
        onCameraReady={scan.onCameraReady}
        onMountError={scan.handleCameraMountError}
        pictureSize={scan.pictureSize}
        style={StyleSheet.absoluteFill}
      />

      <ScanCameraOverlay
        freeRemaining={scan.freeRemaining}
        isCameraBusy={scan.isCapturing}
        isFast={scan.isFast}
        isModeMenuOpen={scan.isModeMenuOpen}
        isModeReady={scan.isModeReady}
        isShutterReady={scan.cameraReady}
        onClose={scan.close}
        onDismissModeMenu={scan.dismissModeMenu}
        onFlipCamera={scan.flipCamera}
        onOpenGallery={scan.openGallery}
        onOpenInfo={scan.openGuide}
        onSelectMode={scan.selectMode}
        onTakePhoto={scan.takePhoto}
        onToggleModeMenu={scan.toggleModeMenu}
        photoStep={scan.photoStep}
        scanMode={scan.scanMode}
      />

      <SlideMessage
        message={t('scan.transitions.frontCaptured')}
        setVisible={scan.setShowTransitionMessage}
        visible={scan.showTransitionMessage}
      />
      <ScanProcessingOverlay
        preset={scan.processingPreset ?? 'front'}
        visible={scan.processingPreset !== null}
      />
      <ScanGuideOverlay onClose={scan.closeGuide} visible={scan.showGuide} />
    </View>
  )
}
