import { Color } from '../_base'
import type { Hex, RGB } from '../color-types/colorTypes'

export function hexToRgb(hex: Hex): RGB {
  return Color.fromHex(hex).toRGB()
}
