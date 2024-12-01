import { Color } from '../_base'
import type { HSL, Hex } from '../color-types/colorTypes'

export function hexToHsl(hex: Hex): HSL {
  return Color.fromHex(hex).toHSL()
}
