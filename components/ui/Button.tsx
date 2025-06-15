import { ButtonHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        secondary:
          "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300",
        ghost:
          "bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-secondary-900",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          isLoading &&
            "relative text-transparent transition-none hover:text-transparent disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 disabled:pointer-events-none disabled:opacity-50">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-error-700 border-t-transparent" />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
