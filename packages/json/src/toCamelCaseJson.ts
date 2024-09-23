import { isObject, mapKey, mapValue, toCamelCase } from '@teranes/utils'

export function toCamelCaseJson(json: any): any {
  if (Array.isArray(json)) {
    return json.map(toCamelCaseJson)
  }

  if (isObject(json)) {
    const newObj = mapKey(json, key => toCamelCase(key as string))
    return mapValue(newObj, toCamelCaseJson)
  }

  return json
}
