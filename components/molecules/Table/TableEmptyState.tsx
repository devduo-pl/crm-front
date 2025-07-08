import { useTableTranslations } from "@/hooks/useTranslations";

interface TableEmptyStateProps {
  message?: string;
  description?: string;
}

export function TableEmptyState({
  message,
  description,
}: TableEmptyStateProps) {
  const t = useTableTranslations();

  return (
    <div className="text-center py-8">
      <div className="text-gray-500">
        <p className="text-lg font-medium">{message || t("noDataFound")}</p>
        <p className="text-sm">{description || t("emptyState")}</p>
      </div>
    </div>
  );
}
