"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";
import { Icons } from "@/components/atoms/Icons";
import { useEffect } from "react";
import { useDashboardTranslations } from "@/hooks/useTranslations";

export default function DashboardPage() {
  const { user, isLoading } = useAuthStore();
  const tDashboard = useDashboardTranslations();

  console.log(user);

  // This hook will automatically handle token refresh
  useAuthRefresh();

  useEffect(() => {
    // This will check auth status and potentially refresh tokens
    // The useAuthRefresh hook handles this automatically
  }, []);

  if (isLoading) {
    return (
      <>
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* User Info Card Skeleton */}
        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-18 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* User Info Card */}
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Icons.Check className="w-4 h-4 text-green-600" />
              </div>
              {tDashboard("accountInformation")}
            </CardTitle>
            <CardDescription>{tDashboard("accountDetails")}</CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {tDashboard("userId")}
                  </label>
                  <p className="text-sm text-gray-900 font-mono">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
                {user.firstName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {tDashboard("firstName")}
                    </label>
                    <p className="text-sm text-gray-900">{user.firstName}</p>
                  </div>
                )}
                {user.lastName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {tDashboard("lastName")}
                    </label>
                    <p className="text-sm text-gray-900">{user.lastName}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">{tDashboard("noUserInfo")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tDashboard("authenticationStatus")}
            </CardTitle>
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tDashboard("active")}
            </div>
            <p className="text-xs text-gray-500">
              {tDashboard("successfullyAuthenticated")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tDashboard("sessionStatus")}
            </CardTitle>
            <Icons.Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tDashboard("valid")}
            </div>
            <p className="text-xs text-gray-500">
              {tDashboard("tokenIsActive")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {tDashboard("accountType")}
            </CardTitle>
            <Icons.User className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {user?.roles.includes("admin")
                ? tDashboard("admin")
                : tDashboard("user")}
            </div>
            <p className="text-xs text-gray-500">
              {tDashboard("standardAccess")}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );  
}
