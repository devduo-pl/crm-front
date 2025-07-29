// Main component
export { Table } from "./Table";

// Sub-components (for advanced usage)
export { TableHeader } from "./TableHeader";
export { TableContent } from "./TableContent";
export { TableLoadingState } from "./TableLoadingState";
export { TableErrorState } from "./TableErrorState";
export { TableEmptyState } from "./TableEmptyState";
export { TablePagination } from "./TablePagination";
export { TableActionsDropdown } from "./TableActionsDropdown";
export { SortableTableHeader } from "./SortableTableHeader";
export { GlobalSearch } from "./GlobalSearch";
export { TableFilters } from "./TableFilters";

// Types
export type {
  TableColumn,
  TableAction,
  PaginationInfo,
  PageHeaderAction,
  TableProps,
  SortState,
  SortDirection,
} from "./types";

// Legacy export for backward compatibility
export { Table as DataTable } from "./Table"; 