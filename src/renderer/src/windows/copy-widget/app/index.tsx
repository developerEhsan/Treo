import { useRef, useEffect } from 'react'
import { Search, ArrowRight, LoaderCircleIcon, Loader2Icon } from 'lucide-react'
import { Dialog, DialogContent } from '@renderer/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@renderer/components/ui/command'
import { PopoverTrigger, PopoverContent, Popover } from '@renderer/components/ui/popover'
import { CommandLoading, Command as CommandPrimitive } from 'cmdk'
import { cleanText, cn, copyToClipboard } from '@renderer/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { RichText } from './components/rich-text'
import { Button } from '@renderer/components/ui/button'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'

export function CopyWidget(): React.JSX.Element {
  const listEndRef = useRef<HTMLDivElement>(null)
  const { popover, searchQuery, setPopover, setSearchQuery } = copyWidgetStore()
  // const [popoverState, setPopoverState] = useState<PopoverStates>({ index: 0, open: false })
  // const [search, setSearch] = useState('')
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    // queryKey: ['clipboard', search],
    queryKey: [],
    queryFn: ({ pageParam }) =>
      window.api.search({ page: pageParam, searchTerm: searchQuery, limit: 5 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Check if there are more pages to load
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    }
  })

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: '100px',
        threshold: 1 // Trigger when 100% of the element is visible
      }
    )

    if (listEndRef.current) {
      observer.observe(listEndRef.current)
    }

    return (): void => {
      if (listEndRef.current) {
        observer.unobserve(listEndRef.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage])

  const inputRef = useRef<React.ElementRef<typeof CommandPrimitive.Input>>(null)
  const itemRef = useRef<React.ElementRef<typeof CommandPrimitive.Item>>(null)

  // The Command container catches keyboard events
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
      //   @ts-expect-error --- TODO !fix this type later
      const elemIndex = Number(document.querySelector('[data-selected="true"]')?.dataset.index)
      setPopover({ index: elemIndex, isOpen: elemIndex > 0 })
    } else {
      // setPopoverState((prev) => ({ ...prev, open: false }))
      setPopover({ isOpen: false })
      inputRef.current?.focus()
    }

    if (e.key === 'ArrowDown') {
      //   @ts-expect-error --- TODO !fix this type later
      if (document.querySelector('[data-selected="true"]')?.dataset.islast === 'true') {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
      }
    }
  }
  // Flatten all pages to get total items count
  const allItems = data?.pages.flatMap((page) => page.results) || []
  const lastItem = allItems.at(-3)

  return (
    <Dialog
      modal
      onOpenChange={() => {
        inputRef.current?.focus()
        window.api.closeWindow().then(() => {
          setSearchQuery('')
        })
      }}
      open
    >
      <DialogContent className={cn(popover.isOpen ? '!left-[40%]' : null, 'p-0 !min-w-[50vw]')}>
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 !scroll-smooth"
          onKeyDown={handleKeyDown}
          shouldFilter={false}
        >
          <CommandInput
            autoFocus
            defaultValue={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Type to search..."
            ref={inputRef}
          />

          <CommandList className="duration-500 ease-in-out">
            {isLoading ? (
              <CommandLoading className="min-h-40 w-full h-full flex items-center justify-center">
                <LoaderCircleIcon className="animate-spin" size={32} />
              </CommandLoading>
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            <CommandGroup heading="Text">
              {allItems.map(({ content, id, createdAt }) => {
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
                            <Search className="mr-2 h-4 w-4" />

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
                              <ArrowRight className="h-4 w-4" />
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
              })}

              <div ref={listEndRef} className="w-full h-full flex items-center justify-center">
                {hasNextPage ? (
                  <Loader2Icon size={18} className="animate-spin my-4" />
                ) : (
                  <span className="text-muted-foreground text-center my-4">
                    No More data available
                  </span>
                )}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
