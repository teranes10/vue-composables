import type { CssFilter, Hex } from './_base'
import { Color, CssFilterReSolver } from './_base'

export function hexToFilter(hex: Hex): CssFilter {
  const color = Color.fromHex(hex)
  return CssFilterReSolver.from(color).solve()
}
