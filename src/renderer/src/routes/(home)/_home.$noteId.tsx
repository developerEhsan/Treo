import { createFileRoute, useParams } from '@tanstack/react-router'
import { NoteEditor } from '@renderer/components/home/components/note-editor'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@renderer/constants/query-keys'
import { Loading } from '@renderer/components/shared/loading'

export const Route = createFileRoute('/(home)/_home/$noteId')({
  component() {
    const { noteId } = useParams({ from: '/(home)/_home/$noteId' })
    const { data, isLoading } = useQuery({
      queryKey: [queryKeys.note, noteId],
      queryFn: () => window.api.getNote(noteId),
      enabled: Boolean(noteId)
    })
    if (!data) return <span>Not Found!</span>
    if (isLoading) return <Loading />
    return <NoteEditor noteId={noteId} {...data} />
  }
})
