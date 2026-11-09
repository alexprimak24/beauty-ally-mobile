import type { ProcessingPreset } from '../components/ScanProcessingOverlay'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useUploadFastScanPhoto } from '@/hooks/useUploadFastScanPhoto'
import { uploadBackPhoto } from '@/services/uploadBackPhoto'
import { uploadBothPhotos } from '@/services/uploadBothPhotos'
import { uploadFrontPhoto } from '@/services/uploadFrontPhoto'
import { analyticsEvents } from '@/utils/analytics'
import { main } from '@/utils/i18n/keyConstants'
import { ERROR_KEYS_OBJ, showErrorToast, showRequestErrorToast } from '@/utils/showErrorToast'
import { useAuth } from '@clerk/expo'
import type { CameraType } from 'expo-camera'
import { CameraView } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useIncomingShare } from 'expo-sharing'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { scanRoutes } from '../constants'
import { getLargestPictureSize } from '../model'
import type { ScanAttemptContext, ScanMode, ScanPhotoStep, ScanSource } from '../types'
import { useScanAccess } from './useScanAccess'
import { useScanPolling } from './useScanPolling'
import { useScanPreferences } from './useScanPreferences'

export function useScanController() {
  const { getToken } = useAuth()
  const router = useRouter()
  const { t } = useTranslation(main)
  const analytics = useAnalytics()
  const { uploadFastScanPhoto } = useUploadFastScanPhoto()
  const cameraRef = useRef<CameraView>(null)
  const captureInFlightRef = useRef(false)
  const processedShareKeyRef = useRef<string | null>(null)
  const attemptRef = useRef<ScanAttemptContext>({ source: null, mode: null })

  const [facing, setFacing] = useState<CameraType>('back')
  const [processingPreset, setProcessingPreset] = useState<ProcessingPreset | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [pictureSize, setPictureSize] = useState<string>()
  const [frontUri, setFrontUri] = useState<string | null>(null)
  const [backUri, setBackUri] = useState<string | null>(null)
  const [photoStep, setPhotoStep] = useState<ScanPhotoStep>('front')
  const [scanId, setScanId] = useState<string | null>(null)
  const [showTransitionMessage, setShowTransitionMessage] = useState(false)

  const resetTwoStepState = useCallback(() => {
    setPhotoStep('front')
    setScanId(null)
    setFrontUri(null)
    setBackUri(null)
  }, [])
  const preferences = useScanPreferences(resetTwoStepState)
  const {
    cameraPermission,
    canStartScan,
    ensureGalleryPermission,
    freeRemaining,
    requestCameraPermissionOrSettings,
  } = useScanAccess(captureInFlightRef)

  const beginScanAttempt = useCallback(
    (source: ScanSource, mode: ScanMode) => {
      attemptRef.current = { source, mode }
      analytics.capture(analyticsEvents.scanStarted, { source, mode })
    },
    [analytics],
  )
  const resetScanAttempt = useCallback(() => {
    attemptRef.current = { source: null, mode: null }
  }, [])
  const handlePollingFailure = useCallback(() => setProcessingPreset(null), [])
  const { startPolling } = useScanPolling({
    attemptRef,
    backUri,
    frontUri,
    onFailed: handlePollingFailure,
    resetAttempt: resetScanAttempt,
  })
  const { resolvedSharedPayloads, isResolving, clearSharedPayloads } = useIncomingShare()

  const close = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.push(scanRoutes.home)
  }, [router])

  const onCameraReady = useCallback(async () => {
    setCameraReady(true)
    try {
      const sizes = await cameraRef.current?.getAvailablePictureSizesAsync()
      if (sizes?.length) setPictureSize(getLargestPictureSize(sizes))
    } catch (error) {
      console.warn('getAvailablePictureSizesAsync failed', error)
    }
  }, [])

  const runFastScan = useCallback(
    async (imageUri: string | null, source: ScanSource) => {
      try {
        beginScanAttempt(source, 'fast')
        setProcessingPreset('both')
        const response = await uploadFastScanPhoto({ img_uri: imageUri })
        setFrontUri(imageUri)
        startPolling(response.scan_id)
        return true
      } catch (error) {
        console.error('fast scan upload failed', error)
        showRequestErrorToast(error)
        setProcessingPreset(null)
        resetScanAttempt()
        return false
      }
    },
    [beginScanAttempt, resetScanAttempt, startPolling, uploadFastScanPhoto],
  )

  const runSharedTwoStepScan = useCallback(
    async (
      frontImageUri: string | null,
      backImageUri: string | null,
      rethrowUploadError = false,
    ) => {
      try {
        beginScanAttempt('gallery', 'both')
        setProcessingPreset('both')
        const response = await uploadBothPhotos(getToken, frontImageUri, backImageUri)
        if (!response?.success) {
          setProcessingPreset(null)
          resetScanAttempt()
          return false
        }

        setFrontUri(frontImageUri)
        setBackUri(backImageUri)
        startPolling(response.data.scan_id)
        return true
      } catch (error) {
        console.error('gallery pick/upload failed', error)
        setProcessingPreset(null)
        resetScanAttempt()
        if (rethrowUploadError) throw error
        showRequestErrorToast(error)
        return false
      }
    },
    [beginScanAttempt, getToken, resetScanAttempt, startPolling],
  )

  const openGallery = useCallback(async () => {
    if (!canStartScan() || !(await ensureGalleryPermission())) return

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: preferences.isFast ? 1 : 2,
        exif: true,
        quality: 0.9,
        orderedSelection: true,
      })
      if (result.canceled || !result.assets.length) return

      if (preferences.isFast) {
        const succeeded = await runFastScan(result.assets[0].uri, 'gallery')
        if (succeeded) clearSharedPayloads()
        return
      }
      if (result.assets.length < 2) {
        showErrorToast(ERROR_KEYS_OBJ.bothImagesReq)
        return
      }

      const [frontImage, backImage] = result.assets
      const succeeded = await runSharedTwoStepScan(frontImage.uri, backImage.uri, true)
      if (succeeded) clearSharedPayloads()
    } catch (error) {
      console.error('gallery pick/upload failed', error)
      Alert.alert(
        t('scan.alerts.upload.galleryErrorTitle'),
        t('scan.alerts.upload.galleryErrorBody'),
        [
          {
            text: t('scan.alerts.ok'),
            onPress: () => router.replace({ pathname: '/scan', params: { side: 'front' } }),
          },
        ],
      )
      setProcessingPreset(null)
      resetScanAttempt()
    }
  }, [
    clearSharedPayloads,
    preferences.isFast,
    resetScanAttempt,
    router,
    runFastScan,
    runSharedTwoStepScan,
    canStartScan,
    ensureGalleryPermission,
    t,
  ])

  const flipCamera = useCallback(() => {
    if (captureInFlightRef.current) return
    setCameraReady(false)
    setPictureSize(undefined)
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }, [])

  const takePhoto = useCallback(async () => {
    if (!canStartScan() || !cameraReady || !cameraRef.current) return

    captureInFlightRef.current = true
    setIsCapturing(true)
    setProcessingPreset(preferences.isFast ? 'both' : photoStep === 'back' ? 'back' : 'front')

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9, exif: true })
      if (!photo?.uri) {
        setProcessingPreset(null)
        showErrorToast(ERROR_KEYS_OBJ.captureError)
        return
      }
      if (preferences.isFast) {
        const succeeded = await runFastScan(photo.uri, 'camera')
        if (succeeded) clearSharedPayloads()
        return
      }
      if (photoStep === 'back') {
        const response = await uploadBackPhoto(getToken, photo.uri, 'back', scanId)
        if (!response.success) {
          setProcessingPreset(null)
          return
        }

        setBackUri(photo.uri)
        startPolling(response.data.scan_id, true)
        return
      }

      beginScanAttempt('camera', 'two_step')
      const response = await uploadFrontPhoto(getToken, photo.uri, 'front', scanId)
      if (!response.success) {
        setProcessingPreset(null)
        resetScanAttempt()
        return
      }

      setProcessingPreset(null)
      setFrontUri(photo.uri)
      setScanId(response.data.scan_id)
      setShowTransitionMessage(true)
      setPhotoStep('back')
    } catch (error) {
      setProcessingPreset(null)
      console.error(error)
      showRequestErrorToast(error)
      resetScanAttempt()
    } finally {
      captureInFlightRef.current = false
      setIsCapturing(false)
    }
  }, [
    beginScanAttempt,
    cameraReady,
    clearSharedPayloads,
    getToken,
    photoStep,
    preferences.isFast,
    resetScanAttempt,
    runFastScan,
    canStartScan,
    scanId,
    startPolling,
  ])

  const handleCameraMountError = useCallback(
    (error: unknown) => {
      showErrorToast(ERROR_KEYS_OBJ.mountError)
      close()
      console.error('Camera mount error:', error)
    },
    [close],
  )

  useEffect(() => {
    if (isResolving || !resolvedSharedPayloads.length || !canStartScan()) return

    const uris = resolvedSharedPayloads.map((item) => item?.contentUri).filter(Boolean)
    if (!uris.length) return

    const shareKey = [...uris].sort().join('|')
    if (processedShareKeyRef.current === shareKey) return

    const processSharedImages = async () => {
      processedShareKeyRef.current = shareKey
      if (uris.length === 1) {
        const succeeded = await runFastScan(uris[0], 'gallery')
        if (succeeded) clearSharedPayloads()
        return
      }
      if (uris.length === 2) {
        const succeeded = await runSharedTwoStepScan(uris[0], uris[1])
        if (succeeded) clearSharedPayloads()
        return
      }
      processedShareKeyRef.current = null
    }

    void processSharedImages()
  }, [
    clearSharedPayloads,
    isResolving,
    resolvedSharedPayloads,
    runFastScan,
    runSharedTwoStepScan,
    canStartScan,
  ])

  return {
    cameraPermission,
    cameraReady,
    cameraRef,
    close,
    closeGuide: preferences.closeGuide,
    dismissModeMenu: preferences.dismissModeMenu,
    facing,
    flipCamera,
    freeRemaining,
    handleCameraMountError,
    isCapturing,
    isFast: preferences.isFast,
    isModeMenuOpen: preferences.isModeMenuOpen,
    isModeReady: preferences.isModeReady,
    onCameraReady,
    openGallery,
    openGuide: preferences.openGuide,
    photoStep,
    pictureSize,
    processingPreset,
    requestCameraPermissionOrSettings,
    scanMode: preferences.scanMode,
    selectMode: preferences.selectMode,
    setShowTransitionMessage,
    showGuide: preferences.showGuide,
    showTransitionMessage,
    takePhoto,
    toggleModeMenu: preferences.toggleModeMenu,
  }
}
