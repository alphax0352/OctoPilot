"use client";

import { LogOut, Trash2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/use-user";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { data: session } = useSession();

  const {
    mutate: deleteUser,
    isSuccess: userDeleted,
    isError: userDeleteError,
    error: userDeleteErrorData,
  } = useDeleteUser();

  useEffect(() => {
    if (userDeleted) {
      signOut({ callbackUrl: "/" });
    }
  }, [userDeleted]);

  useEffect(() => {
    if (userDeleteError) {
      toast({
        title: "Error",
        description:
          userDeleteErrorData instanceof Error
            ? userDeleteErrorData.message
            : String(userDeleteErrorData),
        variant: "destructive",
      });
    }
  }, [userDeleteError, userDeleteErrorData]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image ?? ""} alt="User avatar" />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => deleteUser()}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
