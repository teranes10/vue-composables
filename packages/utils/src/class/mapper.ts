export function mapper<T>(ClassType: { new(...args: any[]): T }, src: any) {
  const instance = new ClassType() as any
  for (const key of Object.keys(instance)) {
    if (!Object.prototype.hasOwnProperty.call(src, key)) {
      continue
    }

    instance[key] = src[key]
  }

  return instance
}
