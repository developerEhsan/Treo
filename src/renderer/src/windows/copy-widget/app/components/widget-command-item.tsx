import React from 'react'
import { Button } from '@renderer/components/ui/button'
import { CommandItem } from '@renderer/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'
import { ClipboardDataItem } from '@renderer/types/clipboard'
import { cleanText, copyToClipboard } from '@renderer/utils'
import { ArrowRightIcon, SearchIcon } from 'lucide-react'
import { RichText } from './rich-text'

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
  itemRef,
  lastItem
}: WidgetCommandItemProps): React.JSX.Element {
  const { popover, setPopover } = copyWidgetStore()
  return (
    <Popover
      key={`${id}-${createdAt}`}
      onOpenChange={(open) => {
        inputRef.current?.focus()
        setPopover({ isOpen: open })
      }}
      open={popover.index === id && popover.isOpen}
    >
      <PopoverTrigger asChild className="flex duration-500 ease-in-out">
        <CommandItem
          className="duration-500 ease-in-out"
          data-index={id}
          data-islast={lastItem?.id === id}
          onSelect={() => {
            copyToClipboard(content)
            window.api.pasteCopied()
          }}
          ref={itemRef}
          value={`${id}-${createdAt}`}
        >
          <div className="flex min-w-full items-center content-center justify-between">
            <div className="flex items-center">
              <SearchIcon className="mr-2 h-4 w-4" />

              <p className="line-clamp-2">{content}</p>
            </div>

            <div className="flex">
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setPopover({ isOpen: true, index: id })
                }}
                size="icon"
                variant="ghost"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CommandItem>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[500px] p-0 rounded-lg ml-8 scroll-smooth"
        onWheel={(e) => e.stopPropagation()}
        side="right"
      >
        <div className="p-4 bg-popover text-popover-foreground">
          <h4 className="font-semibold mb-2">Detailed View</h4>

          <RichText content={cleanText(content)} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
