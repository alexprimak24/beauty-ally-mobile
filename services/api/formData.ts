import { normalizeUri } from '@/utils/normalizeUri'
import { File } from 'expo-file-system'
import mime from 'mime'

export async function appendImageFile(
  formData: FormData,
  field: string,
  uri: string,
  baseName: string,
): Promise<void> {
  const safeUri = await normalizeUri(uri)
  let mimeType = mime.getType(safeUri) || 'image/jpeg'

  if (!mimeType.startsWith('image/') || mimeType === 'image/heic' || mimeType === 'image/heif')
    mimeType = 'image/jpeg'

  const extension = mime.getExtension(mimeType) || 'jpg'

  const file = new File(safeUri)
  formData.append(field, file, `${baseName}.${extension}`)
}
