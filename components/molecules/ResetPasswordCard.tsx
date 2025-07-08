"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { useAlert } from "@/contexts/AlertContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/atoms/FormField";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingButton } from "@/components/atoms/LoadingButton";
import {
  useAuthTranslations,
  useCommonTranslations,
  useFormsTranslations,
} from "@/hooks/useTranslations";

interface ResetPasswordCardProps {
  token: string;
}

export function ResetPasswordCard({ token }: ResetPasswordCardProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { resetPassword, isLoading } = useAuthStore();
  const { addAlert } = useAlert();
  const router = useRouter();
  const tAuth = useAuthTranslations();
  const tCommon = useCommonTranslations();
  const tForms = useFormsTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(tForms("passwordsDoNotMatch"));
      return;
    }

    if (password.length < 8) {
      setError(tAuth("passwordMustBe8Characters"));
      return;
    }

    try {
      await resetPassword(token, password);
      addAlert({
        type: "success",
        title: tAuth("passwordResetSuccessfully"),
        message: tAuth("passwordHasBeenReset"),
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(tAuth("failedToResetPassword"));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAuth("resetYourPassword")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              id="password"
              label={tAuth("newPassword")}
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tAuth("enterNewPassword")}
            />

            <FormField
              id="confirmPassword"
              label={tAuth("confirmNewPassword")}
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={tAuth("confirmYourNewPassword")}
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText={tAuth("resettingPassword")}
            className="w-full"
            size="lg"
          >
            {tAuth("resetPassword")}
          </LoadingButton>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 rounded-full">
                {tCommon("or")}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login">{tAuth("backToSignIn")}</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
