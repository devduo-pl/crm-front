import { ReactNode } from "react";

interface NavSectionProps {
  title?: string;
  children: ReactNode;
}

export function NavSection({ title, children }: NavSectionProps) {
  return (
    <div className="space-y-1">
      {title && (
        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
} 