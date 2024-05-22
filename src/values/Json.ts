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

export function useToJsonStringFormatter(json: any) {
    if (typeof json !== 'object') {
        return '';
    }

    return jsonFormatter(json);
}