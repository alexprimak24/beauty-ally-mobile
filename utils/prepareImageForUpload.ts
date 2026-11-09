// import type { ImageManipulatorContext } from 'expo-image-manipulator'
import { SaveFormat } from 'expo-image-manipulator'
import * as ImageManipulator from 'expo-image-manipulator'

export async function prepareImageForUpload(uri: string, width: number) {
  const image = ImageManipulator.ImageManipulator.manipulate(uri)
  const resized = image.resize({ width })
  const rendered = await resized.renderAsync()
  const finalized = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    // compress: 0.8,
  })

  return finalized
}
