type EmitsToProps<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: T[K] extends any[] ? (...args: T[K]) => void : () => void;
}

export type Attrs<PROPS, EMITS> = PROPS & EmitsToProps<EMITS>
