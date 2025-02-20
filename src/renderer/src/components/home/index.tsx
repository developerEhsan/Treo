import { SearchIcon } from 'lucide-react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { TooltipProvider } from '../ui/tooltip'
import { Input } from '../ui/input'
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
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>

              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                  All Note
                </TabsTrigger>

                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>

            <Separator />

            <div className="bg-background/95 p-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
              <form>
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>

            <TabsContent value="all" className="m-0">
              <NoteList items={Notes} />
            </TabsContent>

            {/* <TabsContent value="unread" className="m-0">
                <NoteList items={Notes.filter((item) => !item.read)} />
              </TabsContent> */}
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[3]} minSize={30}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
