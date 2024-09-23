import { Color } from './_base'
import { Hex, RGB } from './colorTypes'

export function hexToRgb(hex: Hex): RGB {
  return Color.fromHex(hex).toRGB()
}
