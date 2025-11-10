import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Alert } from "@/components/molecules/Alert/types";

interface AlertState {
  alerts: Alert[];
  addAlert: (alertData: Omit<Alert, "id">) => void;
  addAlertWithAutoRemove: (alertData: Omit<Alert, "id">) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

export const useAlertStore = create<AlertState>()(
  devtools(
    (set, get) => ({
      alerts: [],
      addAlert: (alertData) => {
        const id =
          Math.random().toString(36).substring(2) +
          Date.now().toString(36);
        const newAlert: Alert = {
          ...alertData,
          id,
        };
        set((state) => ({
          alerts: [...state.alerts, newAlert],
        }));
      },
      addAlertWithAutoRemove: (alertData) => {
        const id =
          Math.random().toString(36).substring(2) +
          Date.now().toString(36);
        const newAlert: Alert = {
          ...alertData,
          id,
        };
        
        // Add the alert
        set((state) => ({
          alerts: [...state.alerts, newAlert],
        }));

        // Auto remove after duration (default 5 seconds)
        const duration = alertData.duration || 5000;
        setTimeout(() => {
          const { removeAlert } = get();
          removeAlert(id);
        }, duration);
      },
      removeAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        }));
      },
      clearAlerts: () => {
        set({ alerts: [] });
      },
    }),
    { name: "alert-store" }
  )
);

