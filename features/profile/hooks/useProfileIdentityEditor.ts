import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ImageSourcePropType } from 'react-native'
import { Alert } from 'react-native'
import { useAuth, useUser as useClerkUser } from '@clerk/expo'
import { useQueryClient } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'

import { USER_KEYS, useRawUser, useUser } from '@/hooks/useGetUser'
import { useSignUpUser } from '@/hooks/useSignUpUser'
import { uploadPfp } from '@/services/uploadPfp'
import { components } from '@/utils/i18n/keyConstants'
import { prepareImageForUpload } from '@/utils/prepareImageForUpload'
import { selectPfpType } from '@/utils/selectPfpType'
import { normalizeProfileName } from '../model'

export function useProfileIdentityEditor() {
  const [draftName, setDraftName] = useState('')
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const { t } = useTranslation(components)
  const { user: clerkUser } = useClerkUser()
  const { data: userData } = useUser()
  const { data: rawUserData } = useRawUser()
  const { getToken, userId } = useAuth()
  const { signUpUser, isSigningUpUser } = useSignUpUser()
  const queryClient = useQueryClient()

  const currentName = rawUserData?.profile?.name ?? ''
  const pictureSource = useMemo<ImageSourcePropType>(() => {
    if (userData?.profile?.profilePicture) {
      return { uri: userData.profile.profilePicture }
    }
    if (clerkUser?.imageUrl) return { uri: clerkUser.imageUrl }
    return selectPfpType(rawUserData?.profile?.gender ?? '')
  }, [clerkUser?.imageUrl, rawUserData?.profile?.gender, userData?.profile?.profilePicture])

  const pickPicture = useCallback(async () => {
    if (isUploadingPicture) return

    setIsUploadingPicture(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      if (result.canceled) return

      const preparedImage = await prepareImageForUpload(result.assets[0].uri, 256)
      await uploadPfp(getToken, preparedImage.uri)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USER_KEYS.profile(userId) }),
        queryClient.invalidateQueries({ queryKey: USER_KEYS.raw(userId) }),
      ])
    } catch (error) {
      console.error('Profile picture upload failed:', error)
      Alert.alert(t('updatePfp.alerts.galleryErrorTitle'), t('updatePfp.alerts.galleryErrorBody'))
    } finally {
      setIsUploadingPicture(false)
    }
  }, [getToken, isUploadingPicture, queryClient, t, userId])

  const saveName = useCallback(async () => {
    const name = normalizeProfileName(draftName)
    if (!name || !rawUserData?.profile) return

    try {
      await signUpUser({ ...rawUserData.profile, name })
      setDraftName('')
    } catch (error) {
      Alert.alert(
        t('updatePfp.alerts.updateNameFailedTitle'),
        t('updatePfp.alerts.updateNameFailedBody'),
      )
      console.error(error)
    }
  }, [draftName, rawUserData?.profile, signUpUser, t])

  const discardName = useCallback(() => setDraftName(''), [])

  return {
    currentName,
    discardName,
    draftName,
    isSavingName: isSigningUpUser,
    isUploadingPicture,
    pickPicture,
    pictureSource,
    saveName,
    setDraftName,
  }
}
