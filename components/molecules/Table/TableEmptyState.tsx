interface TableEmptyStateProps {
  message?: string;
  description?: string;
}

export function TableEmptyState({ 
  message = "No data found", 
  description = "There are no items to display." 
}: TableEmptyStateProps) {
  return (
    <div className="text-center py-8">
      <div className="text-gray-500">
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
} 