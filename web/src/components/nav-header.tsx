import Image from 'next/image'
import { SidebarMenuButton } from '@/components/ui/sidebar'
export function NavHeader() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Image src={'/images/logo.png'} alt="logo" width={36} height={36} />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold text-2xl">Octopilot</span>
      </div>
    </SidebarMenuButton>
  )
}
