import {
  updateProductFrontImage,
  updateProductLink,
  updateProductName,
} from '@/services/updateProductChecks'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { useAuth } from '@clerk/expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useErrorToast } from './useErrorToast'

interface UpdateNamePayload {
  scanId: string
  productName: string
}

interface UpdatePurchaseLinkPayload {
  scanId: string
  purchaseLink: string
}

interface UpdateFrontImagePayload {
  scanId: string
  img_uri: string | null | undefined
}

export function useUpdateName() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ scanId, productName }: UpdateNamePayload) =>
      updateProductName(getToken, scanId, productName),

    onSuccess: async (_, variables) => {
      const { scanId } = variables

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.productCheck.byId(scanId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productChecks.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.routine.all,
        }),
      ])
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    updateName: mutation.mutate,
    updateNameAsync: mutation.mutateAsync,
    isUpdatingName: mutation.isPending,
  }
}

export function useUpdatePurchaseLink() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ scanId, purchaseLink }: UpdatePurchaseLinkPayload) =>
      updateProductLink(getToken, scanId, purchaseLink),

    onSuccess: async (_, variables) => {
      const { scanId } = variables

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.productCheck.byId(scanId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productChecks.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.routine.all,
        }),
      ])
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    updateLink: mutation.mutate,
    updateLinkAsync: mutation.mutateAsync,
    isUpdatingLink: mutation.isPending,
  }
}

export function useUpdateFrontImage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ scanId, img_uri }: UpdateFrontImagePayload) =>
      updateProductFrontImage(getToken, scanId, img_uri),

    onSuccess: async (_, variables) => {
      const { scanId } = variables

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.productCheck.byId(scanId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productChecks.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.routine.all,
        }),
      ])
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    updateFrontImage: mutation.mutate,
    updateFrontImageAsync: mutation.mutateAsync,
    isUpdatingFrontImage: mutation.isPending,
  }
}
