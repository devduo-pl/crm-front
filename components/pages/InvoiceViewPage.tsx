"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useInvoice, useRecordPayment } from "@/hooks/useInvoices";
import { useNotification } from "@/hooks/useNotification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { Popup, PopupAction } from "@/components/molecules/Popup";
import { FormField } from "@/components/atoms/FormField";
import { useState } from "react";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import type { RecordPaymentData, PaymentMethod } from "@/types/invoice";

interface InvoiceViewPageProps {
  invoiceId: string;
}

export function InvoiceViewPage({ invoiceId }: InvoiceViewPageProps) {
  const router = useRouter();
  const t = useTranslations("invoices");
  const commonT = useTranslations("common");
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [paymentData, setPaymentData] = useState<RecordPaymentData>({
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: "PLN",
    method: "TRANSFER",
    transactionReference: "",
    notes: "",
  });

  const { data: invoice, isLoading, error, refetch } = useInvoice(
    invoiceId,
    "seller,buyer,items,payments,taxSummaries"
  );
  const recordPaymentMutation = useRecordPayment();
  const { showSuccess, showError } = useNotification();

  const getPaymentStatusVariant = (status: string): "active" | "inactive" => {
    return status === "PAID" ? "active" : "inactive";
  };

  const handleDownloadPdf = async () => {
    if (!invoice) return;

    setIsDownloadingPdf(true);
    try {
      const blob = await generateInvoicePdf(invoice);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess(t("pdfDownloadSuccess"), invoice.invoiceNumber);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      const errorMessage = error instanceof Error ? error.message : t("pdfDownloadError");
      showError(t("pdfDownloadError"), errorMessage);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleRecordPayment = async () => {
    try {
      await recordPaymentMutation.mutateAsync({
        id: invoiceId,
        data: paymentData,
      });
      showSuccess(t("recordPayment"), t("invoiceUpdatedSuccess"));
      setIsPaymentPopupOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to record payment:", error);
      showError(t("failedToUpdateInvoice"), t("failedToUpdateInvoice"));
    }
  };

  const paymentPopupActions: PopupAction[] = [
    {
      label: commonT("cancel"),
      onClick: () => setIsPaymentPopupOpen(false),
      variant: "outline",
    },
    {
      label: t("recordPayment"),
      onClick: handleRecordPayment,
      variant: "default",
      loading: recordPaymentMutation.isPending,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load invoice</p>
            <Button onClick={() => router.push("/invoices")} className="mt-4">
              {commonT("back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("invoiceDetails")}</h1>
            <p className="text-gray-600">{invoice.invoiceNumber}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push("/invoices")} 
              variant="outline"
            >
              {commonT("back")}
            </Button>
            <Button
              onClick={handleDownloadPdf}
              variant="outline"
              disabled={isDownloadingPdf}
            >
              {isDownloadingPdf ? t("downloadingPdf") : t("downloadPdf")}
            </Button>
            {invoice.paymentStatus !== "PAID" && (
              <Button onClick={() => setIsPaymentPopupOpen(true)}>
                {t("recordPayment")}
              </Button>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("basicInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t("type")}</p>
                <p className="font-medium">{t(`types.${invoice.type}`)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("issueDate")}</p>
                <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("saleDate")}</p>
                <p className="font-medium">{new Date(invoice.saleDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("dueDate")}</p>
                <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("currency")}</p>
                <p className="font-medium">{invoice.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("paymentStatus")}</p>
                <StatusBadge 
                  status={getPaymentStatusVariant(invoice.paymentStatus)}
                  label={t(`paymentStatuses.${invoice.paymentStatus}`)}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t("paymentMethod")}</p>
                <p className="font-medium">{t(`paymentMethods.${invoice.paymentMethod}`)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller and Buyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("seller")}</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.sellerSnapshot ? (
                <div className="space-y-2">
                  <p className="font-medium">{invoice.sellerSnapshot.name}</p>
                  {invoice.sellerSnapshot.nip && <p className="text-sm">NIP: {invoice.sellerSnapshot.nip}</p>}
                  {invoice.sellerSnapshot.address && <p className="text-sm">{invoice.sellerSnapshot.address}</p>}
                  {invoice.sellerSnapshot.city && invoice.sellerSnapshot.postalCode && (
                    <p className="text-sm">{invoice.sellerSnapshot.postalCode} {invoice.sellerSnapshot.city}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Seller ID: {invoice.sellerId}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("buyer")}</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.buyerSnapshot ? (
                <div className="space-y-2">
                  <p className="font-medium">{invoice.buyerSnapshot.name}</p>
                  {invoice.buyerSnapshot.nip && <p className="text-sm">NIP: {invoice.buyerSnapshot.nip}</p>}
                  {invoice.buyerSnapshot.address && <p className="text-sm">{invoice.buyerSnapshot.address}</p>}
                  {invoice.buyerSnapshot.city && invoice.buyerSnapshot.postalCode && (
                    <p className="text-sm">{invoice.buyerSnapshot.postalCode} {invoice.buyerSnapshot.city}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Buyer ID: {invoice.buyerId}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <CardTitle>{t("items")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-2">{t("description")}</th>
                    <th className="pb-2 text-right">{t("quantity")}</th>
                    <th className="pb-2 text-right">{t("unitNetPrice")}</th>
                    <th className="pb-2 text-right">{t("vatRate")}</th>
                    <th className="pb-2 text-right">{t("netAmount")}</th>
                    <th className="pb-2 text-right">{t("vatAmount")}</th>
                    <th className="pb-2 text-right">{t("grossAmount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">
                        <div>{item.description}</div>
                        {item.pkwiuCode && (
                          <div className="text-xs text-gray-500">PKWiU: {item.pkwiuCode}</div>
                        )}
                        {item.vatExemptionReason && (
                          <div className="text-xs text-gray-500">
                            {t("vatExemptionReason")}: {item.vatExemptionReason}
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-right">{Number(item.quantity)} {item.unit}</td>
                      <td className="py-2 text-right">{Number(item.unitNetPrice).toFixed(2)}</td>
                      <td className="py-2 text-right">
                        {item.vatExemptionReason ? (
                          <span className="text-sm">{item.vatExemptionReason}</span>
                        ) : (
                          <span>{Number(item.vatRate).toFixed(0)}%</span>
                        )}
                      </td>
                      <td className="py-2 text-right">{Number(item.netAmount).toFixed(2)}</td>
                      <td className="py-2 text-right">{Number(item.vatAmount).toFixed(2)}</td>
                      <td className="py-2 text-right font-medium">{Number(item.grossAmount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-medium">
                  <tr className="border-t-2">
                    <td colSpan={4} className="pt-2 text-right">{t("totalNet")}:</td>
                    <td className="pt-2 text-right">{Number(invoice.totalNet).toFixed(2)} {invoice.currency}</td>
                    <td className="pt-2 text-right"></td>
                    <td className="pt-2 text-right"></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right">{t("totalVat")}:</td>
                    <td className="text-right">{Number(invoice.totalVat).toFixed(2)} {invoice.currency}</td>
                    <td className="text-right"></td>
                    <td className="text-right"></td>
                  </tr>
                  <tr className="text-lg">
                    <td colSpan={4} className="text-right">{t("totalGross")}:</td>
                    <td className="text-right"></td>
                    <td className="text-right"></td>
                    <td className="text-right">{Number(invoice.totalGross).toFixed(2)} {invoice.currency}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payments */}
        {invoice.payments && invoice.payments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("payments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">
                        {t(`paymentMethods.${payment.method}`)}
                        {payment.transactionReference && ` - ${payment.transactionReference}`}
                      </p>
                    </div>
                    <p className="font-medium">{Number(payment.amount).toFixed(2)} {payment.currency}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 font-medium">
                  <p>{t("totalPaid")}:</p>
                  <p>{Number(invoice.totalPaid || 0).toFixed(2)} {invoice.currency}</p>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <p>{t("remainingAmount")}:</p>
                  <p>{Number(invoice.remainingAmount || 0).toFixed(2)} {invoice.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {invoice.notes && (
          <Card>
            <CardHeader>
              <CardTitle>{t("notes")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{invoice.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Record Payment Popup */}
      <Popup
        isOpen={isPaymentPopupOpen}
        onClose={() => setIsPaymentPopupOpen(false)}
        title={t("recordPayment")}
        actions={paymentPopupActions}
      >
        <div className="space-y-4">
          <FormField
            id="paymentDate"
            label={t("paymentDate")}
            type="date"
            value={paymentData.paymentDate}
            onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
            required
          />
          <FormField
            id="amount"
            label={t("amount")}
            type="number"
            value={paymentData.amount.toString()}
            onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
            required
            step="0.01"
          />
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              {t("currency")}
            </label>
            <input
              id="currency"
              type="text"
              value={paymentData.currency}
              onChange={(e) => setPaymentData({ ...paymentData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
              {t("paymentMethod")}
            </label>
            <select
              id="method"
              value={paymentData.method}
              onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value as PaymentMethod })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="TRANSFER">{t("paymentMethods.TRANSFER")}</option>
              <option value="CASH">{t("paymentMethods.CASH")}</option>
              <option value="CARD">{t("paymentMethods.CARD")}</option>
              <option value="OTHER">{t("paymentMethods.OTHER")}</option>
            </select>
          </div>
          <FormField
            id="transactionReference"
            label={t("transactionReference")}
            type="text"
            value={paymentData.transactionReference || ""}
            onChange={(e) => setPaymentData({ ...paymentData, transactionReference: e.target.value })}
          />
          <FormField
            id="notes"
            label={t("notes")}
            type="textarea"
            value={paymentData.notes || ""}
            onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
          />
        </div>
      </Popup>
    </>
  );
}

