"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/atoms/FormField";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingButton } from "@/components/atoms/LoadingButton";
import {
  useAuthTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";

export function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const tAuth = useAuthTranslations();
  const tCommon = useCommonTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password, rememberMe);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(tAuth("loginFailed"));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAuth("signIn")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              id="email"
              label={tAuth("emailAddress")}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tAuth("enterEmail")}
            />

            <FormField
              id="password"
              label={tAuth("password")}
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tAuth("enterPassword")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setRememberMe(checked === "indeterminate" ? false : checked)
              }
            />
            <label htmlFor="rememberMe" className="text-sm">
              {tAuth("rememberMe")}
            </label>
          </div>

          {error && <ErrorMessage message={error} />}

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText={tAuth("signingIn")}
            className="w-full"
            size="lg"
          >
            {tAuth("signInButton")}
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
              <Link href="/forgot-password">
                {tAuth("forgotPasswordQuestion")}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
