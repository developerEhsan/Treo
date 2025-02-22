import * as React from 'react'
import type { TooltipContentProps } from '@radix-ui/react-tooltip'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { Toggle } from '@renderer/components/ui/toggle'
import { cn } from '@renderer/utils'

interface ToolbarButtonProps extends React.ComponentPropsWithoutRef<typeof Toggle> {
  readonly isActive?: boolean
  readonly tooltip?: string
  readonly tooltipOptions?: TooltipContentProps
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ isActive, children, tooltip, className, tooltipOptions, ...props }, ref) => {
    const toggleButton = (
      <Toggle
        className={cn('size-8 p-0', { 'bg-accent': isActive }, className)}
        ref={ref}
        size="sm"
        {...props}
      >
        {children}
      </Toggle>
    )

    if (!tooltip) {
      return toggleButton
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>

        <TooltipContent {...tooltipOptions}>
          <div className="flex flex-col items-center text-center">{tooltip}</div>
        </TooltipContent>
      </Tooltip>
    )
  }
)

ToolbarButton.displayName = 'ToolbarButton'

export default ToolbarButton
