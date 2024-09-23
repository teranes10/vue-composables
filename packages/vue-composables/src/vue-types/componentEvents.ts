import type { ComponentProps } from './componentProps'

export type ComponentEvents<T> = {
  [K in keyof ComponentProps<T> as K extends `on${infer _}`
    ? K extends `onVnode${infer _}`
      ? never
      : K
    : never
  ]: ComponentProps<T>[K]
}
