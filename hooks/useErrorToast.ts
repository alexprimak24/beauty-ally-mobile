import { showRequestErrorToast } from '@/utils/showErrorToast'
import { useEffect } from 'react'

export function useErrorToast(error: unknown, isError: boolean) {
  useEffect(() => {
    if (!isError || !error) return

    showRequestErrorToast(error)
  }, [error, isError])
}
