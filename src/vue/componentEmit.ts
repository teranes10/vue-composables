export type ComponentEmit<T> = T extends new () => { $emit: infer E }
  ? NonNullable<E>
  : T extends (
    props: any,
    ctx: { slots: any, attrs: any, emit: infer E },
    ...args: any
  ) => any
    ? NonNullable<E>
    : NonNullable<unknown>
