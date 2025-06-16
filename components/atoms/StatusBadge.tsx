interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium";
  const sizeClasses = size === 'sm' ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm";
  
  const statusClasses = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800"
  };

  return (
    <span className={`${baseClasses} ${sizeClasses} ${statusClasses[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 