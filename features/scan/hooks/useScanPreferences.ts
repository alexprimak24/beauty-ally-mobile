import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'

import { scanStorageKeys } from '../constants'
import type { ScanModeSelection } from '../types'

export function useScanPreferences(onTwoStepSelected: () => void) {
  const [scanMode, setScanMode] = useState<ScanModeSelection>('two_step')
  const [isModeReady, setIsModeReady] = useState(false)
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const selectMode = useCallback(
    async (mode: ScanModeSelection) => {
      setScanMode(mode)
      setIsModeMenuOpen(false)

      try {
        await AsyncStorage.setItem(scanStorageKeys.mode, mode)
      } catch (error) {
        console.error('failed to save scan mode', error)
      }

      if (mode === 'two_step') onTwoStepSelected()
    },
    [onTwoStepSelected],
  )

  const closeGuide = useCallback(async () => {
    try {
      await AsyncStorage.setItem(scanStorageKeys.guideSeen, '1')
    } catch (error) {
      console.error('failed to persist scan guide state', error)
    }
    setShowGuide(false)
  }, [])

  const dismissModeMenu = useCallback(() => setIsModeMenuOpen(false), [])
  const openGuide = useCallback(() => setShowGuide(true), [])
  const toggleModeMenu = useCallback(() => setIsModeMenuOpen((current) => !current), [])

  useEffect(() => {
    let isMounted = true

    const hydrate = async () => {
      try {
        const [seenGuide, savedScanMode] = await Promise.all([
          AsyncStorage.getItem(scanStorageKeys.guideSeen),
          AsyncStorage.getItem(scanStorageKeys.mode),
        ])
        if (!isMounted) return

        if (!seenGuide) setShowGuide(true)
        if (savedScanMode === 'two_step' || savedScanMode === 'fast') setScanMode(savedScanMode)
      } catch (error) {
        console.error('failed to hydrate scan screen state', error)
      } finally {
        if (isMounted) setIsModeReady(true)
      }
    }

    void hydrate()
    return () => {
      isMounted = false
    }
  }, [])

  return {
    closeGuide,
    dismissModeMenu,
    isFast: scanMode === 'fast',
    isModeMenuOpen,
    isModeReady,
    openGuide,
    scanMode,
    selectMode,
    showGuide,
    toggleModeMenu,
  }
}
