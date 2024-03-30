import { useIsNull } from './Object'

export function useNumberDiff(n1: number, n2: number): number {
  if (useIsNull(n1) || useIsNull(n2)) {
    return 0;
  }

  if (n1 > n2) {
    return n1 - n2;
  }

  return n2 - n1;
}

export function useToNumericString(val: string): string {
  return val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
}

export function useToNumber(val: string): number {
  const numericString = useToNumericString(val);
  if (!numericString) {
    return 0;
  }

  return val.includes(".")
    ? parseFloat(val || "0.0")
    : parseInt(val || "0");
}
