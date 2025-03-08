import hljs from 'highlight.js'
import { useMemo } from 'react'

export function RichText({ content }: { readonly content: string }): React.JSX.Element {
  const text = hljs.highlightAuto(content)
  const innerHtml = useMemo(
    () => ({
      __html: text.value
    }),
    [text.value]
  )
  return (
    <pre className="text-xs">
      <code>
        <span className="whitespace-pre-wrap" dangerouslySetInnerHTML={innerHtml} />
      </code>
    </pre>
  )
}
