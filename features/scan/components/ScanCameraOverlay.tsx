import { AnimatedPressable } from '@/components/ui/AnimatedPressable'
import SafeBlur from '@/components/ui/SafeBlur'
import { isTablet, scale, SCREEN_WIDTH } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import Animated, { Easing, FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getFreeScanStatusColor } from '../model'
import type { ScanModeSelection, ScanPhotoStep } from '../types'

interface ScanCameraOverlayProps {
  freeRemaining: number | null
  isFast: boolean
  isCameraBusy: boolean
  isModeMenuOpen: boolean
  isModeReady: boolean
  isShutterReady: boolean
  onClose: () => void
  onDismissModeMenu: () => void
  onFlipCamera: () => void
  onOpenGallery: () => void
  onOpenInfo: () => void
  onSelectMode: (mode: ScanModeSelection) => void
  onTakePhoto: () => void
  onToggleModeMenu: () => void
  photoStep: ScanPhotoStep
  scanMode: ScanModeSelection
}

export const ScanCameraOverlay = memo(function ScanCameraOverlay({
  freeRemaining,
  isFast,
  isCameraBusy,
  isModeMenuOpen,
  isModeReady,
  isShutterReady,
  onClose,
  onDismissModeMenu,
  onFlipCamera,
  onOpenGallery,
  onOpenInfo,
  onSelectMode,
  onTakePhoto,
  onToggleModeMenu,
  photoStep,
  scanMode,
}: ScanCameraOverlayProps) {
  const { t } = useTranslation(main)

  return (
    <SafeAreaView style={styles.uiOverlay} pointerEvents="box-none">
      <View style={styles.topHeaderRow}>
        <View style={styles.modeTriggerContainer}>
          <AnimatedPressable disabled={!isModeReady} onPress={onToggleModeMenu}>
            <SafeBlur intensity={30} tint="dark" style={styles.modeTrigger}>
              <Ionicons
                name={isFast ? 'flash-outline' : 'images-outline'}
                size={scale(20)}
                color="white"
              />
              <Ionicons
                name={isModeMenuOpen ? 'chevron-up' : 'chevron-down'}
                size={scale(16)}
                color="rgba(255,255,255,0.9)"
              />
            </SafeBlur>
          </AnimatedPressable>
        </View>

        {typeof freeRemaining === 'number' && freeRemaining > 0 && (
          <View style={styles.headerCenterAbsolute} pointerEvents="box-none">
            <AnimatedPressable activeScale={0.94}>
              <SafeBlur intensity={30} tint="dark" style={styles.statusPill}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getFreeScanStatusColor(freeRemaining) },
                  ]}
                />
                <Text style={styles.statusText}>
                  {t('scan.badges.freeLeft', { count: freeRemaining })}
                </Text>
              </SafeBlur>
            </AnimatedPressable>
          </View>
        )}

        <AnimatedPressable onPress={onClose}>
          <SafeBlur intensity={30} tint="dark" style={styles.glassIconContainer}>
            <Ionicons name="close" size={scale(26)} color="white" />
          </SafeBlur>
        </AnimatedPressable>
      </View>

      {isModeMenuOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={onDismissModeMenu} />
          <Animated.View
            entering={FadeInUp.duration(250).easing(Easing.bezier(0.25, 1, 0.5, 1))}
            exiting={FadeOutUp.duration(200).easing(Easing.bezier(0.25, 1, 0.5, 1))}
            style={styles.modeMenuWrap}
          >
            <SafeBlur intensity={40} tint="dark" style={styles.modeMenu}>
              <AnimatedPressable
                activeScale={0.96}
                style={styles.modeItem}
                onPress={() => onSelectMode('two_step')}
              >
                <View style={styles.modeItemLeft}>
                  <Ionicons name="copy-outline" size={scale(18)} color="white" />
                  <Text style={styles.modeItemText}>{t('scan.dropdown.twoStepScan')}</Text>
                </View>
                {scanMode === 'two_step' && (
                  <Ionicons name="checkmark" size={scale(18)} color="white" />
                )}
              </AnimatedPressable>

              <AnimatedPressable
                activeScale={0.96}
                style={styles.modeItem}
                onPress={() => onSelectMode('fast')}
              >
                <View style={styles.modeItemLeft}>
                  <Ionicons name="flash-outline" size={scale(18)} color="white" />
                  <Text style={styles.modeItemText}>{t('scan.dropdown.fastStepScan')}</Text>
                </View>
                {scanMode === 'fast' && (
                  <Ionicons name="checkmark" size={scale(18)} color="white" />
                )}
              </AnimatedPressable>

              <View style={styles.modeMenuDivider} />

              <AnimatedPressable activeScale={0.96} style={styles.modeItem} onPress={onOpenInfo}>
                <View style={styles.modeItemLeft}>
                  <Ionicons name="information-circle-outline" size={scale(18)} color="white" />
                  <Text style={styles.modeItemText}>{t('scan.dropdown.howTo')}</Text>
                </View>
              </AnimatedPressable>
            </SafeBlur>
          </Animated.View>
        </>
      )}

      <View style={styles.scannerContainer} pointerEvents="none">
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>

      <View style={styles.bottomSection}>
        <SafeBlur intensity={40} tint="dark" style={styles.instructionPill}>
          <Text style={styles.instructionText}>
            {isFast
              ? t('scan.steps.fast')
              : photoStep === 'front'
                ? t('scan.steps.front')
                : t('scan.steps.back')}
          </Text>
        </SafeBlur>

        <View style={styles.controlsRow}>
          <AnimatedPressable disabled={isCameraBusy} onPress={onOpenGallery}>
            <SafeBlur intensity={40} tint="light" style={styles.glassButtonLarge}>
              <Ionicons name="image" size={scale(28.5)} color="#FFF" />
            </SafeBlur>
          </AnimatedPressable>

          <AnimatedPressable
            disabled={isCameraBusy || !isShutterReady}
            style={
              isCameraBusy || !isShutterReady
                ? [styles.shutterContainer, styles.disabledControl]
                : styles.shutterContainer
            }
            onPress={onTakePhoto}
          >
            <View style={styles.shutterOuterRing}>
              <View style={styles.shutterInnerCircle} />
            </View>
          </AnimatedPressable>

          <AnimatedPressable disabled={isCameraBusy} onPress={onFlipCamera}>
            <SafeBlur intensity={40} tint="dark" style={styles.glassButtonLarge}>
              <Ionicons name="camera-reverse" size={scale(31)} color="#FFF" />
            </SafeBlur>
          </AnimatedPressable>
        </View>
      </View>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  disabledControl: {
    opacity: 0.55,
  },
  uiOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 10 : 10,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    height: scale(48),
    width: '100%',
  },
  modeTriggerContainer: {
    position: 'relative',
  },
  headerCenterAbsolute: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  glassIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    height: scale(40),
    borderRadius: scale(20),
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.2)',
    gap: 8,
  },
  statusDot: {
    width: scale(6.6),
    height: scale(6.6),
    borderRadius: scale(3.3),
  },
  statusText: {
    color: 'white',
    fontSize: scale(14),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  scannerContainer: {
    flex: 1,
    alignSelf: 'center',
    width: isTablet ? 500 : SCREEN_WIDTH - scale(50),
    marginTop: scale(60.5),
    marginBottom: scale(49.5),
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: scale(55),
    height: scale(55),
    borderColor: 'rgba(255,255,255,0.9)',
    borderWidth: 4,
    borderRadius: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 35 },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 35,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 35,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 35,
  },
  bottomSection: {
    paddingBottom: scale(33),
    alignItems: 'center',
    gap: scale(33),
  },
  instructionPill: {
    paddingHorizontal: scale(22.4),
    paddingVertical: scale(15.4),
    borderRadius: scale(33),
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
    maxWidth: '90%',
  },
  instructionText: {
    color: '#E0E0E0',
    fontSize: scale(15),
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: isTablet ? 500 : '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  glassButtonLarge: {
    width: scale(61.6),
    height: scale(61.6),
    borderRadius: scale(30.8),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  shutterContainer: {
    marginBottom: 10,
  },
  shutterOuterRing: {
    width: scale(92.4),
    height: scale(92.4),
    borderRadius: scale(46.2),
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerCircle: {
    width: scale(72.6),
    height: scale(72.6),
    borderRadius: scale(36.3),
    backgroundColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modeTrigger: {
    minWidth: scale(56),
    height: scale(48),
    borderRadius: scale(24),
    overflow: 'hidden',
    paddingHorizontal: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modeMenuWrap: {
    position: 'absolute',
    top: scale(74),
    left: 0,
    zIndex: 50,
  },
  modeMenu: {
    width: scale(190),
    borderRadius: scale(20),
    paddingVertical: scale(8),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(20,20,20,0.35)',
  },
  modeItem: {
    minHeight: scale(44),
    paddingHorizontal: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  modeItemText: {
    color: 'white',
    fontSize: scale(14),
    fontFamily: 'Quicksand-Bold',
  },
  modeMenuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: scale(6),
    marginHorizontal: scale(12),
  },
})
