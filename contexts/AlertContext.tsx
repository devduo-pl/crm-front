"use client";

import React, { createContext, useContext } from "react";
import { useAlertStore } from "@/store/useAlertStore";
import { AlertContainer } from "@/components/molecules/Alert";

export interface Alert {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id">) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const { alerts, addAlert, removeAlert, clearAlerts } = useAlertStore();

  // Wrap addAlert to auto-remove after duration
  const addAlertWithAutoRemove = (alert: Omit<Alert, "id">) => {
    const id =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    addAlert(alert);

    // Auto remove after duration (default 5 seconds)
    const duration = alert.duration || 5000;
    setTimeout(() => {
      removeAlert(id);
    }, duration);
  };

  return (
    <AlertContext.Provider
      value={{ alerts, addAlert: addAlertWithAutoRemove, removeAlert, clearAlerts }}
    >
      {children}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

