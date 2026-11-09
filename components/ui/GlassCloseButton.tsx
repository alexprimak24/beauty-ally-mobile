import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { GlassRoundedBtn } from './GlassRoundedBtn'

export function GlassCloseButton({
  zIndex = 1000,
  size = 24,
  onPress,
}: {
  zIndex: number
  size?: number
  onPress?: () => void
}) {
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const iconSize = 46

  return (
    <GlassRoundedBtn zIndex={zIndex} size={iconSize} onPress={onPress || goBack}>
      <Ionicons name="close-outline" size={size} color="#212529" style={{ marginRight: 2 }} />
    </GlassRoundedBtn>
  )
}
