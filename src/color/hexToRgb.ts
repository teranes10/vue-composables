import type { Hex, RGB } from './_base'
import { Color } from './_base'

export function hexToRgb(hex: Hex): RGB {
  return Color.fromHex(hex).toRGB()
}
