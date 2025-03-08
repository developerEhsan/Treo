import React from 'react'
import { Button } from '@renderer/components/ui/button'
import { CommandItem } from '@renderer/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'
import { ClipboardDataItem } from '@renderer/types/clipboard'
import { copyToClipboard } from '@renderer/utils'
import { RichText } from './rich-text'
import { CaretRightIcon, DrawingPinFilledIcon, TextIcon } from '@radix-ui/react-icons'
import { SimpleTooltip } from '@renderer/components/shared/simple-tooltip'
import { formatDistanceToNow } from 'date-fns'
import { DeleteAction } from './delete-action'
import { PinAction } from './pin-action'
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
  lastItem,
  pinned
}: WidgetCommandItemProps): React.JSX.Element {
  const { state, setState } = copyWidgetStore()

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
            <div className="flex items-center">
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
              {pinned ? <DrawingPinFilledIcon className="text-muted-foreground text-sm" /> : null}
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
            <div className="flex text-muted-foreground duration-200">
              <DeleteAction id={id} inputRef={inputRef} currentPage={currentPage} />
              <PinAction currentPage={currentPage} id={id} inputRef={inputRef} pinned={pinned} />
            </div>
          </div>
          <RichText content={content} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
