"use client";

import { useLanguage } from "@/hooks/useLanguage";

export function DashboardLanguageSwitcher() {
  const { switchToEnglish, switchToPolish, isEnglish, isPolish } =
    useLanguage();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={switchToEnglish}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
          isEnglish
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={switchToPolish}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
          isPolish
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        🇵🇱 PL
      </button>
    </div>
  );
}
