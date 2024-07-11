export function round(value: number, precision: number = 0): number {
  const factor = 10 ** precision
  return Number(Math.round(value * factor) / factor)
}
