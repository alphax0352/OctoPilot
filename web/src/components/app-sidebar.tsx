'use client'

import * as React from 'react'
import { Bot, Home, User, WandSparkles, Settings } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavHeader } from './nav-header'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: Home,
    },
    {
      title: 'Job',
      url: '/job',
      icon: Bot,
    },
    {
      title: 'Application',
      url: '/application',
      icon: Bot,
    },
    {
      title: 'Pumper',
      url: '/pumper',
      icon: User,
    },
    {
      title: 'Generator',
      url: '/generator',
      icon: WandSparkles,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
