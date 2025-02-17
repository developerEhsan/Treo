import React, { PropsWithChildren, ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { TooltipContentProps, TooltipProps, TooltipTriggerProps } from '@radix-ui/react-tooltip'

interface SimpleTooltipProps extends PropsWithChildren {
  readonly props?: {
    tooltip: TooltipProps
    trigger: React.ForwardRefExoticComponent<
      TooltipTriggerProps & React.RefAttributes<HTMLButtonElement>
    >
    content: React.ForwardRefExoticComponent<
      Omit<TooltipContentProps & React.RefAttributes<HTMLDivElement>, 'ref'> &
        React.RefAttributes<HTMLDivElement>
    >
  }
  readonly content: ReactNode
}

export function SimpleTooltip({ props, children, content }: SimpleTooltipProps): React.JSX.Element {
  return (
    <Tooltip {...props?.tooltip}>
      <TooltipTrigger {...props?.trigger}>{children}</TooltipTrigger>

      <TooltipContent {...props?.content}>{content}</TooltipContent>
    </Tooltip>
  )
}
