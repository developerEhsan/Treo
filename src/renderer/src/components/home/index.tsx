import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import { Separator } from '../ui/separator'
import { TooltipProvider } from '../ui/tooltip'
import { NoteInterface } from '@renderer/types/notes'
import { NoteList } from './components/note-list'
import { Outlet } from '@tanstack/react-router'

interface NoteProps {
  readonly Notes: NoteInterface[]
  readonly defaultLayout?: number[]
  readonly defaultCollapsed?: boolean
}

export function Note({ Notes, defaultLayout = [12, 32, 48] }: NoteProps): React.JSX.Element {
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        className="h-full max-h-[800px] items-stretch"
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:Note=${JSON.stringify(sizes)}`
        }}
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">All Notes</h1>
          </div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60"></div>
          <NoteList items={Notes} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[3]} minSize={30}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
