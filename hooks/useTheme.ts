"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";

export function useTheme() {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to handle system preference changes
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        document.body.classList.toggle("dark", e.matches);
      }
    };

    // Initial theme setup
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.body.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.body.classList.toggle("dark", mediaQuery.matches);
    }

    // Listen for system preference changes
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // Function to manually toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    document.body.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    toggleDarkMode();
  };

  return {
    isDarkMode,
    toggleTheme,
  };
}
