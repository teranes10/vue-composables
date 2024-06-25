import type { HSL, Hex } from './_base'
import { Color } from './_base'

export function hexToHsl(hex: Hex): HSL {
  return Color.fromHex(hex).toHSL()
}
