import { buttonVariants } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { cn } from '@renderer/utils'
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  readonly items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps): React.JSX.Element {
  const pathname = useLocation().pathname

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
          key={item.href}
          to={item.href}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

const sidebarNavItems = [
  {
    title: 'Appearance',
    href: '/settings/appearance'
  }
]

export const Route = createFileRoute('/settings/_settings')({
  component() {
    return (
      <div className="space-y-6 p-10 pb-16 md:block overflow-y-auto">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>

          <div className="flex-1 lg:max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    )
  }
})
