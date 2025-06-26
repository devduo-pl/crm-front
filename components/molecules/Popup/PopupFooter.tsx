import { Button } from "@/components/ui/button";
import { PopupAction } from "./types";
import { Icons } from "@/components/atoms/Icons";

interface PopupFooterProps {
  actions: PopupAction[];
}

export function PopupFooter({ actions }: PopupFooterProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "default"}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
        >
          {action.loading && (
            <Icons.Spinner className="w-4 h-4 mr-2 animate-spin" />
          )}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
