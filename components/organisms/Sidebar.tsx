"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/atoms/Icons";
import { useNavigationTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/hooks/useAuth";
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

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  permission?: string; // Permission required to view this item
}

export function AppSidebar() {
  const pathname = usePathname();
  const t = useNavigationTranslations();
  const { hasPermission } = useAuth();

  const navigation: NavigationItem[] = [
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: <Icons.Dashboard />,
      permission: "view_dashboard",
    },
    {
      name: t("users"),
      href: "/users",
      icon: <Icons.Users />,
      permission: "view_users",
    },
    {
      name: t("companies"),
      href: "/companies",
      icon: <Icons.Companies />,
      permission: "view_companies",
    },
    {
      name: t("invoices"),
      href: "/invoices",
      icon: <Icons.Documents />,
      permission: "view_invoices",
    },
    {
      name: t("roles"),
      href: "/roles",
      icon: <Icons.Shield />,
      permission: "manage_roles",
    },
    {
      name: t("permissions"),
      href: "/permissions",
      icon: <Icons.Shield />,
      permission: "manage_permissions",
    },
  ];

  // Check if user has full navigation access
  const hasFullNavAccess = hasPermission("full_nav_access");

  // Filter navigation items based on permissions
  const filteredNavigation = navigation.filter((item) => {
    // If user has full_nav_access, show all items
    if (hasFullNavAccess) return true;

    // If no permission is required, show the item
    if (!item.permission) return true;

    // Otherwise, check if user has the required permission
    return hasPermission(item.permission);
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center h-16 shrink-0 px-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DC</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-lg font-semibold">DevDuo CRM</p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => (
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
