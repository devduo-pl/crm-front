"use client";

import { AuthForm } from "@/components/organisms/AuthForm";
import { useAuthTranslations } from "@/hooks/useTranslations";

export function LoginPage() {
  const t = useAuthTranslations();
  
  return (
    <AuthForm 
      title={t('welcomeBack')} 
      subtitle={t('signInSubtitle')}
    />
  );
} 