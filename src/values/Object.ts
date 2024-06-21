import { Last } from "../types/common-types";

export {
  cloneDeep as useCloneDeep,
  mapKeys as useMapKeys,
  mapValues as useMapValues,
  isPlainObject as useIsPlainObject,
  isArray as useIsArray
} from "lodash-es";

export function useObjectValueByPath(
  item: any,
  path: string,
  value?: any
): any {
  const keys = path.split(".");
  let current = item;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }

    current = current[key];
  }

  if (!useIsNull(value)) {
    current[keys[keys.length - 1]] = value;
  }

  return current[keys[keys.length - 1]];
}

export function useIsNull(val: any) {
  return val === null || val === undefined;
}

export function useCoalesce<T extends any[]>(...values: T): Last<T> {
  for (const value of values) {
    if (!useIsNull(value)) {
      return value;
    }
  }

  return undefined as Last<T>;
}

export function useCoalesceTruthy<T extends any[]>(...values: T): Last<T> {
  for (const value of values) {
    if (value) {
      return value;
    }
  }

  return useCoalesce(...values);
}

export function useMapper<T>(
  classType: { new(...args: any[]): T },
  src: any
): T {
  const instance = new classType() as any;
  for (const key of Object.keys(instance)) {
    instance[key] = src[key];
  }

  return instance;
}

export function useIsNullOrEmptyObject(val: any) {
  if (!val) {
    return true;
  }

  if (typeof val !== 'object') {
    return false;
  }

  if (Array.isArray(val)) {
    return val.length === 0
  }

  return Object.keys(val).length === 0;
}