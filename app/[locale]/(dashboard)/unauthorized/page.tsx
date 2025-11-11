"use client";

import Link from "next/link";
import { usePermissionsTranslations } from "@/hooks/useTranslations";
import { Icons } from "@/components/atoms/Icons";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const t = usePermissionsTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <Icons.Shield className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("unauthorized")}
        </h1>

        <p className="text-lg text-gray-600 mb-8">{t("unauthorizedMessage")}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

