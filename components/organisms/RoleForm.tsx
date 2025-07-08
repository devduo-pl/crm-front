"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";
import { useFormsTranslations } from "@/hooks/useTranslations";
import type { Role } from "@/services/roles";

export interface RoleFormData {
  name: string;
  description: string;
}

interface RoleFormProps {
  role?: Role; // If provided, we're editing; if not, we're adding
  onSubmit: (data: RoleFormData) => void;
  isLoading?: boolean;
}

const createFormData = (role?: Role): RoleFormData => ({
  name: role?.name || "",
  description: role?.description || "",
});

export function RoleForm({ role, onSubmit, isLoading = false }: RoleFormProps) {
  const [formData, setFormData] = useState<RoleFormData>(() =>
    createFormData(role)
  );
  const [errors, setErrors] = useState<Partial<RoleFormData>>({});
  const t = useFormsTranslations();

  useEffect(() => {
    setFormData(createFormData(role));
  }, [role]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RoleFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("role.roleNameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("role.roleNameMinLength");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("role.descriptionRequired");
    } else if (formData.description.trim().length < 5) {
      newErrors.description = t("role.descriptionMinLength");
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

  const handleInputChange = (field: keyof RoleFormData, value: string) => {
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
        label={`${t("role.roleName")} *`}
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        disabled={isLoading}
        placeholder={t("role.enterRoleName")}
        error={errors.name}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("role.description")} *
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
          placeholder={t("role.enterDescription")}
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
