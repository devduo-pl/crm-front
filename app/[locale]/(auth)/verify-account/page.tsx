"use client";

import { useAuthStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import {
  useAuthTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";

function VerifyAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tAuth = useAuthTranslations();
  const tCommon = useCommonTranslations();

  const verifyAccount = useAuthStore((state) => state.verifyAccount);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (token) {
      verifyAccount(token);
    }
  }, [token, verifyAccount]);

  if (isLoading) {
    return <div>{tCommon("loading")}</div>;
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">
        {tAuth("accountVerifiedSuccessfully")}
      </h1>
    </div>
  );
}

export default function VerifyAccountPage() {
  const tCommon = useCommonTranslations();

  return (
    <Suspense fallback={<div>{tCommon("loading")}</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}
