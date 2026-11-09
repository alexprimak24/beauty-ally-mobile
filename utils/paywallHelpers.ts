export function yearlySavingsPct(monthly: number, yearly: number) {
  const fullYear = monthly * 12
  if (fullYear <= 0) return 0
  return Math.round(((fullYear - yearly) / fullYear) * 100)
}
