import { cn } from '@renderer/utils'
import { Button } from '../ui/button'
import { FilePenLineIcon } from 'lucide-react'
import { modalStore } from '@renderer/store/modal-store'
import { SimpleTooltip } from './simple-tooltip'

/**
 *
 * @deprecated for more see `CreateNoteModal` component
 */
export function CreateNoteButton(): React.JSX.Element {
  const { openModal } = modalStore()
  return (
    <div className="fixed right-8 bottom-4">
      <SimpleTooltip content="Create new Note">
        <Button
          className={cn(
            'h-12 animate-shimmer items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-foreground transition-colors focus:outline-hidden focus:ring-1 focus:ring-offset-foreground rounded-full grid'
          )}
          onClick={() => openModal('create-note-modal')}
          size="icon"
          variant="outline"
        >
          <FilePenLineIcon size={20} className="text-white flex" />
        </Button>
      </SimpleTooltip>
    </div>
  )
}
