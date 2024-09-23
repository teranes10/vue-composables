import { Color, CssFilterReSolver } from './_base'
import { CssFilter, Hex } from './colorTypes'

export function hexToFilter(hex: Hex): CssFilter {
  const color = Color.fromHex(hex)
  return CssFilterReSolver.from(color).solve()
}
