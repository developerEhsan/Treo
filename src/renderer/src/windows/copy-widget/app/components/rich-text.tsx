import hljs from 'highlight.js'

export function RichText({ content }: { readonly content: string }): React.JSX.Element {
  const text = hljs.highlightAuto(content)

  return (
    <pre className="text-xs">
      <code>
        <span className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: text.value }} />
      </code>
    </pre>
  )
}
