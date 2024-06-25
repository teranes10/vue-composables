import { getParameters } from './getParameters'

export function getAccessedProps(functionStr: string) {
  const arrowIndex = functionStr.indexOf('=>')
  let body = functionStr.slice(arrowIndex + 2).trim()

  if (body.startsWith('{') && body.endsWith('}')) {
    body = body.slice(1, -1).trim()
  }

  const params = getParameters(functionStr)
  const propAccesses = body.match(
    new RegExp(`\\b(?:${params.join('|')})\\.[\\w.]+\\b`, 'g'),
  )

  if (!propAccesses) {
    return {}
  }

  const accesses: Record<string, string[]> = {}
  propAccesses.forEach((access) => {
    const [param, ...props] = access.split('.')
    const propPath = props.join('.')

    if (accesses[param]) {
      accesses[param].push(propPath)
    }
    else {
      accesses[param] = [propPath]
    }
  })

  return accesses
}
