"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useCommonTranslations } from "@/hooks/useTranslations";

export function LanguageSwitcher() {
  const {
    currentLocale,
    switchToEnglish,
    switchToPolish,
    isEnglish,
    isPolish,
  } = useLanguage();
  const t = useCommonTranslations();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Language:</span>
      <button
        onClick={switchToEnglish}
        className={`px-3 py-1 text-sm rounded ${
          isEnglish
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        EN
      </button>
      <button
        onClick={switchToPolish}
        className={`px-3 py-1 text-sm rounded ${
          isPolish
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        PL
      </button>
      <span className="text-xs text-gray-500">
        Current: {currentLocale} | Example: {t("loading")}
      </span>
    </div>
  );
}
