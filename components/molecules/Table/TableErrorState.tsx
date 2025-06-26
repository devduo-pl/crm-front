import { Button } from "@/components/ui/button";
import { Icons } from "@/components/atoms/Icons";

interface TableErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function TableErrorState({ error, onRetry }: TableErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-lg flex items-center justify-center">
        <Icons.AlertCircle className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error Loading Data
      </h3>
      <p className="text-gray-600 mb-4">
        {error.message || "An unexpected error occurred"}
      </p>
      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
}
