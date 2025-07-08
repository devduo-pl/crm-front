import { Button } from "@/components/ui/button";
import { PaginationInfo } from "./types";
import { useTableTranslations } from "@/hooks/useTranslations";

interface TablePaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  minItemsForPagination?: number;
}

export function TablePagination({
  pagination,
  onPageChange,
  minItemsForPagination = 10,
}: TablePaginationProps) {
  const t = useTableTranslations();
  const hasEnoughItems = pagination.total >= minItemsForPagination;
  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  const getPaginationText = () => {
    if (pagination.total === 0) {
      return t("noItemsToDisplay");
    }
    if (pagination.totalPages <= 1) {
      return t("showingAll", { total: pagination.total });
    }
    return t("showingPage", {
      page: pagination.page,
      totalPages: pagination.totalPages,
      total: pagination.total,
    });
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">{getPaginationText()}</div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!hasEnoughItems || !canGoPrevious}
        >
          {t("previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!hasEnoughItems || !canGoNext}
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
}
