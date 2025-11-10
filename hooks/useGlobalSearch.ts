import { useState, useMemo } from "react";

interface UseGlobalSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
}

export function useGlobalSearch<T extends Record<string, unknown>>({
  data,
  searchFields,
}: UseGlobalSearchProps<T>) {
  const [searchValue, setSearchValue] = useState("");

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) {
      return data;
    }

    const searchTerm = searchValue.toLowerCase();
    
    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;
        
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(searchTerm);
      });
    });
  }, [data, searchValue, searchFields]);

  return {
    searchValue,
    setSearchValue,
    filteredData,
  };
}
