"use client";

import { useAuthStore } from "@/store";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuthStore();
  const { refreshToken } = useAuthRefresh();

  useEffect(() => {
    // This will check auth status and potentially refresh tokens
    // The useAuthRefresh hook handles this automatically
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by middleware
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          {user ? (
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {user.firstName && (
                <p>
                  <strong>First Name:</strong> {user.firstName}
                </p>
              )}
              {user.lastName && (
                <p>
                  <strong>Last Name:</strong> {user.lastName}
                </p>
              )}
            </div>
          ) : (
            <p>No user information available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Authentication Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Authentication Status:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  user
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user ? "Authenticated" : "Not Authenticated"}
              </span>
            </div>

            <button
              onClick={() => refreshToken()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Token
            </button>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <p>This is a protected route. The middleware automatically:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Redirects unauthenticated users to the home page</li>
            <li>Checks token validity on each request</li>
            <li>Handles token refresh when needed</li>
            <li>
              Redirects authenticated users from public routes to dashboard
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
