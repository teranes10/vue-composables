import type { Lightness } from '../_base'
import type { Hex } from '../color-types/colorTypes'
import { hexToHsl } from '../hex-to-hsl/hexToHsl'
import { hslToHex } from '../hsl-to-hex/hslToHex'

export function getHexColorShade(hex: Hex, shade: Lightness<1, 100>) {
  const { hue, saturation } = hexToHsl(hex)
  return hslToHex({ hue, saturation, lightness: 100 - shade })
}
