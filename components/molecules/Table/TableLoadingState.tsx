import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableColumn, TableAction } from "./types";

interface TableLoadingStateProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loadingRows?: number;
}

export function TableLoadingState<T = Record<string, unknown>>({
  columns,
  actions = [],
  loadingRows = 5,
}: TableLoadingStateProps<T>) {
  const hasActions = actions.length > 0;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="text-right w-[50px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(loadingRows)].map((_, i) => (
            <TableRow key={i}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
              ))}
              {hasActions && (
                <TableCell className="text-right">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
