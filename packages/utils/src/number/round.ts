import { isNumber } from './isNumber'

export function round(value: number, precision: number = 0): number {
  if (!isNumber(value) || !isNumber(precision)) {
    return Number.NaN
  }

  const factor = 10 ** precision
  return Number(Math.round(value * factor) / factor)
}
