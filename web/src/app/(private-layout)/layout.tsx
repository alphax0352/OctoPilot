import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import ToggleTheme from "@/components/ui/toggle";
export default async function PrivateLayout({ children }: PropsWithChildren) {
  const session = await getUser();
  if (!session?.user) redirect("/sign-in");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbNav />
          </div>
          <ToggleTheme />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
