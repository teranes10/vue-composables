import { Color, CssFilterReSolver } from '../_base'
import type { CssFilter, HSL } from '../color-types/colorTypes'

export function hslToFilter(hsl: HSL): CssFilter {
  const color = Color.fromHSL(hsl)
  return CssFilterReSolver.from(color).solve()
}
