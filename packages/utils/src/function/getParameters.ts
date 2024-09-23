export function getParameters(functionStr: string): string[] {
  const params = functionStr.match(/\(([^)]*)\)/)?.[1] || ''
  return params
    .split(',')
    .map(param => param.trim())
    .filter(Boolean)
}
