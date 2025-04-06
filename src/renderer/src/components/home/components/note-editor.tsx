import Editor from '@renderer/components/editor'
import { useSidebar } from '@renderer/components/ui/sidebar'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { allNoteKey, queryKeys } from '@renderer/constants/query-keys'
import { toast } from '@renderer/hooks/use-toast'
import { NoteInterface } from '@renderer/types/notes'
import { cn, extractTitleAndDescription } from '@renderer/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Content } from '@tiptap/react'

interface UpdateNote {
  id: string
  content: Content
  title?: string | null
  description?: string | null
}

interface NoteEditorProps extends NoteInterface {
  readonly noteId: string
}

export function NoteEditor({
  content,
  title,
  description,
  noteId
}: NoteEditorProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const { setOpen } = useSidebar()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['update-note'], noteId],
    mutationFn: (values: UpdateNote) => window.api.updateNote(values),
    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: allNoteKey })
      const snapshot = queryClient.getQueryData(allNoteKey)
      queryClient.setQueryData<NoteInterface[]>(allNoteKey, (previousEntities) =>
        previousEntities?.map((entity) =>
          entity.id.toString() === variables.id
            ? {
                ...entity,
                title: variables.title ?? title,
                description: variables.description ?? description,
                updatedAt: Date.now()
              }
            : entity
        )
      )
      queryClient.setQueryData<NoteInterface>([queryKeys.note, noteId], (previousNote) => {
        if (!previousNote) return
        return {
          ...previousNote,
          updatedAt: Date.now()
        }
      })
      return { snapshot }
    },
    onError(error) {
      toast({
        title: 'Failed to update note ❌ ',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
  function onChange(content: Content): void {
    const note = extractTitleAndDescription(
      // @ts-expect-error ---
      content?.content as ContentNode[]
    )
    console.log(content)

    mutate({
      id: noteId,
      content: content,
      description: note?.description ?? description,
      title: note?.title ?? title
    })
  }
  return (
    <Editor
      className={cn('h-full min-h-56 w-full rounded-xl')}
      editable
      editorClassName="focus:outline-hidden px-5 py-4 h-full"
      editorContentClassName="overflow-auto h-full"
      enableContentCheck
      key={noteId}
      onChange={onChange}
      onFocus={() => setOpen(false)}
      output="json"
      placeholder="This is your placeholder..."
      throttleDelay={1000} // 1 sec
      value={content}
    />
  )
}
