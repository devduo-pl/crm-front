import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/atoms/Icons";
import { TableAction } from "./types";

interface TableActionsDropdownProps<T = Record<string, unknown>> {
  actions: TableAction<T>[];
  row: T;
}

export function TableActionsDropdown<T = Record<string, unknown>>({
  actions,
  row,
}: TableActionsDropdownProps<T>) {
  const filteredActions = actions.filter(
    (action) => !action.condition || action.condition(row)
  );

  if (filteredActions.length === 0) {
    return null;
  }

  const resolveState = (
    value: boolean | ((row: T) => boolean) | undefined
  ): boolean => {
    if (typeof value === "function") {
      return value(row);
    }

    return value ?? false;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Icons.MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filteredActions.map((action, index) => {
          const isDisabled = resolveState(action.disabled);
          const isLoading = resolveState(action.loading);
          const isActionDisabled = isDisabled || isLoading;

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                if (isActionDisabled) {
                  return;
                }

                action.onClick(row);
              }}
              disabled={isActionDisabled}
              variant={
                action.variant === "destructive" ? "destructive" : "default"
              }
            >
              {isLoading ? `${action.label}…` : action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
