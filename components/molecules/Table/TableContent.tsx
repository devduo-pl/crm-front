import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableColumn, TableAction, SortState, SortDirection } from "./types";
import { TableEmptyState } from "./TableEmptyState";
import { TableActionsDropdown } from "./TableActionsDropdown";
import { SortableTableHeader } from "./SortableTableHeader";
import { useTranslations } from "next-intl";

interface TableContentProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  emptyMessage?: string;
  emptyDescription?: string;
  sortable?: boolean;
  sortState?: SortState;
  onSortChange?: (column: string, direction: SortDirection) => void;
}

export function TableContent<T = Record<string, unknown>>({
  data,
  columns,
  actions = [],
  emptyMessage,
  emptyDescription,
  sortable = false,
  sortState,
  onSortChange,
}: TableContentProps<T>) {
  const t = useTranslations("table");
  const hasActions = actions.length > 0;

  // Empty state
  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <SortableTableHeader
                  key={column.key}
                  column={column}
                  sortState={sortState}
                  onSortChange={onSortChange}
                  globalSortable={sortable}
                />
              ))}
              {hasActions && (
                <TableHead className="text-right w-[50px]">{t("actions")}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + (hasActions ? 1 : 0)}>
                <TableEmptyState
                  message={emptyMessage}
                  description={emptyDescription}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  // Data table
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <SortableTableHeader
                key={column.key}
                column={column}
                sortState={sortState}
                onSortChange={onSortChange}
                globalSortable={sortable}
              />
            ))}
            {hasActions && (
              <TableHead className="text-right w-[50px]">{t("actions")}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={(row as { id?: string | number }).id || index}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(
                        (row as Record<string, unknown>)[column.key],
                        row
                      )
                    : String(
                        (row as Record<string, unknown>)[column.key] ?? ""
                      )}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="text-right">
                  <TableActionsDropdown actions={actions} row={row} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
