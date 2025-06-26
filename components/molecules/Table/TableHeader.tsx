import { Button } from "@/components/ui/button";
import { PageHeaderAction } from "./types";

interface TableHeaderProps {
  title?: string;
  description?: string;
  actions?: PageHeaderAction[];
}

export function TableHeader({
  title,
  description,
  actions = [],
}: TableHeaderProps) {
  if (!title && !description && actions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          {title && (
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {actions.length > 0 && (
          <div className="flex space-x-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
