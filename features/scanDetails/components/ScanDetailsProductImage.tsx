import { Ionicons } from '@expo/vector-icons'
import { Image as ExpoImage } from 'expo-image'
import { ActivityIndicator, Pressable, View } from 'react-native'

import { scale } from '@/design/responsiveNew'

interface ScanDetailsProductImageProps {
  imageUri?: string
  isUploading: boolean
  onPress: () => void
}

export function ScanDetailsProductImage({
  imageUri,
  isUploading,
  onPress,
}: ScanDetailsProductImageProps) {
  return (
    <View className="mb-10 mt-4 items-center">
      <Pressable
        accessibilityRole="button"
        disabled={isUploading}
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.imageContainer}>
          <ExpoImage
            source={imageUri}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
            accessibilityIgnoresInvertColors
          />
          {isUploading ? (
            <View className="absolute inset-0 items-center justify-center rounded-full bg-black/40">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : null}
        </View>
        {!isUploading ? (
          <View
            className="absolute items-center justify-center rounded-full bg-white shadow-sm"
            pointerEvents="none"
            style={styles.cameraButton}
          >
            <Ionicons name="camera" size={scale(18)} color="#212529" />
          </View>
        ) : null}
      </Pressable>
    </View>
  )
}

const styles = {
  pressable: {
    borderRadius: scale(70),
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: { opacity: 0.9 },
  imageContainer: {
    position: 'relative',
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: { borderRadius: scale(70), width: '100%', height: '100%' },
  cameraButton: {
    right: scale(2),
    bottom: -scale(8),
    width: scale(36),
    height: scale(36),
    borderWidth: 2,
    borderColor: '#f4f6f8',
    zIndex: 1,
    elevation: 4,
  },
} as const
