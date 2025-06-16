export interface ConfirmationDialogProps {
  // Visibility
  isOpen: boolean;
  onClose: () => void;
  
  // Content
  title: string;
  message: string;
  
  // Actions
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  
  // Styling
  variant?: "default" | "destructive" | "warning";
  
  // Behavior
  isLoading?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
} 