import { isObject } from '../object/isObject'
import { mapKey } from '../object/mapKey'
import { mapValue } from '../object/mapValue'
import { toCamelCase } from '../string/toCamelCase'

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
