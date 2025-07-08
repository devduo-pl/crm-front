"use client";

import { QueryProvider } from "./QueryProvider";
import { AlertProvider } from "@/contexts/AlertContext";
import { IntlProvider } from "./IntlProvider";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <IntlProvider>
      <QueryProvider>
        <AlertProvider>{children}</AlertProvider>
      </QueryProvider>
    </IntlProvider>
  );
}
