import { Color } from './_base'
import { Hex, HSL } from './colorTypes'

export function hexToHsl(hex: Hex): HSL {
  return Color.fromHex(hex).toHSL()
}
