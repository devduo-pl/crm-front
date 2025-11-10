"use client";

import { useState, useEffect } from "react";
import { FormField } from "@/components/atoms/FormField";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { LoadingButton } from "@/components/atoms/LoadingButton";

import { useBirSearch } from "@/hooks/useCompanies";
import { useAlert } from "@/contexts/AlertContext";
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
  annualRevenue: typeof initialData?.annualRevenue === 'string' 
    ? parseFloat(initialData.annualRevenue) || 0 
    : initialData?.annualRevenue || 0,
  employeeCount: typeof initialData?.employeeCount === 'string' 
    ? parseInt(initialData.employeeCount) || 0 
    : initialData?.employeeCount || 0,
  tags: initialData?.tags ? (initialData.tags as string[]) : [],
});

export function CompanyForm({ initialData, onSubmit }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>(() => createFormData(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const birSearchMutation = useBirSearch();
  const { addAlert } = useAlert();

  useEffect(() => {
    setFormData(createFormData(initialData));
  }, [initialData]);

  const handleInputChange = (field: keyof CompanyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBirSearch = async (searchType: 'nip' | 'regon' | 'krs') => {
    const searchValue = formData[searchType];
    if (!searchValue) {
      addAlert({
        type: "error",
        title: "Search Error",
        message: `Please enter a ${searchType.toUpperCase()} number first.`,
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
          title: "Data Retrieved",
          message: "Company data has been successfully retrieved from BIR registry.",
        });
      } else {
        addAlert({
          type: "error",
          title: "Company Not Found",
          message: response.error || "No company found with the provided identifier.",
        });
      }
    } catch {
      addAlert({
        type: "error",
        title: "Search Failed",
        message: "Failed to search company data. Please try again.",
      });
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (isNaN(formData.annualRevenue) || formData.annualRevenue < 0) {
      newErrors.annualRevenue = "Annual revenue must be a valid positive number";
    }

    if (isNaN(formData.employeeCount) || formData.employeeCount < 0) {
      newErrors.employeeCount = "Employee count must be a valid positive number";
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
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        
        <FormField
          id="name"
          label="Company Name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter company name"
          error={errors.name}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-2">
            <FormField
              id="nip"
              label="NIP"
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
              onClick={() => handleBirSearch('nip')}
              isLoading={birSearchMutation.isPending}
              loadingText="Searching..."
            >
              Search
            </LoadingButton>
          </div>

          <div className="flex gap-2">
            <FormField
              id="regon"
              label="REGON"
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
              onClick={() => handleBirSearch('regon')}
              isLoading={birSearchMutation.isPending}
              loadingText="Searching..."
            >
              Search
            </LoadingButton>
          </div>

          <div className="flex gap-2">
            <FormField
              id="krs"
              label="KRS"
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
              onClick={() => handleBirSearch('krs')}
              isLoading={birSearchMutation.isPending}
              loadingText="Searching..."
            >
              Search
            </LoadingButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="legalForm"
            label="Legal Form"
            type="text"
            value={formData.legalForm}
            onChange={(e) => handleInputChange("legalForm", e.target.value)}
            placeholder="Sp. z o.o."
            error={errors.legalForm}
          />

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="industry"
            label="Industry"
            type="text"
            value={formData.industry}
            onChange={(e) => handleInputChange("industry", e.target.value)}
            placeholder="Technology"
            error={errors.industry}
          />

          <FormField
            id="size"
            label="Company Size"
            type="text"
            value={formData.size}
            onChange={(e) => handleInputChange("size", e.target.value)}
            placeholder="Small, Medium, Large"
            error={errors.size}
          />
        </div>

        <FormField
          id="description"
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Company description..."
          error={errors.description}
        />
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+48123456789"
            error={errors.phone}
          />

          <FormField
            id="email"
            label="Email"
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
        <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            id="province"
            label="Province"
            type="text"
            value={formData.province}
            onChange={(e) => handleInputChange("province", e.target.value)}
            placeholder="Mazowieckie"
            error={errors.province}
          />

          <FormField
            id="county"
            label="County"
            type="text"
            value={formData.county}
            onChange={(e) => handleInputChange("county", e.target.value)}
            placeholder="Warszawski"
            error={errors.county}
          />

          <FormField
            id="municipality"
            label="Municipality"
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
            label="City"
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="Warsaw"
            error={errors.city}
          />

          <FormField
            id="postalCode"
            label="Postal Code"
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
            label="Street"
            type="text"
            value={formData.street}
            onChange={(e) => handleInputChange("street", e.target.value)}
            placeholder="ul. Przykładowa"
            error={errors.street}
          />

          <FormField
            id="buildingNumber"
            label="Building Number"
            type="text"
            value={formData.buildingNumber}
            onChange={(e) => handleInputChange("buildingNumber", e.target.value)}
            placeholder="123"
            error={errors.buildingNumber}
          />

          <FormField
            id="apartmentNumber"
            label="Apartment Number"
            type="text"
            value={formData.apartmentNumber}
            onChange={(e) => handleInputChange("apartmentNumber", e.target.value)}
            placeholder="45"
            error={errors.apartmentNumber}
          />
        </div>

        <FormField
          id="fullAddress"
          label="Full Address"
          type="text"
          value={formData.fullAddress}
          onChange={(e) => handleInputChange("fullAddress", e.target.value)}
          placeholder="Complete address"
          error={errors.fullAddress}
        />
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Financial Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="annualRevenue"
            label="Annual Revenue"
            type="number"
            value={formData.annualRevenue.toString()}
            onChange={(e) => handleInputChange("annualRevenue", parseFloat(e.target.value) || 0)}
            placeholder="1000000"
            min="0"
            step="0.01"
            error={errors.annualRevenue}
          />

          <FormField
            id="employeeCount"
            label="Employee Count"
            type="number"
            value={formData.employeeCount.toString()}
            onChange={(e) => handleInputChange("employeeCount", parseInt(e.target.value) || 0)}
            placeholder="50"
            min="0"
            step="1"
            error={errors.employeeCount}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Tags</h3>
        
        <FormField
          id="tags"
          label="Tags (comma-separated)"
          type="text"
          value={formData.tags.join(', ')}
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
