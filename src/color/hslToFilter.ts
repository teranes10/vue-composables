import type { CssFilter, HSL } from './_base'
import { Color, CssFilterReSolver } from './_base'

export function hslToFilter(hsl: HSL): CssFilter {
  const color = Color.fromHSL(hsl)
  return CssFilterReSolver.from(color).solve()
}
