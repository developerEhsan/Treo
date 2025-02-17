import React from 'react'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { cn } from '@renderer/utils'
import { formatDistanceToNow } from 'date-fns'
import { NoteInterface } from '@renderer/types/notes'
import { Link, useLocation } from '@tanstack/react-router'
import { NoteListMenu } from './note-list-menu'

interface NoteListProps {
  readonly items: NoteInterface[]
}
export function NoteList({ items }: NoteListProps): React.JSX.Element {
  const { pathname } = useLocation()
  const noteId = pathname.replace('/', '')
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <Link params={{ noteId: String(item.id) }} key={item.id} to="/$noteId">
            <div
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                noteId === item.id.toString() && 'bg-muted'
              )}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold line-clamp-2">{item.title}</div>
                  </div>

                  <NoteListMenu id={item.id.toString()} />
                </div>

                <div className="line-clamp-2 text-xs text-muted-foreground">{item.description}</div>
              </div>

              <div className="flex justify-end w-full">
                <div
                  className={cn(
                    'ml-auto text-xs',
                    noteId === item.id.toString() ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {formatDistanceToNow(new Date(item.updatedAt), {
                    addSuffix: true,
                    includeSeconds: true
                  })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}
