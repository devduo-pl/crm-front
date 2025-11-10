"use client";

import { useAlertStore } from '@/store/useAlertStore';
import { AlertContainer } from './AlertContainer';

export function AlertDisplay() {
  const { alerts, removeAlert } = useAlertStore();

  return <AlertContainer alerts={alerts} onRemove={removeAlert} />;
}
