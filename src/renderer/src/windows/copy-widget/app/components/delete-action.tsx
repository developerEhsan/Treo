import React from 'react'
import { TrashIcon } from '@radix-ui/react-icons'
import { SimpleTooltip } from '@renderer/components/shared/simple-tooltip'
import { Button } from '@renderer/components/ui/button'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { queryKeys } from '@renderer/constants/query-keys'
import { ClipboardDataType } from '@renderer/types/clipboard'
import { toast } from '@renderer/hooks/use-toast'

interface DeleteActionProps {
  id: number
  currentPage: number
  inputRef: React.RefObject<HTMLInputElement | null>
}

export function DeleteAction({ id, currentPage, inputRef }: DeleteActionProps): React.JSX.Element {
  const { setState, searchQuery } = copyWidgetStore()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['delete-clipboard-entry'], id],
    mutationFn: (entryId: string) => window.api.deleteClipboardEntry(entryId),

    async onMutate(clipboardId) {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: [queryKeys['clipboard-data']] })

      // Get a snapshot of the current state
      const snapshot = queryClient.getQueryData([queryKeys['clipboard-data'], searchQuery])

      // Optimistically update the cache
      queryClient.setQueryData<InfiniteData<ClipboardDataType, unknown> | undefined>(
        [queryKeys['clipboard-data'], searchQuery],
        (previousEntities) => {
          if (!previousEntities) return previousEntities
          return {
            ...previousEntities,
            pages: previousEntities.pages.map((page) => {
              if (page.currentPage !== currentPage) return page // Skip non-matching pages
              // Return a new page object with a filtered results array
              return {
                ...page,
                results: page.results.filter((item) => item.id !== Number(clipboardId))
              }
            })
          }
        }
      )

      return { snapshot }
    },
    onError(error) {
      toast({
        title: 'Failed to Delete ❌ ',
        description: error.message,
        variant: 'destructive'
      })
    },
    onSettled() {
      toast({
        title: 'Deleted successfully'
      })
    }
  })
  return (
    <Button
      onClick={() => {
        mutate(id.toString())
        setState({ opened: null })
        inputRef.current?.focus()
      }}
      variant={'ghost'}
      size={'icon'}
      className="focus-visible:ring-0"
    >
      <SimpleTooltip content="Delete">
        <TrashIcon className="hover:text-destructive-foreground" />
      </SimpleTooltip>
    </Button>
  )
}
