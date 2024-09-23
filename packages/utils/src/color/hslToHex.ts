import { Color } from './_base'
import { Hex, HSL } from './colorTypes'

export function hslToHex(hsl: HSL): Hex {
  return Color.fromHSL(hsl).toHex()
}
