"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";
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
  const [formData, setFormData] = useState<UserFormData>(() => createFormData(user));
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  useEffect(() => {
    setFormData(createFormData(user));
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
        label="First Name *"
        type="text"
        value={formData.firstName}
        onChange={(e) => handleInputChange("firstName", e.target.value)}
        disabled={isLoading}
        placeholder="Enter first name"
        error={errors.firstName}
      />

      <FormField
        id="lastName"
        label="Last Name *"
        type="text"
        value={formData.lastName}
        onChange={(e) => handleInputChange("lastName", e.target.value)}
        disabled={isLoading}
        placeholder="Enter last name"
        error={errors.lastName}
      />

      <FormField
        id="email"
        label="Email *"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        disabled={isLoading}
        placeholder="Enter email address"
        error={errors.email}
      />

      <button type="submit" className="hidden" />
    </form>
  );
}
