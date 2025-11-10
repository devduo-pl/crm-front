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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      await resetPassword(token, password);
      addAlert({
        type: "success",
        title: "Password reset successfully",
        message: "Your password has been reset. You can now sign in with your new password.",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to reset password. Please try again or request a new reset link.");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              id="password"
              label="New Password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
            />

            <FormField
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText="Resetting password..."
            className="w-full"
            size="lg"
          >
            Reset Password
          </LoadingButton>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 rounded-full">
                Or
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
