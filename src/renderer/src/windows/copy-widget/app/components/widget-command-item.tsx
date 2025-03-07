import React from 'react'
import { Button } from '@renderer/components/ui/button'
import { CommandItem } from '@renderer/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'
import { ClipboardDataItem } from '@renderer/types/clipboard'
import { copyToClipboard } from '@renderer/utils'
import { RichText } from './rich-text'
import { CaretRightIcon, DrawingPinIcon, TextIcon, TrashIcon } from '@radix-ui/react-icons'
import { SimpleTooltip } from '@renderer/components/shared/simple-tooltip'
import { formatDistanceToNow } from 'date-fns'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { queryKeys } from '@renderer/constants/query-keys'
import { toast } from '@renderer/hooks/use-toast'
import { ClipboardDataType } from '@renderer/types/clipboard'
interface WidgetCommandItemProps extends ClipboardDataItem {
  inputRef: React.RefObject<HTMLInputElement | null>
  itemRef: React.RefObject<HTMLDivElement | null>
  lastItem?: ClipboardDataItem
}
export function WidgetCommandItem({
  content,
  createdAt,
  id,
  inputRef,
  currentPage,
  itemRef,
  lastItem
}: WidgetCommandItemProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const { state, setState } = copyWidgetStore()
  const { mutate } = useMutation({
    mutationKey: [mutationKeys['delete-clipboard-entry'], id],
    mutationFn: (entryId: string) => window.api.deleteClipboardEntry(entryId),

    async onMutate(clipboardId) {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: [queryKeys['clipboard-data']] })

      // Get a snapshot of the current state
      const snapshot = queryClient.getQueryData([queryKeys['clipboard-data']])

      // Optimistically update the cache
      queryClient.setQueryData<InfiniteData<ClipboardDataType, unknown> | undefined>(
        [queryKeys['clipboard-data']],
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
    <Popover
      open={state.index === id && state.opened === 'detailed'}
      onOpenChange={(open) => {
        inputRef.current?.focus()
        setState({ opened: open ? 'detailed' : null })
      }}
    >
      <PopoverTrigger asChild className="flex">
        <CommandItem
          className="cursor-pointer"
          data-index={id}
          data-islast={lastItem?.id === id}
          ref={itemRef}
          value={`${id}-${createdAt}`}
          onSelect={() => {
            copyToClipboard(content)
            window.api.pasteCopied()
          }}
        >
          <div className="flex min-w-full items-center content-center justify-between">
            <div className="flex items-center">
              <TextIcon className="mr-2 h-4 w-4" />
              <p className="line-clamp-4">{content}</p>
            </div>
            <div className="flex">
              <SimpleTooltip
                content={
                  <span className="text-sm flex items-center">
                    press&nbsp;<span>⌘</span>
                    +
                    <CaretRightIcon />
                  </span>
                }
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setState({ opened: 'detailed', index: id })
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <CaretRightIcon className="text-muted-foreground" />
                </Button>
              </SimpleTooltip>
            </div>
          </div>
        </CommandItem>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="right"
        className="w-[500px] p-0 rounded-lg ml-8 scroll-smooth"
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-popover text-popover-foreground">
          <div className="flex justify-between">
            <div className="flex gap-4 items-center justify-center">
              <h4 className="font-semibold mb-2">Detailed View</h4>
              <span className="text-muted-foreground text-xs">
                copied about&nbsp;
                {formatDistanceToNow(new Date(Number(createdAt)), {
                  addSuffix: true,
                  includeSeconds: true
                })}
              </span>
            </div>
            <div className="flex gap-3 text-muted-foreground duration-200">
              <Button
                onClick={() => {
                  mutate(id.toString(), {
                    onError(error, variables, context) {
                      console.error(error, variables, context)
                    }
                  })
                  setState({ opened: null })
                }}
                variant={'ghost'}
                size={'icon'}
              >
                <SimpleTooltip content="Delete">
                  <TrashIcon className="hover:text-destructive-foreground" />
                </SimpleTooltip>
              </Button>
              <Button variant={'ghost'} size={'icon'}>
                <SimpleTooltip content="Pin">
                  <DrawingPinIcon />
                </SimpleTooltip>
              </Button>
            </div>
          </div>
          <RichText content={content} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
