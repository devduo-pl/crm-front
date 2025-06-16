"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Alert, AlertContextType } from '@/components/molecules/Alert/types';
import { AlertContainer } from '@/components/molecules/Alert';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((alertData: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newAlert: Alert = {
      ...alertData,
      id,
    };

    setAlerts(prev => [...prev, newAlert]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const value: AlertContextType = {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
} 