"use client";

import { ForgotPasswordCard } from "@/components/molecules/ForgotPasswordCard";
import { useAuthTranslations } from "@/hooks/useTranslations";

export function ForgotPasswordPage() {
  const t = useAuthTranslations();
  
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">{t('forgotPassword')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('forgotPasswordSubtitle')}
        </p>
      </div>
      <ForgotPasswordCard />
    </>
  );
} 