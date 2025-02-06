import '@renderer/assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './providers/theme-provider'

import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a memory history instance to initialize the router so it doesn't break when compiled:
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'] // Pass your initial url
})
// Create a new router instance
const router = createRouter({ routeTree, history: memoryHistory })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)
