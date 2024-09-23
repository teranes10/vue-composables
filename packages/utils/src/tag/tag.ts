export const TAG = {
  Function: '[object Function]',
  AsyncFunction: '[object AsyncFunction]',
  Object: '[object Object]',
  Array: '[object Array]',
  Boolean: '[object Boolean]',
  Number: '[object Number]',
  String: '[object String]',
  Date: '[object Date]',
  Error: '[object Error]',
  Map: '[object Map]',
  Set: '[object Set]',
  Regex: '[object RegExp]',
  Symbol: '[object Symbol]',
  Undefined: '[object Undefined]',
  Null: '[object Null]'
} as const

export function getTag<T>(value: T) {
  if (value == null) {
    return value === undefined ? TAG.Undefined : TAG.Null
  }

  return Object.prototype.toString.call(value)
}

export function isTag<T>(value: T, tag: keyof typeof TAG) {
  return getTag(value) === TAG[tag]
}
