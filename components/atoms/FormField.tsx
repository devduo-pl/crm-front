import { Input } from "../ui/input";
import { ComponentProps } from "react";

interface FormFieldProps extends ComponentProps<typeof Input> {
  label: string;
  error?: string;
}

export function FormField({ label, error, className, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Input
        className={`w-full ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 