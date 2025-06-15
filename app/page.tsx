"use client";

import { useAuthStore } from "@/store";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import Link from "next/link";

export default function Home() {
  const { user, logout } = useAuthStore();
  useAuthRefresh(); // Initialize auth refresh

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NextJS Middleware Authentication Demo
          </h1>
          <p className="text-lg text-gray-600">
            Testing authentication middleware with cookie-based JWT tokens
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Authentication Status</h2>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-700 font-medium">
                  Authenticated
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                {user.firstName && (
                  <p>
                    <strong>Name:</strong> {user.firstName} {user.lastName}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-red-700 font-medium">
                  Not Authenticated
                </span>
              </div>
              <p className="text-gray-600">
                You are not currently logged in. Try accessing protected routes
                to see the middleware in action.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Try Dashboard (Protected)
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Public Routes</h3>
            <p className="text-gray-600 mb-4">
              These routes are accessible without authentication:
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  / (Home)
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-blue-600 hover:underline">
                  /login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-blue-600 hover:underline">
                  /signup
                </Link>
              </li>
              <li>
                <Link
                  href="/password-recovery"
                  className="text-blue-600 hover:underline"
                >
                  /password-recovery
                </Link>
              </li>
              <li>
                <Link
                  href="/verify-account"
                  className="text-blue-600 hover:underline"
                >
                  /verify-account
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Protected Routes</h3>
            <p className="text-gray-600 mb-4">
              These routes require authentication:
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  /dashboard
                </Link>
              </li>
              <li>
                <span className="text-gray-400">
                  /dashboard/* (all dashboard routes)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Middleware Features
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>✅ Checks JWT tokens in cookies</li>
            <li>✅ Validates token expiration</li>
            <li>✅ Redirects unauthenticated users from protected routes</li>
            <li>
              ✅ Redirects authenticated users from auth routes to dashboard
            </li>
            <li>✅ Automatic token refresh handling</li>
            <li>✅ Secure cookie management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
