"use client";

import { ResetPasswordCard } from "@/components/molecules/ResetPasswordCard";
import { useAuthTranslations } from "@/hooks/useTranslations";

interface ResetPasswordPageProps {
  token: string;
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const t = useAuthTranslations();
  
  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">{t('resetPassword')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('resetPasswordSubtitle')}
        </p>
      </div>
      <ResetPasswordCard token={token} />
    </>
  );
}
