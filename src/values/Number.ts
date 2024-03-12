import { useIsNull } from './Object'

export function useDiff(n1: number, n2: number): number {
  if (useIsNull(n1) || useIsNull(n2)) {
    return 0;
  }

  if (n1 > n2) {
    return n1 - n2;
  }

  return n2 - n1;
}
