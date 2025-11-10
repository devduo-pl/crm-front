"use client";

import { useAuthStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function VerifyAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyAccount = useAuthStore((state) => state.verifyAccount);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (token) {
      verifyAccount(token);
    }
  }, [token, verifyAccount]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Account verified successfully</h1>
    </div>
  );
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}
