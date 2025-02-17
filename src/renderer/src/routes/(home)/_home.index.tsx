import InteractiveGrid from '@renderer/components/animata/interactive-grid'
import { createFileRoute } from '@tanstack/react-router'
import { FilePenLineIcon } from 'lucide-react'

export const Route = createFileRoute('/(home)/_home/')({
  component() {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <InteractiveGrid>
          <div className="pointer-events-none my-24 flex h-fit max-w-sm flex-col items-center justify-center text-center text-foreground">
            <h1 className="text-3xl font-bold flex gap-3">
              <FilePenLineIcon size={32} />

              <span>Select or Create Note</span>
            </h1>

            <p className="text-balance text-base text-muted-foreground">
              Begin working by either selecting a previously saved note or creating a brand new one.
            </p>
          </div>
        </InteractiveGrid>
      </div>
    )
  }
})
