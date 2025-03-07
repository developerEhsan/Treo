import { useRef, useEffect } from 'react'
import { LoaderCircleIcon, Loader2Icon } from 'lucide-react'
import { Dialog, DialogContent } from '@renderer/components/ui/dialog'
import { Command, CommandEmpty, CommandInput, CommandList } from '@renderer/components/ui/command'
import { CommandLoading, Command as CommandPrimitive } from 'cmdk'
import { cn } from '@renderer/utils'
import { useInfiniteQuery } from '@tanstack/react-query'
import { copyWidgetStore } from '@renderer/store/copy-widget-store'
import { WidgetCommandItem } from './components/widget-command-item'
import { queryKeys } from '@renderer/constants/query-keys'

export function CopyWidget(): React.JSX.Element {
  const listEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<React.ComponentRef<typeof CommandPrimitive.Input>>(null)
  const itemRef = useRef<React.ComponentRef<typeof CommandPrimitive.Item>>(null)
  const { state, searchQuery, setState, setSearchQuery } = copyWidgetStore()
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKeys['clipboard-data']],
    queryFn: ({ pageParam }) =>
      window.api.search({ page: pageParam, searchTerm: searchQuery, limit: 15 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    const selectedElement = document.querySelector('[data-selected="true"]') as HTMLElement | null
    if (!selectedElement) return
    const elemIndex = Number(selectedElement.dataset.index ?? -1)
    const isLastItem = selectedElement.dataset.islast === 'true'
    if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
      setState({ index: elemIndex, opened: elemIndex >= 0 ? 'detailed' : null })
    } else {
      setState({ opened: null })
      inputRef.current?.focus()
    }
    if (e.key === 'ArrowDown' && isLastItem) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }

  // Flatten all pages to get total items count
  const allItems =
    data?.pages.flatMap((page) =>
      page.results.map((result) => ({ ...result, currentPage: page.currentPage }))
    ) || []

  const lastItem = allItems.at(-5)

  function onOpenChange(): void {
    inputRef.current?.focus()
    window.api.closeWindow().then(() => {
      setSearchQuery('')
    })
  }

  return (
    <Dialog modal onOpenChange={onOpenChange} open>
      <DialogContent
        className={cn(state.opened === 'detailed' ? 'left-[40%]!' : null, 'p-0 min-w-[50vw]!')}
      >
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 scroll-smooth!"
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
          <CommandList>
            {isLoading ? (
              <CommandLoading className="min-h-40 w-full h-full flex items-center justify-center">
                <LoaderCircleIcon className="animate-spin" size={32} />
              </CommandLoading>
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {allItems.map((clipboardData) => (
              <WidgetCommandItem
                key={`${clipboardData.id}-${clipboardData.createdAt}`}
                inputRef={inputRef}
                itemRef={itemRef}
                lastItem={lastItem}
                {...clipboardData}
              />
            ))}

            <div ref={listEndRef} className="w-full h-full flex items-center justify-center">
              {hasNextPage ? (
                <Loader2Icon size={18} className="animate-spin my-4" />
              ) : (
                <span className="text-muted-foreground text-center my-4">
                  No More data available
                </span>
              )}
            </div>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
