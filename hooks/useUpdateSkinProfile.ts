import type { UserData } from '@/types/userEntry'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useRawUser } from '@/hooks/useGetUser'
import { useSignUpUser } from '@/hooks/useSignUpUser'
import { common } from '@/utils/i18n/keyConstants'
import { sanitizePatch } from '@/utils/sanitizeProfile'

type Patch = Partial<UserData>

export function useUpdateSkinProfile() {
  const { t } = useTranslation(common)
  const { data } = useRawUser()
  const { signUpUser } = useSignUpUser()
  const [isUpdating, setIsUpdating] = useState(false)

  async function updateField<K extends keyof UserData>(key: K, value: UserData[K]) {
    const patch = sanitizePatch({ [key]: value } as Patch)
    return updateMany(patch)
  }

  async function updateMany(patch: Patch) {
    if (!data?.profile) return
    const sanitized = sanitizePatch(patch)

    try {
      setIsUpdating(true)
      await signUpUser({ ...data.profile, ...sanitized })
    } catch (err) {
      console.error(err)
      Alert.alert(t('errors.saveProfileTitle'), t('errors.saveProfileBody'))
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return { updateField, updateMany, isUpdating }
}
