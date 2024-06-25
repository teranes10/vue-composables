import { format as jsonFormatter } from 'json-string-formatter'

export function jsonStringFormatter<T>(json: T) {
  if (!json) {
    return ''
  }

  return jsonFormatter(JSON.stringify(json))
}
