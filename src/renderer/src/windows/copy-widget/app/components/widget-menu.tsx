import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { ClipboardXIcon, MoreHorizontal } from 'lucide-react'
import { modalStore } from '@renderer/store/modal-store'

export function WidgetMenu(): React.JSX.Element {
  const { openModal } = modalStore()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal size={16} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => openModal('clear-clipboard-dialog')}>
          <ClipboardXIcon size={16} />
          <span>Clear Clipboard</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
