"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { useAlertStore } from "@/store/useAlertStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/atoms/FormField";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingButton } from "@/components/atoms/LoadingButton";
import {
  useAuthTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";

export function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { forgotPassword, isLoading } = useAuthStore();
  const addAlert = useAlertStore((state) => state.addAlertWithAutoRemove);
  const router = useRouter();
  const tAuth = useAuthTranslations();
  const tCommon = useCommonTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await forgotPassword(email);
      addAlert({
        type: "success",
        title: tAuth("emailSentSuccessfully"),
        message: tAuth("checkEmailForInstructions"),
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(tAuth("failedToSendResetEmail"));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAuth('resetPassword')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              id="email"
              label={tAuth('emailAddress')}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tAuth('enterEmailAddress')}
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText={tAuth('sendingEmail')}
            className="w-full"
            size="lg"
          >
            {tAuth('sendResetEmail')}
          </LoadingButton>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 rounded-full">
                {tCommon('or')}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login">{tAuth('backToSignIn')}</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
