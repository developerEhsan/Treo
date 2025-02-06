import '@renderer/assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@renderer/providers/theme-provider'
import { QueryProvider } from '@renderer/providers/query-provider'
import { CopyWidget } from './app'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <CopyWidget />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
)
