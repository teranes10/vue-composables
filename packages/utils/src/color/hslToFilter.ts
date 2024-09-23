import { Color, CssFilterReSolver } from './_base'
import { CssFilter, HSL } from './colorTypes'

export function hslToFilter(hsl: HSL): CssFilter {
  const color = Color.fromHSL(hsl)
  return CssFilterReSolver.from(color).solve()
}
