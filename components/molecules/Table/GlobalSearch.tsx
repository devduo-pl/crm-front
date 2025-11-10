import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/atoms/Icons";
import { useTranslations } from "next-intl";

interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function GlobalSearch({
  value,
  onChange,
  placeholder,
  debounceMs = 300,
  className,
}: GlobalSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const t = useTranslations("table");

  useEffect(() => {
    setLocalValue(value);
  }, [value]);


  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className={`relative ${className || ""}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icons.Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder={placeholder || t("search")}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="pl-10 pr-10"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-foreground text-muted-foreground transition-colors"
        >
          <Icons.Close className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
