import papa from 'papaparse'

export function jsonToCsv<T extends any[]>(data: T) {
  return papa.unparse(data)
}
