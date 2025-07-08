"use client";

import { useAuthStore } from "@/store";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCommonTranslations } from "@/hooks/useTranslations";

export default function Home() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const t = useCommonTranslations();
  useAuthRefresh(); // Initialize auth refresh

  // Redirect users based on authentication status
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, go to dashboard
        router.replace("/dashboard");
      } else {
        // User is not authenticated, go to login
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while determining authentication status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-blue-600" />
        <div className="text-lg text-gray-600">{t("loading")}</div>
      </div>
    </div>
  );
}
