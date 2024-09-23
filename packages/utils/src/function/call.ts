import { isAsyncFunction } from './isAsyncFunction'
import { isFunction } from './isFunction'

export function call(func: any, ...args: any[]): Promise<any> {
  if (!isFunction(func)) {
    return Promise.reject(new Error('Provided value is not a function'))
  }

  try {
    if (isAsyncFunction(func)) {
      return func(...args)
    }

    const result = func(...args)
    return Promise.resolve(result)
  }
  catch (error) {
    return Promise.reject(error)
  }
}
