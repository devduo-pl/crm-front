import { TableHead } from "@/components/ui/table";
import { Icons } from "@/components/atoms/Icons";
import { TableColumn, SortState, SortDirection } from "./types";
import { cn } from "@/lib/utils";

interface SortableTableHeaderProps<T = Record<string, unknown>> {
  column: TableColumn<T>;
  sortState?: SortState;
  onSortChange?: (column: string, direction: SortDirection) => void;
  globalSortable?: boolean;
}

export function SortableTableHeader<T = Record<string, unknown>>({
  column,
  sortState,
  onSortChange,
  globalSortable = false,
}: SortableTableHeaderProps<T>) {
  // Column is sortable only if:
  // 1. onSortChange handler is provided, AND
  // 2. Either column.sortable is explicitly true, OR (column.sortable is undefined AND globalSortable is true)
  const isSortable = onSortChange && (
    column.sortable === true || 
    (column.sortable === undefined && globalSortable) ||
    (column.sortable !== false && globalSortable)
  );
  
  const isCurrentColumn = sortState?.column === column.key;
  const currentDirection = isCurrentColumn ? sortState?.direction : null;

  const handleSort = () => {
    if (!isSortable) return;

    let newDirection: SortDirection = "asc";
    
    if (isCurrentColumn) {
      if (currentDirection === "asc") {
        newDirection = "desc";
      } else if (currentDirection === "desc") {
        newDirection = null;
      } else {
        newDirection = "asc";
      }
    }

    onSortChange(column.key, newDirection);
  };

  const getSortIcon = () => {
    if (!isSortable) return null;

    if (isCurrentColumn && currentDirection === "asc") {
      return <Icons.ChevronUp className="ml-2 h-4 w-4" />;
    }
    
    if (isCurrentColumn && currentDirection === "desc") {
      return <Icons.ChevronDown className="ml-2 h-4 w-4" />;
    }

    return <Icons.ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  if (!isSortable) {
    return (
      <TableHead className={column.className}>
        {column.header}
      </TableHead>
    );
  }

  return (
    <TableHead className={column.className}>
      <button
        onClick={handleSort}
        className={cn(
          "flex items-center space-x-1 hover:text-accent-foreground transition-colors",
          "focus:outline-none focus:text-accent-foreground",
          isCurrentColumn && "text-accent-foreground"
        )}
      >
        <span>{column.header}</span>
        {getSortIcon()}
      </button>
    </TableHead>
  );
}
