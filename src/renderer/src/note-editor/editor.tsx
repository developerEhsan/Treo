import * as React from 'react'
import './styles/index.css'

import type { Content, Editor as TiptapEditor } from '@tiptap/react'
import { EditorContent } from '@tiptap/react'
import { Separator } from '@renderer/components/ui/separator'
import { cn } from '@renderer/utils'
import { SectionOne } from './components/section/one'
import { SectionTwo } from './components/section/two'
import { SectionThree } from './components/section/three'
import { SectionFour } from './components/section/four'
import { SectionFive } from './components/section/five'
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu'
import { MeasuredContainer } from './components/measured-container'
import useEditor, { UseEditorProps } from './hooks/use-editor'

export interface EditorProps extends Omit<UseEditorProps, 'onUpdate'> {
  readonly value?: Content
  readonly onChange?: (value: Content) => void
  readonly className?: string
  readonly editorContentClassName?: string
}

function Toolbar({ editor }: { readonly editor: TiptapEditor }): React.JSX.Element {
  return (
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
      <div className="flex w-max items-center gap-px">
        <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionTwo
          editor={editor}
          activeActions={[
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'code',
            'clearFormatting'
          ]}
          mainActionCount={3}
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionThree editor={editor} />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFour
          editor={editor}
          activeActions={['orderedList', 'bulletList']}
          mainActionCount={0}
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFive
          editor={editor}
          activeActions={['codeBlock', 'blockquote', 'horizontalRule']}
          mainActionCount={0}
        />
      </div>
    </div>
  )
}

export const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useEditor({
      value,
      onUpdate: onChange,
      ...props
    })

    if (!editor) {
      return null
    }

    return (
      <MeasuredContainer
        as="div"
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-xs focus-within:border-primary',
          className
        )}
        name="editor"
        ref={ref}
      >
        <Toolbar editor={editor} />

        <EditorContent
          editor={editor}
          className={cn('minimal-tiptap-editor', editorContentClassName)}
        />

        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    )
  }
)

Editor.displayName = 'Editor'

export default Editor
