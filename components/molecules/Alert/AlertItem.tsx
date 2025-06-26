import { useEffect } from "react";
import { Icons } from "@/components/atoms/Icons";
import { Alert } from "./types";

interface AlertItemProps {
  alert: Alert;
  onRemove: (id: string) => void;
}

export function AlertItem({ alert, onRemove }: AlertItemProps) {
  const { id, type, title, message, duration = 5000, action } = alert;

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  // Variant styles
  const variantStyles = {
    success: {
      container: "bg-green-50 border-green-200",
      icon: "text-green-600",
      title: "text-green-800",
      message: "text-green-700",
      closeButton: "text-green-500 hover:text-green-600",
    },
    error: {
      container: "bg-red-50 border-red-200",
      icon: "text-red-600",
      title: "text-red-800",
      message: "text-red-700",
      closeButton: "text-red-500 hover:text-red-600",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-600",
      title: "text-yellow-800",
      message: "text-yellow-700",
      closeButton: "text-yellow-500 hover:text-yellow-600",
    },
    info: {
      container: "bg-blue-50 border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-800",
      message: "text-blue-700",
      closeButton: "text-blue-500 hover:text-blue-600",
    },
  };

  const styles = variantStyles[type];

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <Icons.Check className="w-5 h-5" />;
      case "error":
        return <Icons.AlertCircle className="w-5 h-5" />;
      case "warning":
        return <Icons.AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Icons.Info className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`
        ${styles.container}
        border rounded-lg p-4 shadow-sm
        animate-in slide-in-from-top-2 fade-in-0 duration-300
      `}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>

        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
          {message && (
            <p className={`mt-1 text-sm ${styles.message}`}>{message}</p>
          )}
          {action && (
            <div className="mt-2">
              <button
                onClick={action.onClick}
                className={`text-sm font-medium ${styles.title} hover:underline`}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onRemove(id)}
            className={`
              inline-flex rounded-md p-1.5 transition-colors
              ${styles.closeButton}
              hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current
            `}
            aria-label="Dismiss alert"
          >
            <Icons.Close className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
