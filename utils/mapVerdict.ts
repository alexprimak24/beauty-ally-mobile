type Verdict = 'Generally Suitable' | 'Might Not Align' | 'Low Match'

type VerdictKey = 'generally' | 'mightNotAlign' | 'lowMatch'

interface mapVerdictOut {
  key: VerdictKey
  intKey: string
}

const VERDICT_MAP = {
  'Generally Suitable': 'generally',
  'Might Not Align': 'mightNotAlign',
  'Low Match': 'lowMatch',
} as const satisfies Record<Verdict, VerdictKey>

function isVerdict(v: string): v is Verdict {
  return v in VERDICT_MAP
}

export function verdictFromApi(input: unknown): Verdict | null {
  if (typeof input === 'string' && isVerdict(input)) return input
  // near-misses
  if (typeof input === 'string') {
    const s = input.toLowerCase()
    if (s.includes('low')) return 'Low Match'
    if (s.includes('might')) return 'Might Not Align'
    if (s.includes('general')) return 'Generally Suitable'
  }

  return null
}

export function mapVerdict({ verdict }: { verdict: Verdict }): mapVerdictOut {
  const verdictKey = VERDICT_MAP[verdict]
  return {
    key: verdictKey,
    intKey: `result.verdict.${verdictKey}.label`,
  }
}
