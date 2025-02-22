import { NotebookTabsIcon, Settings2, TextSelectIcon } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from './ui/sidebar'
import { TeamSwitcher } from './team-switcher'
import { NavMain } from './nav-main'

// This is sample data.
const data = {
  user: {
    name: 'username',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  teams: [
    {
      name: 'Default Team',
      logo: TextSelectIcon,
      plan: 'Free'
    }
  ],
  navMain: [
    {
      title: 'Notes',
      url: '#',
      icon: NotebookTabsIcon,
      isActive: true,
      items: [
        {
          title: 'View All',
          url: '#'
        },
        {
          title: 'Starred',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Appearance',
          url: '/settings/appearance'
        }
      ]
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>): React.JSX.Element {
  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail onMouseEnter={() => toggleSidebar()} />
    </Sidebar>
  )
}
