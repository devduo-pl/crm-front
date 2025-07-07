"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { ResetPasswordPage } from "@/components/pages/ResetPasswordPage";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid or missing reset token. Please request a new password reset.");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Invalid Reset Link</h2>
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!token) {
    return <div>Loading...</div>;
  }

  return <ResetPasswordPage token={token} />;
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
