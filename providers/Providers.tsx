"use client";

import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AlertProvider } from "@/contexts/AlertContext";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
