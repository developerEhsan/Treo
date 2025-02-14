export function noteTitleDescription({
  description,
  title
}: {
  title: string
  description: string
}): {
  type: string
  content: (
    | {
        type: string
        attrs: {
          level: number
        }
        content: {
          type: string
          text: string
        }[]
      }
    | {
        type: string
        content: {
          type: string
          text: string
        }[]
        attrs?: undefined
      }
  )[]
} {
  return {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1
        },
        content: [
          {
            type: 'text',
            text: title
          }
        ]
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: description
          }
        ]
      }
    ]
  }
}
