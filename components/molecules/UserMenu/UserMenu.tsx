"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { useNotification } from "@/hooks/useNotification";
import { Icons } from "@/components/atoms/Icons";
import { Button } from "@/components/ui/button";
import { useNavigationTranslations } from "@/hooks/useTranslations";
import { DashboardLanguageSwitcher } from "@/components/examples/DashboardLanguageSwitcher";

export function UserMenu() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const t = useNavigationTranslations();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      showSuccess(t("signedOut"), t("signOutSuccess"));

      // Immediate redirect
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      showError(t("signOutFailed"), t("signOutError"));
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email;

  return (
    <div className="flex items-center space-x-3 w-full justify-between">
      {/* User Info */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.firstName
              ? user.firstName.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
      {/* Sign Out Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center space-x-1"
      >
        {isLoggingOut ? (
          <Icons.Spinner className="w-4 h-4 animate-spin" />
        ) : (
          <Icons.Logout className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {isLoggingOut ? t("signingOut") : t("signOut")}
        </span>
      </Button>{" "}
      <DashboardLanguageSwitcher />
    </div>
  );
}
