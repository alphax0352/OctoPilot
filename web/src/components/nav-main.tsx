'use client'

import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

interface INavItem {
  title: string
  url: string
  icon?: LucideIcon
}

export function NavMain({ items }: { items: INavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, index) => (
          <Link href={item.url} key={index}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
