import '@renderer/assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@renderer/providers/theme-provider'
import { QueryProvider } from '@renderer/providers/query-provider'
import { CopyWidget } from './app'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { Toaster } from '@renderer/components/ui/toaster'
import { ModalsProvider } from '@renderer/components/modals'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <CopyWidget />
        </TooltipProvider>
        <Toaster />
        <ModalsProvider />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
)
