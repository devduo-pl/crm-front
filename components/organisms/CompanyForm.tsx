"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingButton } from "@/components/atoms/LoadingButton";

import { useBirSearch } from "@/hooks/useCompanies";
import { useAlert } from "@/contexts/AlertContext";
import { useFormsTranslations } from "@/hooks/useTranslations";
import type { CompanyFormData, Company } from "@/types/company";

export interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: CompanyFormData) => void;
}

export { type CompanyFormData };

const createFormData = (initialData?: Partial<Company>): CompanyFormData => ({
  name: initialData?.name || "",
  nip: initialData?.nip || "",
  regon: initialData?.regon || "",
  krs: initialData?.krs || "",
  legalForm: initialData?.legalForm || "",
  status: initialData?.status || "active",
  industry: initialData?.industry || "",
  size: initialData?.size || "",
  description: initialData?.description || "",
  phone: initialData?.phone || "",
  email: initialData?.email || "",
  province: initialData?.province || "",
  county: initialData?.county || "",
  municipality: initialData?.municipality || "",
  city: initialData?.city || "",
  postalCode: initialData?.postalCode || "",
  street: initialData?.street || "",
  buildingNumber: initialData?.buildingNumber || "",
  apartmentNumber: initialData?.apartmentNumber || "",
  fullAddress: initialData?.fullAddress || "",
  annualRevenue:
    typeof initialData?.annualRevenue === "string"
      ? parseFloat(initialData.annualRevenue) || 0
      : initialData?.annualRevenue || 0,
  employeeCount:
    typeof initialData?.employeeCount === "string"
      ? parseInt(initialData.employeeCount) || 0
      : initialData?.employeeCount || 0,
  tags: initialData?.tags ? (initialData.tags as string[]) : [],
});

export function CompanyForm({ initialData, onSubmit }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>(() =>
    createFormData(initialData)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = useFormsTranslations();
  const birSearchMutation = useBirSearch();
  const { addAlert } = useAlert();

  useEffect(() => {
    setFormData(createFormData(initialData));
  }, [initialData]);

  const handleInputChange = (
    field: keyof CompanyFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBirSearch = async (searchType: "nip" | "regon" | "krs") => {
    const searchValue = formData[searchType];
    if (!searchValue) {
      addAlert({
        type: "error",
        title: t("company.searchError"),
        message: t("company.enterNumberFirst", {
          type: searchType.toUpperCase(),
        }),
      });
      return;
    }

    try {
      const response = await birSearchMutation.mutateAsync({
        [searchType]: searchValue,
      });

      if (response.success && response.data) {
        // Merge BIR data with current form data, prioritizing BIR data when available
        const mergedData = {
          ...formData, // Keep current form data as base
          ...response.data, // Override with BIR data where available
        };

        // Use createFormData to ensure proper type conversion
        setFormData(createFormData(mergedData));

        addAlert({
          type: "success",
          title: t("company.dataRetrieved"),
          message: t("company.dataRetrievedSuccess"),
        });
      } else {
        addAlert({
          type: "error",
          title: t("company.companyNotFound"),
          message: response.error || t("company.noCompanyFound"),
        });
      }
    } catch {
      addAlert({
        type: "error",
        title: t("company.searchFailed"),
        message: t("company.searchFailedMessage"),
      });
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("company.companyNameRequired");
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("company.validEmailRequired");
    }

    if (
      formData.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = t("company.validPhoneRequired");
    }

    if (isNaN(formData.annualRevenue) || formData.annualRevenue < 0) {
      newErrors.annualRevenue = t("company.validRevenueRequired");
    }

    if (isNaN(formData.employeeCount) || formData.employeeCount < 0) {
      newErrors.employeeCount = t("company.validEmployeeCountRequired");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("company.basicInformation")}
        </h3>

        <FormField
          id="name"
          label={t("company.companyName")}
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder={t("company.enterCompanyName")}
          error={errors.name}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-2">
            <FormField
              id="nip"
              label={t("company.nip")}
              type="text"
              value={formData.nip}
              onChange={(e) => handleInputChange("nip", e.target.value)}
              placeholder="1234567890"
              error={errors.nip}
            />
            <LoadingButton
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => handleBirSearch("nip")}
              isLoading={birSearchMutation.isPending}
              loadingText={t("company.searching")}
            >
              {t("company.search")}
            </LoadingButton>
          </div>

          <div className="flex gap-2">
            <FormField
              id="regon"
              label={t("company.regon")}
              type="text"
              value={formData.regon}
              onChange={(e) => handleInputChange("regon", e.target.value)}
              placeholder="123456789"
              error={errors.regon}
            />
            <LoadingButton
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => handleBirSearch("regon")}
              isLoading={birSearchMutation.isPending}
              loadingText={t("company.searching")}
            >
              {t("company.search")}
            </LoadingButton>
          </div>

          <div className="flex gap-2">
            <FormField
              id="krs"
              label={t("company.krs")}
              type="text"
              value={formData.krs}
              onChange={(e) => handleInputChange("krs", e.target.value)}
              placeholder="0000123456"
              error={errors.krs}
            />
            <LoadingButton
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => handleBirSearch("krs")}
              isLoading={birSearchMutation.isPending}
              loadingText={t("company.searching")}
            >
              {t("company.search")}
            </LoadingButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="legalForm"
            label={t("company.legalForm")}
            type="text"
            value={formData.legalForm}
            onChange={(e) => handleInputChange("legalForm", e.target.value)}
            placeholder="Sp. z o.o."
            error={errors.legalForm}
          />

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("company.status")}
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">{t("company.active")}</option>
              <option value="inactive">{t("company.inactive")}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="industry"
            label={t("company.industry")}
            type="text"
            value={formData.industry}
            onChange={(e) => handleInputChange("industry", e.target.value)}
            placeholder="Technology"
            error={errors.industry}
          />

          <FormField
            id="size"
            label={t("company.companySize")}
            type="text"
            value={formData.size}
            onChange={(e) => handleInputChange("size", e.target.value)}
            placeholder="Small, Medium, Large"
            error={errors.size}
          />
        </div>

        <FormField
          id="description"
          label={t("company.description")}
          type="textarea"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Company description..."
          error={errors.description}
        />
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("company.contactInformation")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="phone"
            label={t("company.phone")}
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+48123456789"
            error={errors.phone}
          />

          <FormField
            id="email"
            label={t("company.email")}
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="contact@company.com"
            error={errors.email}
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("company.addressInformation")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            id="province"
            label={t("company.province")}
            type="text"
            value={formData.province}
            onChange={(e) => handleInputChange("province", e.target.value)}
            placeholder="Mazowieckie"
            error={errors.province}
          />

          <FormField
            id="county"
            label={t("company.county")}
            type="text"
            value={formData.county}
            onChange={(e) => handleInputChange("county", e.target.value)}
            placeholder="Warszawski"
            error={errors.county}
          />

          <FormField
            id="municipality"
            label={t("company.municipality")}
            type="text"
            value={formData.municipality}
            onChange={(e) => handleInputChange("municipality", e.target.value)}
            placeholder="Warszawa"
            error={errors.municipality}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="city"
            label={t("company.city")}
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="Warsaw"
            error={errors.city}
          />

          <FormField
            id="postalCode"
            label={t("company.postalCode")}
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            placeholder="00-001"
            error={errors.postalCode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            id="street"
            label={t("company.street")}
            type="text"
            value={formData.street}
            onChange={(e) => handleInputChange("street", e.target.value)}
            placeholder="ul. Przykładowa"
            error={errors.street}
          />

          <FormField
            id="buildingNumber"
            label={t("company.buildingNumber")}
            type="text"
            value={formData.buildingNumber}
            onChange={(e) =>
              handleInputChange("buildingNumber", e.target.value)
            }
            placeholder="123"
            error={errors.buildingNumber}
          />

          <FormField
            id="apartmentNumber"
            label={t("company.apartmentNumber")}
            type="text"
            value={formData.apartmentNumber}
            onChange={(e) =>
              handleInputChange("apartmentNumber", e.target.value)
            }
            placeholder="45"
            error={errors.apartmentNumber}
          />
        </div>

        <FormField
          id="fullAddress"
          label={t("company.fullAddress")}
          type="text"
          value={formData.fullAddress}
          onChange={(e) => handleInputChange("fullAddress", e.target.value)}
          placeholder="Complete address"
          error={errors.fullAddress}
        />
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("company.financialInformation")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="annualRevenue"
            label={t("company.annualRevenue")}
            type="number"
            value={formData.annualRevenue.toString()}
            onChange={(e) =>
              handleInputChange(
                "annualRevenue",
                parseFloat(e.target.value) || 0
              )
            }
            placeholder="1000000"
            min="0"
            step="0.01"
            error={errors.annualRevenue}
          />

          <FormField
            id="employeeCount"
            label={t("company.employeeCount")}
            type="number"
            value={formData.employeeCount.toString()}
            onChange={(e) =>
              handleInputChange("employeeCount", parseInt(e.target.value) || 0)
            }
            placeholder="50"
            min="0"
            step="1"
            error={errors.employeeCount}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("company.tags")}
        </h3>

        <FormField
          id="tags"
          label={t("company.tagsCommaSeparated")}
          type="text"
          value={formData.tags.join(", ")}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="technology, startup, b2b"
          error={errors.tags}
        />
      </div>

      {/* Error Display */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-2">
          {Object.entries(errors).map(([field, error]) => (
            <ErrorMessage key={field} message={error} />
          ))}
        </div>
      )}
    </form>
  );
}
