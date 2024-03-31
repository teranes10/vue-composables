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
  return val?.replace(/[^0-9.]/g, "")?.replace(/(\..*)\./g, "$1") || '';
}

export function useToFormattedNumericString(val: string): string {
  return val?.replace(/\D/g, "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '';
}


export function useToCurrencyString(val: string, addCents: boolean = false) {
  let input_val = val;
  if (!input_val) {
    return addCents ? '$0.00' : '$0';
  }

  if (input_val.indexOf(".") >= 0) {
    var decimal_pos = input_val.indexOf(".");
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    left_side = useToFormattedNumericString(left_side);
    right_side = useToFormattedNumericString(right_side);

    if (addCents) {
      right_side += "00";
    }

    right_side = right_side.substring(0, 2);

    input_val = "$" + left_side + "." + right_side;
  } else {
    input_val = useToFormattedNumericString(input_val);
    input_val = "$" + input_val;

    if (addCents) {
      input_val += ".00";
    }
  }

  return input_val;
}

export function useToNumber(val: string): number {
  const numericString = useToNumericString(val);
  if (!numericString) {
    return 0;
  }

  if (numericString?.includes('.')) {
    const decimalVal = parseFloat(numericString);
    return isNaN(decimalVal) ? 0.0 : decimalVal;
  }

  const numberVal = parseInt(numericString);
  return isNaN(numberVal) ? 0 : numberVal;
}
