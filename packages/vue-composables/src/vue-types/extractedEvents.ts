export type ExtractedEvents<T> = {
  [K in keyof T as K extends `on${string}` ? K : never]: T[K]
}
