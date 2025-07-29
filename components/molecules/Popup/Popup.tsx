"use client";

import { useEffect, useRef } from "react";
import { PopupProps } from "./types";
import { PopupHeader } from "./PopupHeader";
import { PopupFooter } from "./PopupFooter";

export function Popup({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = "md",
  closeOnEscape = true,
}: PopupProps) {
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Prevent body scroll when popup is open
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

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        ref={contentRef}
        className={`
          w-full ${sizeClasses[size]} max-h-[90vh] 
          bg-white rounded-lg shadow-xl 
          flex flex-col overflow-hidden
          animate-in fade-in-0 zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <PopupHeader title={title} onClose={onClose} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {actions.length > 0 && <PopupFooter actions={actions} />}
      </div>
    </div>
  );
} 