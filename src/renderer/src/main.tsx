import '@renderer/assets/main.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './providers/theme-provider'

import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a memory history instance to initialize the router so it doesn't break when compiled:
const hashHistory = createHashHistory()
// Create a new router instance
const router = createRouter({
  routeTree,
  history: hashHistory,
  scrollRestorationBehavior: 'smooth',
  scrollRestoration: true
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
