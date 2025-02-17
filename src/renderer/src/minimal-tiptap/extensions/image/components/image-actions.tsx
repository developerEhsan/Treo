import * as React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { cn } from '@renderer/utils'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {
  ClipboardCopyIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  Link2Icon,
  SizeIcon
} from '@radix-ui/react-icons'

interface ImageActionsProps {
  readonly shouldMerge?: boolean
  readonly isLink?: boolean
  readonly onView?: () => void
  readonly onDownload?: () => void
  readonly onCopy?: () => void
  readonly onCopyLink?: () => void
}

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly icon: React.ReactNode
  readonly tooltip: string
}

export const ActionWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (
    { children, className, ...props }: React.HTMLAttributes<HTMLDivElement>,
    ref
  ): React.JSX.Element => (
    <div
      className={cn(
        'absolute right-3 top-3 flex flex-row rounded px-0.5 opacity-0 group-hover/node-image:opacity-100',
        'border-[0.5px] bg-[var(--mt-bg-secondary)] [backdrop-filter:saturate(1.8)_blur(20px)]',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
)

ActionWrapper.displayName = 'ActionWrapper'

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ icon, tooltip, className, ...props }: ActionButtonProps, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            'relative flex h-7 w-7 flex-row rounded-none p-0 text-muted-foreground hover:text-foreground',
            'bg-transparent hover:bg-transparent',
            className
          )}
          ref={ref}
          variant="ghost"
          {...props}
        >
          {icon}
        </Button>
      </TooltipTrigger>

      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  )
)

ActionButton.displayName = 'ActionButton'

type ActionKey = 'onView' | 'onDownload' | 'onCopy' | 'onCopyLink'

const ActionItems: Array<{
  key: ActionKey
  icon: React.ReactNode
  tooltip: string
  isLink?: boolean
}> = [
  { key: 'onView', icon: <SizeIcon className="size-4" />, tooltip: 'View image' },
  { key: 'onDownload', icon: <DownloadIcon className="size-4" />, tooltip: 'Download image' },
  {
    key: 'onCopy',
    icon: <ClipboardCopyIcon className="size-4" />,
    tooltip: 'Copy image to clipboard'
  },
  {
    key: 'onCopyLink',
    icon: <Link2Icon className="size-4" />,
    tooltip: 'Copy image link',
    isLink: true
  }
]

export const ImageActions: React.FC<ImageActionsProps> = React.memo(
  ({ shouldMerge = false, isLink = false, ...actions }: ImageActionsProps) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleAction = React.useCallback(
      (e: React.MouseEvent, action: (() => void) | undefined) => {
        e.preventDefault()
        e.stopPropagation()
        action?.()
      },
      []
    )

    const filteredActions = React.useMemo(
      () => ActionItems.filter((item) => isLink || !item.isLink),
      [isLink]
    )

    return (
      <ActionWrapper className={cn({ 'opacity-100': isOpen })}>
        {shouldMerge ? (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <ActionButton
                icon={<DotsHorizontalIcon className="size-4" />}
                onClick={(e) => e.preventDefault()}
                tooltip="Open menu"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              {filteredActions.map(({ key, icon, tooltip }) => (
                <DropdownMenuItem key={key} onClick={(e) => handleAction(e, actions[key])}>
                  <div className="flex flex-row items-center gap-2">
                    {icon}

                    <span>{tooltip}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          filteredActions.map(({ key, icon, tooltip }) => (
            <ActionButton
              icon={icon}
              key={key}
              onClick={(e) => handleAction(e, actions[key])}
              tooltip={tooltip}
            />
          ))
        )}
      </ActionWrapper>
    )
  }
)

ImageActions.displayName = 'ImageActions'
