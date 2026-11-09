import { WARM_BLURHASH } from '@/constants/blurHash'
import { Image as ExpoImage, type ImageProps } from 'expo-image'
import { useCallback, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

interface ProgressiveResultImageProps {
  height: number
  previewSource?: ImageProps['source']
  recyclingKey: string
  source: ImageProps['source']
  width: number
}

export function ProgressiveResultImage({
  height,
  previewSource,
  recyclingKey,
  source,
  width,
}: ProgressiveResultImageProps) {
  const fullImageOpacity = useRef(new Animated.Value(0)).current

  const revealFullImage = useCallback(() => {
    Animated.timing(fullImageOpacity, {
      duration: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }, [fullImageOpacity])

  if (!previewSource) {
    return (
      <ExpoImage
        cachePolicy="memory-disk"
        contentFit="cover"
        placeholder={WARM_BLURHASH}
        placeholderContentFit="cover"
        recyclingKey={recyclingKey}
        source={source}
        style={{ height, width }}
        transition={250}
      />
    )
  }

  return (
    <View style={{ height, width }}>
      <ExpoImage
        cachePolicy="memory-disk"
        contentFit="cover"
        placeholder={WARM_BLURHASH}
        placeholderContentFit="cover"
        recyclingKey={`${recyclingKey}:preview`}
        source={previewSource}
        style={StyleSheet.absoluteFill}
        transition={100}
      />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity: fullImageOpacity }]}
      >
        <ExpoImage
          cachePolicy="memory-disk"
          contentFit="cover"
          onLoad={revealFullImage}
          recyclingKey={`${recyclingKey}:full`}
          source={source}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  )
}
