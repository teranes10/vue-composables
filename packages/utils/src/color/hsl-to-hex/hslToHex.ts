import { Color } from '../_base'
import type { HSL, Hex } from '../color-types/colorTypes'

export function hslToHex(hsl: HSL): Hex {
  return Color.fromHSL(hsl).toHex()
}
