'use client'

import * as React from 'react'
import {
  Home,
  WandSparkles,
  Briefcase,
  FileText,
  Zap,
  UserCircle,
  ExternalLink,
} from 'lucide-react'

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
      icon: Briefcase,
    },
    {
      title: 'Application',
      url: '/application',
      icon: FileText,
    },
    {
      title: 'Pumper',
      url: '/pumper',
      icon: Zap,
    },
    {
      title: 'Generator',
      url: '/generator',
      icon: WandSparkles,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: UserCircle,
    },
    {
      title: 'Upwork',
      url: '/upwork',
      icon: ExternalLink,
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
