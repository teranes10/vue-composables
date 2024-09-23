import { toNumberWithCommas } from './toNumberWithCommas'

export interface CurrencyStringOptions {
  addCents?: boolean
  symbol?: string
}

export function toCurrencyString(value: string | number, options: CurrencyStringOptions = {}) {
  const { addCents = true, symbol = '$' } = options

  let _value = value?.toString()
  if (!_value) {
    return addCents ? '0.00' : '0'
  }

  if (_value.includes('.')) {
    const decimalIndex = _value.indexOf('.')
    let leftSide = _value.substring(0, decimalIndex)
    let rightSide = _value.substring(decimalIndex)

    leftSide = toNumberWithCommas(leftSide)
    rightSide = toNumberWithCommas(rightSide)

    if (addCents) {
      rightSide += '00'
    }

    rightSide = rightSide.substring(0, 2)

    _value = `${leftSide}.${rightSide}`
  }
  else {
    _value = toNumberWithCommas(_value)
    _value = `${_value}`

    if (addCents) {
      _value += '.00'
    }
  }

  return `${symbol}${_value}`
}
