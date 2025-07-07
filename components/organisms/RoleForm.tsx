"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";
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
  const [formData, setFormData] = useState<RoleFormData>(() => createFormData(role));
  const [errors, setErrors] = useState<Partial<RoleFormData>>({});

  useEffect(() => {
    setFormData(createFormData(role));
  }, [role]);

  const validateForm = (): boolean => {
    const newErrors: Partial<RoleFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Role name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters";
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
        label="Role Name *"
        type="text"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        disabled={isLoading}
        placeholder="Enter role name (e.g., Admin, Manager, User)"
        error={errors.name}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description *
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
            ${errors.description ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}
          `}
          placeholder="Describe the role's responsibilities and permissions"
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
