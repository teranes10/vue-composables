import { isObject } from '../is-object/isObject'

interface ObjectAssignOptions {
  force?: boolean // Map all properties in src, except only map properties in target if they exist.
  ignoreNull?: boolean // Ignore src null values
}

export function objectAssign(target: any, src: any, { force, ignoreNull }: ObjectAssignOptions = {}) {
  if (src == null) {
    return target
  }

  if (target == null) {
    if (!force) {
      return undefined
    }

    target ??= {}
  }

  for (const prop in src) {
    if (!Object.prototype.hasOwnProperty.call(target, prop)) {
      if (!force) {
        continue
      }
    }

    target[prop] = getValue(target[prop], src[prop], { force, ignoreNull })
  }

  return target
}

function getValue(target: any, src: any, { force, ignoreNull }: ObjectAssignOptions = {}) {
  if (src == null) {
    return ignoreNull ? target : undefined
  }

  if (isObject(src)) {
    return objectAssign(target, src, { force, ignoreNull })
  }

  return src
}
