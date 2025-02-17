import React from 'react'
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2
} from 'lucide-react'
import { Button } from '../../ui/button'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar
} from '../../ui/sidebar'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { formatDistanceToNow } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { queryKeys } from '@renderer/constants/query-keys'
import { NoteInterface } from '@renderer/types/notes'
import { mutationKeys } from '@renderer/constants/mutation-keys'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { cn } from '@renderer/utils'

const data = [
  [
    {
      label: 'Customize Page',
      icon: Settings2
    },
    {
      label: 'Turn into wiki',
      icon: FileText
    }
  ],
  [
    {
      label: 'Copy Link',
      icon: Link
    },
    {
      label: 'Duplicate',
      icon: Copy
    },
    {
      label: 'Move to',
      icon: CornerUpRight
    },
    {
      label: 'Move to Trash',
      icon: Trash2
    }
  ],
  [
    {
      label: 'Undo',
      icon: CornerUpLeft
    },
    {
      label: 'View analytics',
      icon: LineChart
    },
    {
      label: 'Version History',
      icon: GalleryVerticalEnd
    },
    {
      label: 'Show delete pages',
      icon: Trash
    },
    {
      label: 'Notifications',
      icon: Bell
    }
  ],
  [
    {
      label: 'Import',
      icon: ArrowUp
    },
    {
      label: 'Export',
      icon: ArrowDown
    }
  ]
]

export function NotesNavActions(): React.JSX.Element {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const noteId = pathname.replace('/', '')
  const noteData = queryClient.getQueryData<NoteInterface>([queryKeys.note, noteId])
  const isMutatingNote = queryClient.isMutating({
    mutationKey: [mutationKeys['update-note'], noteId]
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

      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star size={16} />
      </Button>

      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              isMutatingNote > 0 ? 'bg-blue-500' : 'bg-green-500'
            )}
          />
        </TooltipTrigger>

        <TooltipContent>Saved</TooltipContent>
      </Tooltip>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 data-[state=open]:bg-accent">
            <MoreHorizontal size={16} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-56 overflow-hidden rounded-lg p-0" align="end">
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
