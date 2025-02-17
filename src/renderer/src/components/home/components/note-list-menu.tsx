import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@renderer/components/ui/menubar'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { allNoteKey } from '@renderer/constants/query-keys'
import { NoteInterface } from '@renderer/types/notes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { MoreVerticalIcon, Trash2Icon } from 'lucide-react'

interface NoteListMenuProps {
  readonly id: string
}
export function NoteListMenu({ id }: NoteListMenuProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const noteId = pathname.replace('/', '')
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['delete-note'], id],
    mutationFn: (noteId: string) => window.api.deleteNote(noteId),
    async onMutate(noteId) {
      await queryClient.cancelQueries({ queryKey: allNoteKey })
      const snapshot = queryClient.getQueryData(allNoteKey)
      queryClient.setQueryData<NoteInterface[]>(allNoteKey, (previousEntities) =>
        previousEntities?.filter((note) => note.id.toString() !== noteId)
      )
      return { snapshot }
    },
    onSettled() {
      if (noteId === id) {
        navigate({ to: '/' })
      }
    }
  })
  return (
    <Menubar className="border-none rounded-full bg-transparent p-0 h-auto">
      <MenubarMenu>
        <MenubarTrigger
          className="p-1 cursor-pointer"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <MoreVerticalIcon size={12} />
        </MenubarTrigger>

        <MenubarContent>
          <MenubarItem
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              mutate(id)
            }}
          >
            <Trash2Icon size={14} className="text-destructive mr-2" />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
