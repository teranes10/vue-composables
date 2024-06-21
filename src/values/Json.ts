import { useMapKeys, useMapValues, useIsPlainObject, useIsArray } from './Object'
import { useCamelCase } from './String'

export { format as useJsonStringFormatter } from 'json-string-formatter'

export function useCamelCaseJson(json: any): any {
    if (useIsArray(json)) {
        return json.map(useCamelCaseJson);
    }

    if (useIsPlainObject(json)) {
        const newObj = useMapKeys(json, (_, key) => useCamelCase(key));
        return useMapValues(newObj, useCamelCaseJson);
    }

    return json;
}