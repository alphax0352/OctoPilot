"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            {item.isCurrentPage ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
