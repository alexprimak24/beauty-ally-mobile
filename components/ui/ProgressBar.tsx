import { useSegments } from 'expo-router'
import { View } from 'react-native'

export default function ProgressBar() {
  const segments = useSegments()
  const currentStep = segments[segments.length - 1]
  const stepMap: Partial<Record<string, number>> = {
    gender: 0.11,
    climate: 0.22,
    'skin-type': 0.33,
    allergies: 0.44,
    'skin-concerns': 0.56,
    'active-treatments': 0.67,
    sunscreen: 0.78,
    consent: 0.89,
    'create-account': 1,
  }
  const progress = stepMap[currentStep] ?? 0

  if (!progress) {
    return null
  }

  return (
    <View className="h-2 flex-1 rounded-full bg-lightBg">
      <View className="h-full rounded-full bg-dark" style={{ width: `${progress * 100}%` }} />
    </View>
  )
}
