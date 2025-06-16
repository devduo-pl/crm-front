import Link from "next/link";
import { ReactNode } from "react";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  isActive?: boolean;
}

export function NavItem({ href, icon, children, isActive = false }: NavItemProps) {
  const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
  const activeClasses = isActive 
    ? "bg-gray-900 text-white" 
    : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      <span className="mr-3 flex-shrink-0 h-5 w-5">
        {icon}
      </span>
      {children}
    </Link>
  );
} 