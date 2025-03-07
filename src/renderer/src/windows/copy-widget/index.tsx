import '@renderer/assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@renderer/providers/theme-provider'
import { QueryProvider } from '@renderer/providers/query-provider'
import { CopyWidget } from './app'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { ToastProvider } from '@renderer/components/ui/toast'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <CopyWidget />
        </TooltipProvider>
        <ToastProvider />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
)
