import { useToast } from '@renderer/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@renderer/components/ui/toast'
import React from 'react'

export function Toaster(): React.JSX.Element {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title ? <ToastTitle>{title}</ToastTitle> : null}

              {description ? <ToastDescription>{description}</ToastDescription> : null}
            </div>

            {action}

            <ToastClose />
          </Toast>
        )
      })}

      <ToastViewport />
    </ToastProvider>
  )
}
