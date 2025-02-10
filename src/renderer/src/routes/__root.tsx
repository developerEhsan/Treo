import { AppSidebar } from '@renderer/components/app-sidebar'
import { NavActions } from '@renderer/components/nav-actions'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from '@renderer/components/ui/breadcrumb'
import { Separator } from '@renderer/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@renderer/components/ui/sidebar'
import { Toaster } from '@renderer/components/ui/toaster'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component(): React.JSX.Element {
    return (
      <>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
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
              <div className="ml-auto px-3">
                <NavActions />
              </div>
            </header>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
        {import.meta.env.PROD ? <TanStackRouterDevtools /> : null}
      </>
    )
  }
})
