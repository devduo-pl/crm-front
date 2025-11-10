import { GlobalSearch } from "./GlobalSearch";

interface TableFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showAdvancedFilters?: boolean;
  children?: React.ReactNode; // For advanced filters
}

export function TableFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  showAdvancedFilters = false,
  children,
}: TableFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Global Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <GlobalSearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
        {showAdvancedFilters && (
          <div className="text-sm text-muted-foreground">
            {/* If nessessary add later on, more comperhansive filters for mvp purposes Global Seach is enough for now */}
          </div>
        )}
      </div>
      
      {/* Advanced Filters */}
      {children && (
        <div className="border-t pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
