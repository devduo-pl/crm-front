"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/atoms/FormField";
import { ErrorMessage } from "@/components/atoms/ErrorMessage";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/useCompanies";
import type {
  InvoiceFormData,
  Invoice,
  InvoiceType,
  PaymentMethod,
  InvoiceItemInput,
} from "@/types/invoice";

export interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  onSubmit: (data: InvoiceFormData) => void;
}

export { type InvoiceFormData };

const createFormData = (initialData?: Partial<Invoice>): InvoiceFormData => ({
  invoiceNumber: initialData?.invoiceNumber || "",
  type: initialData?.type || "VAT",
  issueDate:
    initialData?.issueDate?.split("T")[0] ||
    new Date().toISOString().split("T")[0],
  saleDate:
    initialData?.saleDate?.split("T")[0] ||
    new Date().toISOString().split("T")[0],
  dueDate:
    initialData?.dueDate?.split("T")[0] ||
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: initialData?.currency || "PLN",
  exchangeRate: initialData?.exchangeRate || 1,
  exchangeRateDate:
    initialData?.exchangeRateDate?.split("T")[0] ||
    new Date().toISOString().split("T")[0],
  sellerId: initialData?.sellerId || 0,
  buyerId: initialData?.buyerId || 0,
  paymentMethod: initialData?.paymentMethod || "TRANSFER",
  notes: initialData?.notes || "",
  items: initialData?.items || [
    {
      description: "",
      quantity: 1,
      unit: "szt",
      unitNetPrice: 0,
      vatRate: 23,
    },
  ],
});

export function InvoiceForm({ initialData, onSubmit }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(() =>
    createFormData(initialData)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customVatRates, setCustomVatRates] = useState<Record<number, boolean>>(
    {}
  );
  const [customUnits, setCustomUnits] = useState<Record<number, boolean>>({});

  const t = useTranslations("invoices");
  const { data: companiesResponse } = useCompanies({ limit: 100 });
  const companies = companiesResponse?.data || [];

  useEffect(() => {
    setFormData(createFormData(initialData));
  }, [initialData]);

  const handleInputChange = (
    field: keyof Omit<InvoiceFormData, "items">,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItemInput,
    value: string | number
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleVatRateChange = (index: number, value: string) => {
    if (value === "custom") {
      setCustomVatRates((prev) => ({ ...prev, [index]: true }));
      handleItemChange(index, "vatRate", 0);
    } else if (value === "np" || value === "zw") {
      setCustomVatRates((prev) => ({ ...prev, [index]: false }));
      handleItemChange(index, "vatRate", 0);
      handleItemChange(index, "vatExemptionReason", value.toUpperCase());
    } else {
      setCustomVatRates((prev) => ({ ...prev, [index]: false }));
      handleItemChange(index, "vatRate", parseFloat(value));
      handleItemChange(index, "vatExemptionReason", "");
    }
  };

  const handleUnitChange = (index: number, value: string) => {
    if (value === "custom") {
      setCustomUnits((prev) => ({ ...prev, [index]: true }));
      handleItemChange(index, "unit", "");
    } else {
      setCustomUnits((prev) => ({ ...prev, [index]: false }));
      handleItemChange(index, "unit", value);
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: 1,
          unit: "szt",
          unitNetPrice: 0,
          vatRate: 23,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateItemTotals = (item: InvoiceItemInput) => {
    const netAmount = item.quantity * item.unitNetPrice;
    const vatAmount = netAmount * (item.vatRate / 100);
    const grossAmount = netAmount + vatAmount;
    return { netAmount, vatAmount, grossAmount };
  };

  const calculateTotals = () => {
    let totalNet = 0;
    let totalVat = 0;
    let totalGross = 0;

    formData.items.forEach((item) => {
      const { netAmount, vatAmount, grossAmount } = calculateItemTotals(item);
      totalNet += netAmount;
      totalVat += vatAmount;
      totalGross += grossAmount;
    });

    return { totalNet, totalVat, totalGross };
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = t("invoiceNumber") + " is required";
    }

    if (!formData.sellerId || formData.sellerId === 0) {
      newErrors.sellerId = t("companyRequired");
    }

    if (!formData.buyerId || formData.buyerId === 0) {
      newErrors.buyerId = t("companyRequired");
    }

    if (formData.items.length === 0) {
      newErrors.items = t("itemsRequired");
    }

    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = "Description is required";
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
      }
      if (item.unitNetPrice < 0) {
        newErrors[`item_${index}_unitNetPrice`] = "Price cannot be negative";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("basicInformation")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="invoiceNumber"
            label={t("invoiceNumber")}
            type="text"
            required
            value={formData.invoiceNumber}
            onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
            placeholder="FV/2025/0001"
            error={errors.invoiceNumber}
          />

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("type")} *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                handleInputChange("type", e.target.value as InvoiceType)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="VAT">{t("types.VAT")}</option>
              <option value="PROFORMA">{t("types.PROFORMA")}</option>
              <option value="CORRECTION">{t("types.CORRECTION")}</option>
              <option value="RECEIPT">{t("types.RECEIPT")}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            id="issueDate"
            label={t("issueDate")}
            type="date"
            required
            value={formData.issueDate}
            onChange={(e) => handleInputChange("issueDate", e.target.value)}
            error={errors.issueDate}
          />

          <FormField
            id="saleDate"
            label={t("saleDate")}
            type="date"
            required
            value={formData.saleDate}
            onChange={(e) => handleInputChange("saleDate", e.target.value)}
            error={errors.saleDate}
          />

          <FormField
            id="dueDate"
            label={t("dueDate")}
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            error={errors.dueDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sellerId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("seller")} *
            </label>
            <select
              id="sellerId"
              value={formData.sellerId}
              onChange={(e) =>
                handleInputChange("sellerId", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="0">{t("selectSeller")}</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} {company.nip && `(NIP: ${company.nip})`}
                </option>
              ))}
            </select>
            {errors.sellerId && <ErrorMessage message={errors.sellerId} />}
          </div>

          <div>
            <label
              htmlFor="buyerId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("buyer")} *
            </label>
            <select
              id="buyerId"
              value={formData.buyerId}
              onChange={(e) =>
                handleInputChange("buyerId", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="0">{t("selectBuyer")}</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} {company.nip && `(NIP: ${company.nip})`}
                </option>
              ))}
            </select>
            {errors.buyerId && <ErrorMessage message={errors.buyerId} />}
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {t("paymentInformation")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="currency"
            label={t("currency")}
            type="text"
            required
            value={formData.currency}
            onChange={(e) => handleInputChange("currency", e.target.value)}
            placeholder="PLN"
            error={errors.currency}
          />

          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("paymentMethod")} *
            </label>
            <select
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) =>
                handleInputChange(
                  "paymentMethod",
                  e.target.value as PaymentMethod
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="TRANSFER">{t("paymentMethods.TRANSFER")}</option>
              <option value="CASH">{t("paymentMethods.CASH")}</option>
              <option value="CARD">{t("paymentMethods.CARD")}</option>
              <option value="OTHER">{t("paymentMethods.OTHER")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {t("invoiceItems")}
          </h3>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            {t("addItem")}
          </Button>
        </div>

        {errors.items && <ErrorMessage message={errors.items} />}

        {formData.items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Item {index + 1}</h4>
              {formData.items.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeItem(index)}
                  variant="destructive"
                  size="sm"
                >
                  {t("removeItem")}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <FormField
                  id={`item_${index}_description`}
                  label={t("description")}
                  type="text"
                  required
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Product or service description"
                  error={errors[`item_${index}_description`]}
                />
              </div>
              <FormField
                id={`item_${index}_pkwiuCode`}
                label="PKWiU"
                type="text"
                value={item.pkwiuCode || ""}
                onChange={(e) =>
                  handleItemChange(index, "pkwiuCode", e.target.value)
                }
                placeholder="62.01.1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                id={`item_${index}_quantity`}
                label={t("quantity")}
                type="number"
                required
                value={item.quantity.toString()}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    parseFloat(e.target.value) || 0
                  )
                }
                min="0"
                step="0.01"
                error={errors[`item_${index}_quantity`]}
              />

              <div>
                <label
                  htmlFor={`item_${index}_unit`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("unit")} *
                </label>
                <select
                  id={`item_${index}_unit`}
                  value={customUnits[index] ? "custom" : item.unit}
                  onChange={(e) => handleUnitChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="szt">{t("units.szt")}</option>
                  <option value="godz">{t("units.godz")}</option>
                  <option value="kg">{t("units.kg")}</option>
                  <option value="g">{t("units.g")}</option>
                  <option value="t">{t("units.t")}</option>
                  <option value="l">{t("units.l")}</option>
                  <option value="m">{t("units.m")}</option>
                  <option value="m2">{t("units.m2")}</option>
                  <option value="m3">{t("units.m3")}</option>
                  <option value="km">{t("units.km")}</option>
                  <option value="mb">{t("units.mb")}</option>
                  <option value="kpl">{t("units.kpl")}</option>
                  <option value="opak">{t("units.opak")}</option>
                  <option value="custom">{t("units.custom")}</option>
                </select>
                {customUnits[index] && (
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(index, "unit", e.target.value)
                    }
                    placeholder={t("customUnit")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                    required
                  />
                )}
              </div>

              <FormField
                id={`item_${index}_unitNetPrice`}
                label={t("unitNetPrice")}
                type="number"
                required
                value={item.unitNetPrice.toString()}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "unitNetPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                min="0"
                step="0.01"
                error={errors[`item_${index}_unitNetPrice`]}
              />

              <div>
                <label
                  htmlFor={`item_${index}_vatRate`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("vatRate")} *
                </label>
                <select
                  id={`item_${index}_vatRate`}
                  value={
                    customVatRates[index]
                      ? "custom"
                      : item.vatExemptionReason === "NP"
                      ? "np"
                      : item.vatExemptionReason === "ZW"
                      ? "zw"
                      : item.vatRate.toString()
                  }
                  onChange={(e) => handleVatRateChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="23">{t("vatRates.23")}</option>
                  <option value="8">{t("vatRates.8")}</option>
                  <option value="5">{t("vatRates.5")}</option>
                  <option value="0">{t("vatRates.0")}</option>
                  <option value="np">{t("vatRates.np")}</option>
                  <option value="zw">{t("vatRates.zw")}</option>
                  <option value="custom">{t("vatRates.custom")}</option>
                </select>
                {customVatRates[index] && (
                  <input
                    type="number"
                    value={item.vatRate.toString()}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "vatRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder={t("customVatRate")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                )}
              </div>
            </div>

            {/* VAT Exemption Reason for NP/ZW */}
            {(item.vatExemptionReason === "NP" ||
              item.vatExemptionReason === "ZW") && (
              <FormField
                id={`item_${index}_vatExemptionReason_detail`}
                label={t("vatExemptionReason")}
                type="text"
                value={item.vatExemptionReason || ""}
                onChange={(e) =>
                  handleItemChange(index, "vatExemptionReason", e.target.value)
                }
                placeholder={t("enterVatExemptionReason")}
              />
            )}

            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div>
                <p className="text-sm text-gray-600">{t("netAmount")}</p>
                <p className="font-medium">
                  {calculateItemTotals(item).netAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("vatAmount")}</p>
                <p className="font-medium">
                  {calculateItemTotals(item).vatAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("grossAmount")}</p>
                <p className="font-medium">
                  {calculateItemTotals(item).grossAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals Summary */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">{t("totalNet")}</p>
            <p className="text-xl font-bold">
              {totals.totalNet.toFixed(2)} {formData.currency}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t("totalVat")}</p>
            <p className="text-xl font-bold">
              {totals.totalVat.toFixed(2)} {formData.currency}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t("totalGross")}</p>
            <p className="text-xl font-bold text-blue-600">
              {totals.totalGross.toFixed(2)} {formData.currency}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <FormField
        id="notes"
        label={t("notes")}
        type="textarea"
        value={formData.notes}
        onChange={(e) => handleInputChange("notes", e.target.value)}
        placeholder="Additional notes..."
      />

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
