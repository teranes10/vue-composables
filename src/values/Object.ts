import { cloneDeep } from "lodash-es";

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

export function useCloneDeep<T>(value: T) {
  return cloneDeep(value);
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

export function useObjectAssign(target: any, src: any) {
  for (const prop in src) {
    if (!target.hasOwnProperty(prop)) {
      continue;
    }

    const value = src[prop];
    if (typeof value !== 'object') {
      target[prop] = value;
    }
  }

  return target;
}