"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";
import { useFormsTranslations } from "@/hooks/useTranslations";
import type { User } from "@/types/user";

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface UserFormProps {
  user?: User; // If provided, we're editing; if not, we're adding
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

const createFormData = (user?: User): UserFormData => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
});

export function UserForm({ user, onSubmit, isLoading = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(() =>
    createFormData(user)
  );
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const t = useFormsTranslations();

  useEffect(() => {
    setFormData(createFormData(user));
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("user.firstNameRequired");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("user.lastNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("user.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("user.validEmailRequired");
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

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="firstName"
        label={`${t("user.firstName")} *`}
        type="text"
        value={formData.firstName}
        onChange={(e) => handleInputChange("firstName", e.target.value)}
        disabled={isLoading}
        placeholder={t("user.enterFirstName")}
        error={errors.firstName}
      />

      <FormField
        id="lastName"
        label={`${t("user.lastName")} *`}
        type="text"
        value={formData.lastName}
        onChange={(e) => handleInputChange("lastName", e.target.value)}
        disabled={isLoading}
        placeholder={t("user.enterLastName")}
        error={errors.lastName}
      />

      <FormField
        id="email"
        label={`${t("user.email")} *`}
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        disabled={isLoading}
        placeholder={t("user.enterEmailAddress")}
        error={errors.email}
      />

      <button type="submit" className="hidden" />
    </form>
  );
}
