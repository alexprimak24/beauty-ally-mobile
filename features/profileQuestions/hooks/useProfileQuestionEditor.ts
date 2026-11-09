import { useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { useRawUser } from '@/hooks/useGetUser'
import { useUpdateSkinProfile } from '@/hooks/useUpdateSkinProfile'
import { main } from '@/utils/i18n/keyConstants'

type EditableProfileQuestionField =
  | 'activeTreatment'
  | 'allergies'
  | 'climate'
  | 'gender'
  | 'skinConcerns'
  | 'skinType'
  | 'sunscreenUsage'

const feedbackKeys: Record<EditableProfileQuestionField, { error: string; success: string }> = {
  activeTreatment: {
    error: 'edit.activeTreatments.updateErrBody',
    success: 'edit.activeTreatments.updateOkBody',
  },
  allergies: {
    error: 'edit.allergies.updateErrBody',
    success: 'edit.allergies.updateOkBody',
  },
  climate: {
    error: 'edit.climate.updateErrBody',
    success: 'edit.climate.updateOkBody',
  },
  gender: {
    error: 'edit.gender.updateErrBody',
    success: 'edit.gender.updateOkBody',
  },
  skinConcerns: {
    error: 'edit.skinConcerns.updateErrBody',
    success: 'edit.skinConcerns.updateOkBody',
  },
  skinType: {
    error: 'edit.skinType.updateErrBody',
    success: 'edit.skinType.updateOkBody',
  },
  sunscreenUsage: {
    error: 'edit.sunscreen.updateErrBody',
    success: 'edit.sunscreen.updateOkBody',
  },
}

export function useProfileQuestionEditor(field: EditableProfileQuestionField) {
  const router = useRouter()
  const { data } = useRawUser()
  const { updateField, isUpdating } = useUpdateSkinProfile()
  const { t } = useTranslation(main)

  const confirm = useCallback(
    async (value: string) => {
      try {
        await updateField(field, value)
        Toast.show({
          type: 'success',
          position: 'top',
          text1: t('edit.updateOkTitle'),
          text2: t(feedbackKeys[field].success),
        })
        router.back()
      } catch {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: t('edit.updateErrTitle'),
          text2: t(feedbackKeys[field].error),
        })
      }
    },
    [field, router, t, updateField],
  )

  return {
    confirm,
    initial: data?.profile[field],
    isUpdating,
  }
}
