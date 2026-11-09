export const scanRoutes = {
  home: '/(protected)/(tabs)',
  paywall: '/(auth)/payment/paywall',
  profile: '/(protected)/(tabs)/profile',
} as const

export const scanStorageKeys = {
  guideSeen: 'hasSeenScanGuide',
  mode: 'scan_mode_v1',
} as const
