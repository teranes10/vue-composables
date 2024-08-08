export type Merge<Type, NewType> = Omit<Type, keyof NewType> & NewType
