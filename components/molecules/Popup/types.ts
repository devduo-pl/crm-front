import { ReactNode } from "react";

export interface PopupAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  loading?: boolean;
}

export interface PopupProps {
  // Visibility
  isOpen: boolean;
  onClose: () => void;
  
  // Header
  title: string;
  
  // Content
  children: ReactNode;
  
  // Footer
  actions?: PopupAction[];
  
  // Layout
  size?: "sm" | "md" | "lg" | "xl" | "full";
  
  // Behavior
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
} 