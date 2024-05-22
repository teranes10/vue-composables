import { mapKeys, camelCase } from "lodash-es";
import { format as jsonFormatter } from 'json-string-formatter'

export function useToCamelCaseJson(json: any) {
    if (typeof json !== 'object') {
        return;
    }

    return mapKeys(json, (_, key) => {
        return camelCase(key);
    });
}

export function useJsonStringFormatter(jsonString: string) {
    return jsonFormatter(jsonString);
}