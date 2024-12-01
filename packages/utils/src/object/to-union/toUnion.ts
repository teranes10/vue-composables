export type ToUnion<T, Key extends string = 'key', Value extends string = 'value', Prefix extends string = ''> = {
  [K in keyof T]: { [P in Key]: `${Prefix}${K & string}` } & { [Q in Value]: T[K] };
}[keyof T]
