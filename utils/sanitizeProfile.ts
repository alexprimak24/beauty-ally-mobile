export function sanitizeValue<T>(val: T): T {
  if (typeof val === 'string') {
    return (val as unknown as string).trim() as T
  }
  if (Array.isArray(val) && val.every((v) => typeof v === 'string')) {
    // trim, drop empties, dedupe
    const cleaned = Array.from(new Set(val.map((s) => s.trim()).filter(Boolean)))
    return cleaned as unknown as T
  }
  return val
}

export function sanitizePatch<P extends object>(patch: P): P {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(patch)) {
    out[k] = sanitizeValue(v)
  }
  return out as P
}
