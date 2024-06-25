const TAGs = {
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
} as const

type TAG = typeof TAGs

export function getTag<T>(value: T) {
  return Object.prototype.toString.call(value)
}

export function isTag<T>(value: T, tag: keyof TAG) {
  return getTag(value) === TAGs[tag]
}
