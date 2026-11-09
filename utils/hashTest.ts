import * as Crypto from 'expo-crypto'

export async function hashText(text: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text.trim())
}
