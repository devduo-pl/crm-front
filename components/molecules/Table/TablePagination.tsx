import { Button } from "../../ui/Button";
import { PaginationInfo } from "./types";

interface TablePaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  minItemsForPagination?: number;
}

export function TablePagination({ 
  pagination, 
  onPageChange, 
  minItemsForPagination = 10 
}: TablePaginationProps) {
  const hasEnoughItems = pagination.total >= minItemsForPagination;
  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        {pagination.total === 0 ? (
          "No items to display"
        ) : pagination.totalPages <= 1 ? (
          `Showing all ${pagination.total} items`
        ) : (
          `Showing page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total items)`
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!hasEnoughItems || !canGoPrevious}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!hasEnoughItems || !canGoNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 