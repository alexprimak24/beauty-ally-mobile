import { isApiError } from '@/services/api/errors'
import { t } from 'i18next'
import Toast from 'react-native-toast-message'

const ERROR_KEYS = [
  'errors.required',
  'errors.invalidJson',
  'errors.unauthorized',
  'errors.internalError',
  'errors.validationFailed',
  'errors.notFound',
  'errors.fileTooBig',
  'errors.unsupportedMediaType',
  'errors.invalidParam',
  'errors.freeAlreadyActivated',
  'errors.subscriptionRequired',
  'errors.badRequest',
  'errors.rateLimited',
  'errors.fairUseRestricted',
  'errors.consentRequired',
  'errors.invalidConsentStatus',
  'errors.invalidConsentType',
  'errors.generic',
  'errors.bothImagesRequired',

  // SCAN SPECIFIC
  'errors.uploadFailed',
  'errors.ocrFailed',
  'errors.gptExtrFailed',
  // "errors.gptAnalysisFailed"
  // "errors.scanSaveFailed"

  // NOT FROM BACKEND
  'errors.photoCaptureError',
  'errors.cameraMountError',

  // the one that comes from worker AI
  'errors.missingIngredients',
  'errors.productNotDetected',
] as const

export const ERROR_KEYS_OBJ = {
  generic: 'errors.generic',
  captureError: 'errors.photoCaptureError',
  mountError: 'errors.cameraMountError',
  bothImagesReq: 'errors.bothImagesRequired',

  // the one that comes from worker AI
  missingIngredients: 'errors.missingIngredients',
  productNotDetected: 'errors.productNotDetected',
}

/**
 * Show an internationalized error toast based on a key.
 * Example: showErrorToast('errors.subscriptionRequired')
 */
export function showErrorToast(errKey: string) {
  // Extract namespace and key (e.g. "errors.generic" → ns="errors", key="generic")
  const [, key] = errKey.split('.')
  const isKnown = ERROR_KEYS.includes(errKey as (typeof ERROR_KEYS)[number])

  const finalNs = 'errors' // actually ns but don't need it rn
  const finalKey = isKnown ? key : 'generic'

  const message = t(finalKey, { ns: finalNs })
  Toast.show({
    type: 'backErrors',
    text1: message,
  })
}

export function showRequestErrorToast(error: unknown) {
  if (error instanceof Error && error.name === 'AbortError') return

  showErrorToast(isApiError(error) ? error.key : ERROR_KEYS_OBJ.generic)
}
