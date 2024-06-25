import { toNumericString } from './toNumericString'

export function toNumber(value: string): number {
  const numericString = toNumericString(value)
  if (!numericString) {
    return 0
  }

  if (numericString?.includes('.')) {
    const decimalVal = Number.parseFloat(numericString)
    return Number.isNaN(decimalVal) ? 0.0 : decimalVal
  }

  const numberVal = Number.parseInt(numericString)
  return Number.isNaN(numberVal) ? 0 : numberVal
}
