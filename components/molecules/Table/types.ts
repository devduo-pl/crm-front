import { ReactNode } from "react";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableAction<T = Record<string, unknown>> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  condition?: (row: T) => boolean;
  disabled?: boolean | ((row: T) => boolean);
  loading?: boolean | ((row: T) => boolean);
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
}

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface TableProps<T = Record<string, unknown>> {
  // Data and columns
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  
  // Page header
  title?: string;
  description?: string;
  headerActions?: PageHeaderAction[];
  
  // Card header
  cardTitle?: string;
  cardDescription?: string;
  
  // States
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  
  // Empty state
  emptyMessage?: string;
  emptyDescription?: string;
  
  // Pagination
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  minItemsForPagination?: number;
  
  // Loading
  loadingRows?: number;
  
  // Layout
  showCard?: boolean;
  
  // Sorting
  sortable?: boolean;
  sortState?: SortState;
  onSortChange?: (column: string, direction: SortDirection) => void;
  
  // Search/Filtering
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
}
