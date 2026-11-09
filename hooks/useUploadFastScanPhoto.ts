import { uploadFastScanPhoto } from '@/services/uploadFastScanPhoto'
import { useAuth } from '@clerk/expo'
import { useMutation } from '@tanstack/react-query'
import { useErrorToast } from './useErrorToast'

export function useUploadFastScanPhoto() {
  const { getToken } = useAuth()
  //   const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ img_uri }: { img_uri: string | null | undefined }) =>
      uploadFastScanPhoto(getToken, img_uri),

    // onSuccess: () => {
    //   // TODO: ADD TOAST

    //   queryClient.invalidateQueries({ queryKey: ['productCheck'] })
    //   // queryClient.invalidateQueries({ queryKey: ['productChecks'] })
    // },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    uploadFastRes: mutation.data,
    isUploadFastError: mutation.isError,
    uploadFastScanPhoto: mutation.mutateAsync,
    isUploadingFastScanPhoto: mutation.isPending,
  }
}
