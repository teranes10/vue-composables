import { mapKeys, mapValues, camelCase, isPlainObject, isArray } from "lodash-es";
import { format as jsonFormatter } from 'json-string-formatter'

export function useCamelCaseJson(json: any): any {
    if (isArray(json)) {
        return json.map(useCamelCaseJson);
    } else if (isPlainObject(json)) {
        const newObj = mapKeys(json, (value, key) => camelCase(key));
        return mapValues(newObj, useCamelCaseJson);
    }

    return json;
}

export function useJsonStringFormatter(jsonString: string) {
    return jsonFormatter(jsonString);
}