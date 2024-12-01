export function mapValue<TObject extends object, TResult>(
  object: TObject,
  callback: (value: TObject[keyof TObject], key: keyof TObject, collection: TObject) => TResult,
) {
  const result = {} as Record<keyof TObject, TResult>
  const keys = Object.keys(object) as Array<keyof TObject>

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    result[key] = callback(object[key], key, object)
  }

  return result
}
