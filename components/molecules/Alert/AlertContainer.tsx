import { AlertItem } from './AlertItem';
import { Alert } from './types';

interface AlertContainerProps {
  alerts: Alert[];
  onRemove: (id: string) => void;
}

export function AlertContainer({ alerts, onRemove }: AlertContainerProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      {alerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
} 