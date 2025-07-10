"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/atoms/Icons";
import { useNavigationTranslations } from "@/hooks/useTranslations";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useNavigationTranslations();

  const navigation = [
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: <Icons.Dashboard />,
    },
    {
      name: t("users"),
      href: "/users",
      icon: <Icons.Users />,
    },
    {
      name: t("companies"),
      href: "/companies",
      icon: <Icons.Companies />,
    },
    {
      name: t("roles"),
      href: "/roles",
      icon: <Icons.Shield />,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center h-16 flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-white text-lg font-semibold">DevDuo CRM</p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Icons.Settings />
                <span>{t("settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
