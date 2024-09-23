export type ComponentType<T> = T extends new () => infer E
  ? E
  : T extends (
    props: any,
    ctx: any,
    expose: (exposed: infer E) => any,
    ...args: any
  ) => any
    ? NonNullable<E & { $refs: Record<string, HTMLElement> }>
    : NonNullable<unknown>
