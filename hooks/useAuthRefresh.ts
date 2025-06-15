import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

/**
 * Hook to handle automatic token refresh
 * Listens for token expiration signals and attempts to refresh tokens
 */
export function useAuthRefresh() {
  const router = useRouter();
  const { refreshToken, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check auth status on mount
    checkAuth();

    // Listen for token expiration headers from middleware
    const handleTokenRefresh = async () => {
      try {
        const success = await refreshToken();
        if (!success) {
          // If refresh fails, logout and redirect to login
          await logout();
          router.push("/login");
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        await logout();
        router.push("/login");
      }
    };

    // Listen for fetch responses with expired token header
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.headers.get("x-token-expired") === "true") {
        await handleTokenRefresh();
      }

      return response;
    };

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, [refreshToken, logout, checkAuth, router]);

  // Also provide manual refresh capability
  return {
    refreshToken: async () => {
      try {
        const success = await refreshToken();
        if (!success) {
          await logout();
          router.push("/login");
        }
        return success;
      } catch (error) {
        console.error("Manual token refresh failed:", error);
        await logout();
        router.push("/login");
        return false;
      }
    },
  };
}
