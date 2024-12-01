import { nextTick, watch } from '@vue/runtime-core'
import type { WatchCallback, WatchSource, WatchStopHandle } from '@vue/reactivity'
import { debounce } from '@teranes/utils'
import type { Params } from '@teranes/utils'

export interface WatchOnceOptions<Immediate = boolean> {
  immediate?: Immediate
  deep?: boolean
  debounceDelay?: number
  timeout?: number
}

export function watchOnce<T extends Readonly<WatchSource<unknown>[]>, Immediate extends Readonly<boolean> = false>(
  source: [...T],
  options?: WatchOnceOptions<Immediate>
): Promise<Params<WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>>>

export function watchOnce<T, Immediate extends Readonly<boolean> = false>(
  sources: WatchSource<T>,
  options?: WatchOnceOptions<Immediate>
): Promise<Params<WatchCallback<T, Immediate extends true ? T | undefined : T>>>

export function watchOnce<Immediate extends Readonly<boolean> = false>(
  source: any,
  { immediate, deep, debounceDelay, timeout = 3000 }: WatchOnceOptions<Immediate> = {},
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let stop: WatchStopHandle | undefined

    const cb = (...args: any[]) => {
      nextTick(() => stop?.())
      resolve(args)
    }

    const debouncedCb = debounce ? debounce(cb, debounceDelay) : cb
    stop = watch(source, debouncedCb, { immediate, deep })

    setTimeout(() => {
      stop?.()
      reject(new Error('timeout reached'))
    }, timeout)
  })
}

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
}

type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : never;
}
