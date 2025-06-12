export function renderString(templateStr: string, context: Record<string, unknown>): string {
  const keys = Object.keys(context)
  const values = Object.values(context)

  // This reconstructs a dynamic function that interprets the template string
  const fn = new Function(...keys, `return \`${templateStr}\`;`)
  return fn(...values)
}
