"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useNavStatus } from "@/store/nav-status";
import Profile from "../auth/profile";

export function Header() {
  const { navStatus, toggleNavStatus } = useNavStatus((state) => state);

  return (
    <div className="flex items-center justify-between h-16 p-4">
      <div className="flex items-center gap-2">
        {!navStatus && (
          <div className="flex items-center gap-2">
            <Button
              variant={"ghost"}
              className="px-1.5 py-2"
              onClick={toggleNavStatus}
            >
              <Image
                src="/images/sidebar.png"
                alt="logo"
                width={24}
                height={24}
              />
            </Button>
            <Link href="/">
              <Button variant={"ghost"} className="px-1.5 py-2">
                <Image
                  src="/images/write.png"
                  alt="logo"
                  width={26}
                  height={26}
                />
              </Button>
            </Link>
          </div>
        )}
        <Button variant="ghost" className="text-primary/70 px-2.5 text-lg">
          ChatGPT
          <ChevronDown className="h-4 w-4 text-primary/40" />
        </Button>
      </div>
      <Profile />
    </div>
  );
}
