export type ScanAccess =
  { ok: true; pro: true } | { ok: true; pro: false; remaining: number } | { ok: false }

export type ScanMode = 'two_step' | 'both' | 'fast'
export type ScanModeSelection = 'two_step' | 'fast'
export type ScanPhotoStep = 'front' | 'back'
export type ScanSource = 'camera' | 'gallery'

export interface ScanAttemptContext {
  mode: ScanMode | null
  source: ScanSource | null
}
