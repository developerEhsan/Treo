import React from 'react'
import { cn } from '@renderer/utils'
import { Loader2Icon, LucideProps } from 'lucide-react'

interface LoadingProps {
  loaderProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  iconProps?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
}

export function Loading({ iconProps, loaderProps }: LoadingProps): React.JSX.Element {
  return (
    <div
      className={cn('w-full h-full flex justify-center items-center', loaderProps?.className)}
      {...loaderProps}
    >
      <Loader2Icon className="animate-spin" {...iconProps} />
    </div>
  )
}
