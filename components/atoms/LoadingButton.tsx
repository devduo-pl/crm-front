import { Button } from "../ui/Button";
import { Spinner } from "../ui/spinner";
import { ComponentProps } from "react";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({ 
  isLoading = false, 
  loadingText = "Loading...", 
  children, 
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
} 