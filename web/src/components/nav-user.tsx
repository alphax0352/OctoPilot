'use client'

import { useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { ChevronsUpDown, LogOut, Trash2, Settings } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useDeleteUser } from '@/hooks/use-user'
import { toast } from '@/hooks/use-toast'

export function NavUser() {
  const { data: session } = useSession()
  const { isMobile } = useSidebar()

  const {
    mutate: deleteUser,
    isSuccess: userDeleted,
    isError: userDeleteError,
    error: userDeleteErrorData,
  } = useDeleteUser()

  useEffect(() => {
    if (userDeleted) {
      signOut({ callbackUrl: '/' })
    }
  }, [userDeleted])

  useEffect(() => {
    if (userDeleteError) {
      toast({
        title: 'Error',
        description:
          userDeleteErrorData instanceof Error
            ? userDeleteErrorData.message
            : String(userDeleteErrorData),
        variant: 'destructive',
      })
    }
  }, [userDeleteError, userDeleteErrorData])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session?.user.image as string}
                  alt={session?.user.name as string}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{session?.user.name}</span>
                <span className="truncate text-xs">{session?.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user.image as string}
                    alt={session?.user.image as string}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session?.user.name}</span>
                  <span className="truncate text-xs">{session?.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => (window.location.href = '/settings')}
            >
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={() => deleteUser()}
            >
              <Trash2 />
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
