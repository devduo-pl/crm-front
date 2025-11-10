import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, onChange, onBlur, value, defaultValue, ...props }: React.ComponentProps<"input">) {
  const [hasValue, setHasValue] = React.useState(Boolean(value || defaultValue))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value))
    onChange?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setHasValue(Boolean(e.target.value))
    onBlur?.(e)
  }

  React.useEffect(() => {
    setHasValue(Boolean(value || defaultValue))
  }, [value, defaultValue])

  return (
    <input
      type={type}
      data-slot="input"
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        hasValue 
          ? "bg-white" 
          : "bg-transparent dark:bg-input/30",
        className
      )}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  )
}

export { Input }
