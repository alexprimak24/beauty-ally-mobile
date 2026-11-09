/// <reference types="jest" />

import { normalizeUri } from '@/utils/normalizeUri'
import { File } from 'expo-file-system'
import { appendImageFile } from '../formData'

jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation((uri: string) => ({
    bytes: jest.fn(),
    uri,
  })),
}))

jest.mock('@/utils/normalizeUri', () => ({
  normalizeUri: jest.fn(async (uri: string) => `file:///normalized/${uri.split('/').pop()}`),
}))

jest.mock('mime', () => ({
  __esModule: true,
  default: {
    getExtension: jest.fn(() => 'jpg'),
    getType: jest.fn(() => 'image/jpeg'),
  },
}))

describe('appendImageFile', () => {
  it('uses an Expo File part supported by Expo fetch', async () => {
    const append = jest.fn()
    const formData = { append } as unknown as FormData

    await appendImageFile(formData, 'image', 'file:///camera/photo.jpg', 'front-product')

    expect(normalizeUri).toHaveBeenCalledWith('file:///camera/photo.jpg')
    expect(File).toHaveBeenCalledWith('file:///normalized/photo.jpg')
    const filePart = jest.mocked(File).mock.results[0]?.value
    expect(append).toHaveBeenCalledWith('image', filePart, 'front-product.jpg')
  })
})
