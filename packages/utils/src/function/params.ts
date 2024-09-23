export type Params<T> = T extends (...args: infer P) => any ? P : never
