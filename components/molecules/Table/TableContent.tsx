import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableColumn, TableAction } from "./types";
import { TableEmptyState } from "./TableEmptyState";
import { useTableTranslations } from "@/hooks/useTranslations";

interface TableContentProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  emptyMessage?: string;
  emptyDescription?: string;
}

export function TableContent<T = Record<string, unknown>>({
  data,
  columns,
  actions = [],
  emptyMessage,
  emptyDescription,
}: TableContentProps<T>) {
  const t = useTableTranslations();
  const hasActions = actions.length > 0;

  // Empty state
  if (data.length === 0) {
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
                <TableHead className="text-right">{t("actions")}</TableHead>
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
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="text-right">{t("actions")}</TableHead>
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
                  <div className="flex justify-end space-x-2">
                    {actions
                      .filter(
                        (action) => !action.condition || action.condition(row)
                      )
                      .map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant || "outline"}
                          size={action.size || "sm"}
                          onClick={() => action.onClick(row)}
                        >
                          {action.label}
                        </Button>
                      ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
