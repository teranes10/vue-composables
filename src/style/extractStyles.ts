export function extractStyles() {
  if (!document) {
    throw new Error('document is undefined')
  }

  return Array.from(document.styleSheets)
    ?.flatMap(styleSheet => Array.from(styleSheet.cssRules))
    ?.map(rule => rule.cssText)
    ?.join('')
}
