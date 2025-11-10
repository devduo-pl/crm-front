"use client";

import { QueryProvider } from "./QueryProvider";
import { AlertProvider } from "@/contexts/AlertContext";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AlertProvider>{children}</AlertProvider>
    </QueryProvider>
  );
}
