import { Color, CssFilterReSolver } from '../_base'
import type { CssFilter, Hex } from '../color-types/colorTypes'

export function hexToFilter(hex: Hex): CssFilter {
  const color = Color.fromHex(hex)
  return CssFilterReSolver.from(color).solve()
}
