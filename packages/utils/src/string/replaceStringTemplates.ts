export function replaceStringTemplates(
  template: string,
  replacements: Record<string, string>,
) {
  const replacedKeys: Set<string> = new Set()
  const notReplacedKeys: Set<string> = new Set()

  const value = template.replace(/\{(\w+)\}/g, (match, key) => {
    const replacement = replacements[key]
    if (replacement !== undefined) {
      replacedKeys.add(key)
      return replacement
    }

    notReplacedKeys.add(key)
    return match
  })

  return {
    value,
    replacedKeys: Array.from(replacedKeys),
    notReplacedKeys: Array.from(notReplacedKeys),
  }
}
