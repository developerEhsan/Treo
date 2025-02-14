import { AppSidebar } from '@renderer/components/app-sidebar'
import { ModalsProvider } from '@renderer/components/modals'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@renderer/components/ui/breadcrumb'
import { Separator } from '@renderer/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@renderer/components/ui/sidebar'
import { Toaster } from '@renderer/components/ui/toaster'
import { QueryProvider } from '@renderer/providers/query-provider'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component(): React.JSX.Element {
    return (
      <>
        <QueryProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-0 overflow-hidden">
              <header className="flex h-14 shrink-0 items-center gap-2">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbPage className="line-clamp-1">
                          Project Management & Task Tracking
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <Outlet />
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
          <ModalsProvider />
        </QueryProvider>
        {import.meta.env.PROD ? <TanStackRouterDevtools /> : null}
      </>
    )
  }
})
