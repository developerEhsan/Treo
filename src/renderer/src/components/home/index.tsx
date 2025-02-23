import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import { Separator } from '../ui/separator'
import { TooltipProvider } from '../ui/tooltip'
import { NoteInterface } from '@renderer/types/notes'
import { NoteList } from './components/note-list'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'
import { SimpleTooltip } from '../shared/simple-tooltip'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { allNoteKey } from '@renderer/constants/query-keys'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { toast } from '@renderer/hooks/use-toast'
import { noteTitleDescription } from '@renderer/utils'

interface NoteProps {
  readonly Notes: NoteInterface[]
  readonly defaultLayout?: number[]
  readonly defaultCollapsed?: boolean
}

interface FormValues {
  title: string
  description: string
}
const defaultNoteValues = { title: 'Untitled', description: 'no description available' }
export function Note({ Notes, defaultLayout = [12, 32, 48] }: NoteProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['create-note']],
    mutationFn: (values: FormValues & { content: object | unknown[] }) =>
      window.api.createNote(values),
    async onSettled(data) {
      await queryClient.cancelQueries({ queryKey: allNoteKey })
      if (!data) throw Error('Returned Data is Empty')
      queryClient.setQueryData<NoteInterface[]>(allNoteKey, (previousEntities) => {
        // Ensure previousEntities is an array, defaulting to an empty array if it's undefined
        const entities = previousEntities || []
        const createdNote = data || {}
        return [...entities, createdNote]
      })
      toast({ title: 'New Note Created 🎉' })
      navigate({ to: `/${data.id}` })
    },
    onError(error) {
      toast({
        title: 'Failed to create note ❌ ',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        className="h-full max-h-[800px] items-stretch"
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:Note=${JSON.stringify(sizes)}`
        }}
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <div className="flex items-center px-4 py-2 justify-between">
            <h1 className="text-xl font-bold">All Notes</h1>
            <SimpleTooltip content="Create New Note">
              <Button
                onClick={() =>
                  mutate({
                    ...defaultNoteValues,
                    content: noteTitleDescription(defaultNoteValues)
                  })
                }
                variant={'ghost'}
                size="icon"
              >
                <PlusIcon size={18} />
              </Button>
            </SimpleTooltip>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60" />
          <NoteList items={Notes} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[3]} minSize={30}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
