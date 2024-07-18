export type FunctionParams<T> = T extends (...args: infer P) => any ? P : never
