import { useAlert } from '@/contexts/AlertContext';
import { Alert } from '@/components/molecules/Alert/types';

export function useNotification() {
  const { addAlert } = useAlert();

  const showSuccess = (title: string, message?: string, options?: Partial<Alert>) => {
    addAlert({
      type: 'success',
      title,
      message,
      duration: 10000,
      ...options,
    });
  };

  const showError = (title: string, message?: string, options?: Partial<Alert>) => {
    addAlert({
      type: 'error',
      title,
      message,
      duration: 10000, 
      ...options,
    });
  };

  const showWarning = (title: string, message?: string, options?: Partial<Alert>) => {
    addAlert({
      type: 'warning',
      title,
      message,
      duration: 10000,
      ...options,
    });
  };

  const showInfo = (title: string, message?: string, options?: Partial<Alert>) => {
    addAlert({
      type: 'info',
      title,
      message,
      duration: 10000,
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // Direct access to addAlert for custom alerts
    addAlert,
  };
} 