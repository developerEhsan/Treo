import React from 'react'
import '@renderer/minimal-tiptap/styles/index.css'
import { EditorContent, type Content, type Editor } from '@tiptap/react'
import SectionOne from '@renderer/minimal-tiptap/components/section/one'
import SectionTwo from '@renderer/minimal-tiptap/components/section/two'
import SectionThree from '@renderer/minimal-tiptap/components/section/three'
import SectionFour from '@renderer/minimal-tiptap/components/section/four'
import SectionFive from '@renderer/minimal-tiptap/components/section/five'
import { Separator } from './ui/separator'
import useMinimalTiptapEditor, {
  UseMinimalTiptapEditorProps
} from '@renderer/minimal-tiptap/hooks/use-minimal-tiptap'
import { MeasuredContainer } from '@renderer/minimal-tiptap/components/measured-container'
import { cn } from '@renderer/utils'
import { LinkBubbleMenu } from '@renderer/minimal-tiptap/components/bubble-menu/link-bubble-menu'
import { NotesNavActions } from './home/components/notes-nav-actions'

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  readonly value?: Content
  readonly onChange?: (value: Content) => void
  readonly className?: string
  readonly editorContentClassName?: string
}

function Toolbar({ editor }: { readonly editor: Editor }): React.JSX.Element {
  return (
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
      <div className="flex w-full justify-end">
        <NotesNavActions />
      </div>
      <div className="flex w-max items-center gap-px">
        <SectionOne editor={editor} activeLevels={[1, 2, 3]} variant="outline" />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionTwo
          editor={editor}
          activeActions={[
            'italic',
            'bold',
            'underline',
            'code',
            'strikethrough',
            'clearFormatting'
          ]}
          mainActionCount={5}
          variant="outline"
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionThree editor={editor} variant="outline" />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFour
          editor={editor}
          activeActions={['bulletList', 'orderedList']}
          mainActionCount={2}
          variant="outline"
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFive
          editor={editor}
          activeActions={['blockquote', 'codeBlock', 'horizontalRule']}
          mainActionCount={3}
          variant="outline"
        />
      </div>
    </div>
  )
}

export const MinimalTiptapThree = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
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
        className={cn('flex h-auto w-full flex-col shadow-sm', className)}
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

MinimalTiptapThree.displayName = 'MinimalTiptapThree'

export default MinimalTiptapThree
