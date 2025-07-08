"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { ResetPasswordPage } from "@/components/pages/ResetPasswordPage";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import {
  useAuthTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const tAuth = useAuthTranslations();
  const tCommon = useCommonTranslations();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError(tAuth("invalidResetToken"));
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, tAuth]);

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {tAuth("invalidResetLink")}
        </h2>
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!token) {
    return <div>{tCommon("loading")}</div>;
  }

  return <ResetPasswordPage token={token} />;
}

export default function ResetPassword() {
  const tCommon = useCommonTranslations();

  return (
    <Suspense fallback={<div>{tCommon("loading")}</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
