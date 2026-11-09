import { useRevenueCat } from '@/features/subscription/revenueCat'
import { useConsentAlert } from '@/hooks/useConsentAlert'
import { useCheckFree } from '@/hooks/useDBEntitlements'
import { useHealthConsent } from '@/hooks/useGetConsents'
import { main } from '@/utils/i18n/keyConstants'
import type { RefObject } from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useCameraPermissions } from 'expo-camera'
import { useRouter } from 'expo-router'

import { scanRoutes } from '../constants'
import { resolveScanAccess } from '../model'

export function useScanAccess(captureInFlightRef: RefObject<boolean>) {
  const router = useRouter()
  const { t } = useTranslation(main)
  const showConsentAlertAndGo = useConsentAlert()
  const { entitlements } = useRevenueCat()
  const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions()
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const {
    data: consentData,
    isLoading: isConsentLoading,
    isError: isConsentError,
  } = useHealthConsent()
  const { data: freeData, isLoading: isFreeLoading, isError: isFreeError } = useCheckFree()

  const access = useMemo(
    () =>
      resolveScanAccess({
        freeCheckFailed: isFreeError,
        freeCheckLoading: isFreeLoading,
        isPro: entitlements.isPro,
        remaining: freeData?.remaining,
      }),
    [entitlements.isPro, freeData?.remaining, isFreeError, isFreeLoading],
  )

  const guardConsentOrRedirect = useCallback(() => {
    if (consentData && !consentData.hasConsent) {
      showConsentAlertAndGo(router, scanRoutes.profile)
      return false
    }
    return true
  }, [consentData, router, showConsentAlertAndGo])

  const alertOnceAndGoPaywall = useCallback(() => {
    Alert.alert(t('scan.alerts.outOfFree.title'), t('scan.alerts.outOfFree.body'), [
      {
        text: t('scan.alerts.outOfFree.goPremium'),
        onPress: () => router.replace(scanRoutes.paywall),
      },
    ])
  }, [router, t])

  const canStartScan = useCallback(() => {
    if (captureInFlightRef.current || isConsentLoading || isConsentError) return false
    if (!guardConsentOrRedirect() || !access.ok) return false

    if (!access.pro && access.remaining <= 0) {
      alertOnceAndGoPaywall()
      return false
    }
    return true
  }, [
    access,
    alertOnceAndGoPaywall,
    captureInFlightRef,
    guardConsentOrRedirect,
    isConsentError,
    isConsentLoading,
  ])

  const ensureGalleryPermission = useCallback(async () => {
    if (!galleryPermission?.granted && !galleryPermission?.canAskAgain) {
      Alert.alert(t('scan.alerts.re.gallery.main'), t('scan.alerts.re.gallery.sub'), [
        { text: t('scan.alerts.re.gallery.leftBtn'), style: 'cancel' },
        { text: t('scan.alerts.re.gallery.rightBtn'), onPress: () => Linking.openSettings() },
      ])
    }
    if (galleryPermission?.granted) return true

    const response = await requestGalleryPermission()
    return Boolean(response?.granted)
  }, [galleryPermission?.canAskAgain, galleryPermission?.granted, requestGalleryPermission, t])

  const requestCameraPermissionOrSettings = useCallback(() => {
    if (cameraPermission?.status === 'denied') {
      Alert.alert(t('scan.alerts.re.camera.main'), t('scan.alerts.re.camera.sub'), [
        { text: t('scan.alerts.re.camera.leftBtn'), style: 'cancel' },
        { text: t('scan.alerts.re.camera.rightBtn'), onPress: () => Linking.openSettings() },
      ])
    }
    void requestCameraPermission()
  }, [cameraPermission?.status, requestCameraPermission, t])

  return {
    access,
    cameraPermission,
    canStartScan,
    ensureGalleryPermission,
    freeRemaining: access.ok && !access.pro ? access.remaining : null,
    requestCameraPermissionOrSettings,
  }
}
