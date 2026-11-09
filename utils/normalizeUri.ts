import * as Crypto from 'expo-crypto'
import { File, Paths } from 'expo-file-system'

export async function normalizeUri(uri: string): Promise<string> {
  // Android returns "content://", which fetch can't handle
  if (uri.startsWith('content://')) {
    const ext = uri.endsWith('.png') ? '.png' : '.jpg'
    const source = new File(uri)
    const destination = new File(Paths.cache, `upload-${Crypto.randomUUID()}${ext}`)
    await source.copy(destination)
    return destination.uri
  }
  return uri
}
