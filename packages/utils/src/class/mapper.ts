export function mapper<T extends { [key: string]: any }, TSrc extends { [key: string]: any } = any>(
  ClassType: { new(): T },
  src: TSrc,
  mappings: { [P in keyof T]?: keyof TSrc | ((item: TSrc) => any) } = {}
): T {
  const instance = new ClassType();

  for (const key of Object.keys(mappings) as Array<keyof T>) {
    const mapping = mappings[key];
    if (typeof mapping === 'function') {
      instance[key] = mapping(src);
    } else if (typeof mapping === 'string' && mapping in src) {
      instance[key] = src[mapping as keyof TSrc] as any;
    }
  }

  for (const key of Object.keys(src) as Array<keyof TSrc>) {
    if (!Object.prototype.hasOwnProperty.call(mappings, key) && key in instance) {
      instance[key as keyof T] = src[key] as any;
    }
  }

  return instance;
}
