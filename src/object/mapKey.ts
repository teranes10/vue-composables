export function mapKey<TObject extends object, TResult extends string>(
  object: TObject,
  callback: (key: keyof TObject, value: TObject[keyof TObject], collection: TObject) => TResult,
) {
  const result = {} as Record<TResult, TObject[keyof TObject]>
  const keys = Object.keys(object) as Array<keyof TObject>

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const newKey = callback(key, object[key], object)
    result[newKey] = object[key]
  }

  return result
}
