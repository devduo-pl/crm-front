"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialogProps } from "./types";
import { Icons } from "@/components/atoms/Icons";

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ConfirmationDialogProps) {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  // Variant styles
  const variantStyles = {
    default: {
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      confirmButton: "default" as const,
    },
    destructive: {
      icon: "text-red-600",
      iconBg: "bg-red-100",
      confirmButton: "destructive" as const,
    },
    warning: {
      icon: "text-yellow-600",
      iconBg: "bg-yellow-100",
      confirmButton: "default" as const,
    },
  };

  const styles = variantStyles[variant];

  // Icon based on variant
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <Icons.AlertTriangle className="w-6 h-6" />;
      case "warning":
        return <Icons.AlertTriangle className="w-6 h-6" />;
      default:
        return <Icons.Info className="w-6 h-6" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className="
          w-full max-w-md bg-white rounded-lg shadow-xl 
          animate-in fade-in-0 zoom-in-95 duration-200
        "
      >
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div
              className={`shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}
            >
              <div className={styles.icon}>{getIcon()}</div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={styles.confirmButton}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.Spinner className="w-4 h-4 mr-2 animate-spin" />
            )}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
