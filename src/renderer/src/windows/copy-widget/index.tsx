import '@renderer/assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@renderer/providers/theme-provider'
import { QueryProvider } from '@renderer/providers/query-provider'
import { CopyWidget } from './app'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { Toaster } from '@renderer/components/ui/toaster'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <CopyWidget />
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
)
