"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";
import { useFormsTranslations } from "@/hooks/useTranslations";
import type { Permission } from "@/services/permissions";

export interface PermissionFormData {
  name: string; // This is the permission key (e.g., 'view_users', 'manage_roles')
  description: string;
}

interface PermissionFormProps {
  permission?: Permission;
  onSubmit: (data: PermissionFormData) => void;
  isLoading?: boolean;
}

const createFormData = (permission?: Permission): PermissionFormData => ({
  name: permission?.name || "",
  description: permission?.description || "",
});

export function PermissionForm({
  permission,
  onSubmit,
  isLoading = false,
}: PermissionFormProps) {
  const [formData, setFormData] = useState<PermissionFormData>(() =>
    createFormData(permission)
  );
  const [errors, setErrors] = useState<Partial<PermissionFormData>>({});
  const t = useFormsTranslations();

  useEffect(() => {
    setFormData(createFormData(permission));
  }, [permission]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PermissionFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("permission.permissionKeyRequired");
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t("permission.permissionKeyMinLength");
    } else if (!/^[a-z_]+$/.test(formData.name.trim())) {
      newErrors.name = t("permission.permissionKeyPattern");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("permission.descriptionRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof PermissionFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        label={`${t("permission.permissionKey")} *`}
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        disabled={isLoading || !!permission} // Disable editing for existing permissions
        placeholder={t("permission.enterPermissionKey")}
        error={errors.name}
      />
      <p className="text-xs text-gray-500 -mt-2">
        Use snake_case format (e.g., view_users, manage_roles, full_nav_access)
      </p>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("permission.description")} *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          disabled={isLoading}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${
              errors.description
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }
          `}
          placeholder={t("permission.enterDescription")}
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
}

