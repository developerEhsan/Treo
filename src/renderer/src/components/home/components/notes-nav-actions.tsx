import React from 'react'
import { Star } from 'lucide-react'
import { Button } from '../../ui/button'
import { formatDistanceToNow } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { allNoteKey, queryKeys } from '@renderer/constants/query-keys'
import { NoteInterface } from '@renderer/types/notes'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { cn } from '@renderer/utils'
import { toast } from '@renderer/hooks/use-toast'

export function NotesNavActions(): React.JSX.Element {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const noteId = pathname.replace('/', '')
  const noteData = queryClient.getQueryData<NoteInterface>([queryKeys.note, noteId])
  const isMutatingNote = queryClient.isMutating({
    mutationKey: [mutationKeys['update-note'], noteId, 'toggle-favorite']
  })
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['update-note'], noteId],
    mutationFn: (values: { id: string; favorite: boolean }) =>
      window.api.toggleFavoriteNote(values),
    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: allNoteKey })
      const snapshot = queryClient.getQueryData(allNoteKey)
      queryClient.setQueryData<NoteInterface[]>(allNoteKey, (previousEntities) =>
        previousEntities?.map((entity) =>
          entity.id.toString() === variables.id
            ? {
                ...entity,
                favorite: variables.favorite,
                updatedAt: Date.now()
              }
            : entity
        )
      )
      queryClient.setQueryData<NoteInterface>([queryKeys.note, noteId], (previousNote) => {
        if (!previousNote) return
        return {
          ...previousNote,
          favorite: variables.favorite,
          updatedAt: Date.now()
        }
      })
      return { snapshot }
    },
    onError(error) {
      toast({
        title: 'Failed to toggle favorite ❌ ',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-medium text-muted-foreground md:inline-block capitalize">
        {isMutatingNote > 0
          ? 'Saving ...'
          : `Edited ${formatDistanceToNow(new Date(Number(noteData?.updatedAt)), {
              addSuffix: true,
              includeSeconds: true
            })}`}
      </div>
      <Button
        onClick={() => mutate({ id: noteId, favorite: !noteData?.favorite })}
        variant="ghost"
        size="icon"
        className="h-7 w-7"
      >
        <Star size={16} className={cn(noteData?.favorite ? 'fill-amber-300' : null)} />
      </Button>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              'h-3 w-3 rounded-full',
              isMutatingNote > 0 ? 'bg-blue-500' : 'bg-green-500'
            )}
          />
        </TooltipTrigger>
        <TooltipContent>Saved</TooltipContent>
      </Tooltip>
    </div>
  )
}
