import { useState, useMemo } from "react";
import { SortState, SortDirection } from "@/components/molecules/Table/types";

interface UseTableSortingProps<T> {
  data: T[];
  initialSortColumn?: string | null;
  initialSortDirection?: SortDirection;
}

export function useTableSorting<T extends Record<string, unknown>>({
  data,
  initialSortColumn = null,
  initialSortDirection = null,
}: UseTableSortingProps<T>) {
  const [sortState, setSortState] = useState<SortState>({
    column: initialSortColumn,
    direction: initialSortDirection,
  });

  const handleSortChange = (column: string, direction: SortDirection) => {
    setSortState({ column, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortState.column as keyof T];
      const bValue = b[sortState.column as keyof T];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const aStr = String(aValue);
      const bStr = String(bValue);

      if (aStr === bStr) return 0;

      const aNum = Number(aValue);
      const bNum = Number(bValue);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        const comparison = aNum - bNum;
        return sortState.direction === "asc" ? comparison : -comparison;
      }

      const comparison = aStr.localeCompare(bStr);
      return sortState.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortState]);

  return {
    sortState,
    sortedData,
    onSortChange: handleSortChange,
  };
}
