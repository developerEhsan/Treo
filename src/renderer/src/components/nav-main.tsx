'use client'

import { type LucideIcon } from 'lucide-react'
import React from 'react'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar'
import { Link } from '@tanstack/react-router'

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}): React.JSX.Element {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <Link to={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
