"use client";

import { usePathname } from "next/navigation";
import { NavItem } from "../atoms/NavItem";
import { NavSection } from "../atoms/NavSection";
import { Icons } from "../atoms/Icons";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <Icons.Dashboard />,
    },
    {
      name: 'Users',
      href: '/users',
      icon: <Icons.Users />,
    },
    {
      name: 'Roles',
      href: '/roles',
      icon: <Icons.Shield />,
    },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-800">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
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

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-8">
          {/* Main Navigation */}
          <NavSection title="Main">
            {navigation.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                isActive={pathname === item.href}
              >
                {item.name}
              </NavItem>
            ))}
          </NavSection>
        </nav>

        {/* Settings at bottom */}
        <div className="flex-shrink-0 px-2 pb-4">
          <NavItem
            href="/settings"
            icon={<Icons.Settings />}
            isActive={pathname === '/settings'}
          >
            Settings
          </NavItem>
        </div>
      </div>
    </div>
  );
} 