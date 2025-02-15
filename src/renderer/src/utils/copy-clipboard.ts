export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text)
  console.log('Copied to clipboard')
}
