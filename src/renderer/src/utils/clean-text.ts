export function cleanText(text: string): string {
  const lines = text.split('\n')
  // Find the leading spaces on the first non-empty line
  const firstNonEmptyLine = lines.find((line) => line.trim() !== '')
  // Remove only that many spaces from each line
  return lines
    .map((line) =>
      line.startsWith(' ')
        ? line.slice(firstNonEmptyLine ? firstNonEmptyLine.match(/^(\s*)/)?.[1].length || 0 : 0)
        : line
    ) // Remove fixed spaces
    .join('\n') // Rejoin lines
    .trimEnd() // Trim extra spaces at the end
}
