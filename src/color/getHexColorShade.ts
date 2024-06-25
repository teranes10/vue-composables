import type { Hex, Lightness } from './_base'
import { hexToHsl } from './hexToHsl'
import { hslToHex } from './hslToHex'

export function getHexColorShade(hex: Hex, shade: Lightness<1, 100>) {
  const { hue, saturation } = hexToHsl(hex)
  return hslToHex({ hue, saturation, lightness: 100 - shade })
}
