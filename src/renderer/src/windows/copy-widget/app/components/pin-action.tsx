import React from 'react'
import { DrawingPinFilledIcon, DrawingPinIcon } from '@radix-ui/react-icons'
import { SimpleTooltip } from '@renderer/components/shared/simple-tooltip'
import { Button } from '@renderer/components/ui/button'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { queryKeys } from '@renderer/constants/query-keys'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'
import { ClipboardDataType } from '@renderer/types/clipboard'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'

interface PinActionProps {
  inputRef: React.RefObject<HTMLInputElement | null>
  id: number
  currentPage: number
  pinned: boolean
}

export function PinAction({ id, currentPage, pinned }: PinActionProps): React.JSX.Element {
  const { searchQuery } = copyWidgetStore()
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['pinned-clipboard-entry'], id],
    mutationFn: (values: { id: string; pinned: boolean }) =>
      window.api.togglePinnedClipboardEntry(values),
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
                results: page.results.map((entity) =>
                  entity.id.toString() === clipboardId.id
                    ? {
                        ...entity,
                        pinned: clipboardId.pinned,
                        updatedAt: Date.now()
                      }
                    : entity
                )
              }
            })
          }
        }
      )
      return { snapshot }
    }
  })
  return (
    <Button
      onClick={() => mutate({ id: id.toString(), pinned: !pinned })}
      variant={'ghost'}
      size={'icon'}
      className="focus-visible:ring-0"
    >
      <SimpleTooltip content="Pin to top">
        {pinned ? <DrawingPinFilledIcon /> : <DrawingPinIcon />}
      </SimpleTooltip>
    </Button>
  )
}
