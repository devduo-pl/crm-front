"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { useNotification } from "@/hooks/useNotification";
import { Icons } from "../../atoms/Icons";
import { Button } from "../../ui/Button";

export function UserMenu() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { showSuccess, showError } = useNotification();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await logout();
      showSuccess("Signed Out", "You have been successfully signed out.");
      
      // Immediate redirect
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      showError(
        "Sign Out Failed", 
        "There was an issue signing you out. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <div className="flex items-center space-x-3 w-full justify-between">
      {/* User Info */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
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
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </span>
      </Button>
    </div>
  );
} 