import type { HSL, Hex } from './_base'
import { Color } from './_base'

export function hslToHex(hsl: HSL): Hex {
  return Color.fromHSL(hsl).toHex()
}
