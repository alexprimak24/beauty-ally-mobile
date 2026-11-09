export function isSafeHttpUrl(value: string): boolean {
  const trimmed = value.trim()

  if (!trimmed) return false

  try {
    const url = new URL(trimmed)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}
