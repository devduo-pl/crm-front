"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceForm, type InvoiceFormData } from "@/components/organisms/InvoiceForm";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { useNotification } from "@/hooks/useNotification";
import type { InvoiceCreateData } from "@/types/invoice";

export function InvoiceCreatePage() {
  const router = useRouter();
  const t = useTranslations("invoices");
  const commonT = useTranslations("common");
  const createInvoiceMutation = useCreateInvoice();
  const { showSuccess, showError } = useNotification();

  const handleFormSubmit = async (formData: InvoiceFormData) => {
    try {
      const invoiceData: InvoiceCreateData = {
        invoiceNumber: formData.invoiceNumber,
        type: formData.type,
        issueDate: formData.issueDate,
        saleDate: formData.saleDate,
        dueDate: formData.dueDate,
        currency: formData.currency,
        exchangeRate: formData.currency !== "PLN" ? formData.exchangeRate : undefined,
        exchangeRateDate: formData.currency !== "PLN" ? formData.exchangeRateDate : undefined,
        sellerId: formData.sellerId,
        buyerId: formData.buyerId,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
        items: formData.items,
      };

      const createdInvoice = await createInvoiceMutation.mutateAsync(invoiceData);
      showSuccess(
        t("invoiceCreatedSuccess"),
        `${formData.invoiceNumber} ${t("invoiceAddedToSystem")}`
      );
      router.push(`/invoices/${createdInvoice.id}`);
    } catch (error) {
      console.error("Failed to create invoice:", error);
      showError(t("failedToCreateInvoice"), t("failedToCreateInvoice"));
    }
  };

  const handleSaveInvoice = () => {
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("createInvoice")}</h1>
          <p className="text-gray-600">{t("description")}</p>
        </div>
        <Button 
          onClick={() => router.push("/invoices")} 
          variant="outline"
        >
          {commonT("cancel")}
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("createInvoice")}</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm onSubmit={handleFormSubmit} />
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <Button
              type="button"
              onClick={() => router.push("/invoices")}
              variant="outline"
            >
              {commonT("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSaveInvoice}
              disabled={createInvoiceMutation.isPending}
            >
              {createInvoiceMutation.isPending ? commonT("loading") : t("createInvoice")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

