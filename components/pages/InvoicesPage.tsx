"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DataTable,
  TableColumn,
  TableAction,
  PaginationInfo,
  PageHeaderAction,
} from "@/components/molecules/Table";
import { ConfirmationDialog } from "@/components/molecules/ConfirmationDialog";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import {
  useInvoices,
  useDeleteInvoice,
} from "@/hooks/useInvoices";
import { useTableSorting } from "@/hooks/useTableSorting";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useNotification } from "@/hooks/useNotification";
import { useTranslations } from "next-intl";
import { invoicesService } from "@/services/invoices";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import type { Invoice } from "@/types/invoice";

export function InvoicesPage() {
  const [page, setPage] = useState(1);
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    invoice: Invoice | undefined;
  }>({
    isOpen: false,
    invoice: undefined,
  });

  const router = useRouter();
  const t = useTranslations("invoices");
  const tableT = useTranslations("table");
  const commonT = useTranslations("common");

  const {
    data: invoicesResponse,
    isLoading,
    error,
    refetch,
  } = useInvoices({ page, limit: 10 }); // Temporarily removed include parameter due to backend GROUP BY issue

  const deleteInvoiceMutation = useDeleteInvoice();
  const { showSuccess, showError } = useNotification();

  const invoices = invoicesResponse?.data || [];
  const pagination: PaginationInfo = {
    page: invoicesResponse?.meta?.page || 1,
    limit: invoicesResponse?.meta?.limit || 10,
    total: invoicesResponse?.meta?.total || 0,
    totalPages: invoicesResponse?.meta?.totalPages || 0,
  };

  const { searchValue, setSearchValue, filteredData } = useGlobalSearch({
    data: invoices,
    searchFields: ["invoiceNumber", "notes", "currency", "paymentStatus"],
  });

  const { sortState, sortedData: sortedInvoices, onSortChange } = useTableSorting<Invoice>({
    data: filteredData,
  });

  const getPaymentStatusVariant = (status: string): "active" | "inactive" => {
    switch (status) {
      case "PAID":
        return "active";
      case "UNPAID":
      case "OVERDUE":
      case "PARTIALLY_PAID":
        return "inactive";
      default:
        return "inactive";
    }
  };

  const columns: TableColumn<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: t("invoiceNumber"),
      className: "font-medium",
      sortable: true,
    },
    {
      key: "type",
      header: t("type"),
      render: (value) => t(`types.${value as string}`),
      sortable: true,
    },
    {
      key: "issueDate",
      header: t("issueDate"),
      render: (value) => new Date(value as string).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "dueDate",
      header: t("dueDate"),
      render: (value) => new Date(value as string).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "totalGross",
      header: t("totalGross"),
      render: (value, row) => `${Number(value).toFixed(2)} ${row.currency}`,
      sortable: true,
    },
    {
      key: "paymentStatus",
      header: t("paymentStatus"),
      render: (value) => (
        <StatusBadge 
          status={getPaymentStatusVariant(value as string)}
          label={t(`paymentStatuses.${value as string}`)}
        />
      ),
      sortable: true,
    },
    {
      key: "createdAt",
      header: tableT("created"),
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const handleDownloadPdf = async (invoice: Invoice) => {
    setDownloadingPdfId(invoice.id);
    try {
      const detailedInvoice = await invoicesService.getInvoice(
        invoice.id,
        "seller,buyer,items,payments,taxSummaries"
      );

      const blob = await generateInvoicePdf(detailedInvoice);

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
      setDownloadingPdfId(null);
    }
  };

  const actions: TableAction<Invoice>[] = [
    {
      label: t("viewInvoice"),
      onClick: (invoice) => router.push(`/invoices/${invoice.id}`),
      variant: "outline",
    },
    {
      label: t("downloadPdf"),
      onClick: handleDownloadPdf,
      variant: "outline",
      loading: (invoice) => downloadingPdfId === invoice.id,
    },
    {
      label: tableT("delete"),
      onClick: (invoice) => handleDeleteConfirmation(invoice),
      variant: "destructive",
    },
  ];

  const headerActions: PageHeaderAction[] = [
    {
      label: t("createInvoice"),
      onClick: () => router.push("/invoices/create"),
      variant: "default",
    },
  ];

  function handleDeleteConfirmation(invoice: Invoice) {
    setConfirmationDialog({
      isOpen: true,
      invoice,
    });
  }

  function handleCloseConfirmation() {
    setConfirmationDialog({
      isOpen: false,
      invoice: undefined,
    });
  }

  async function handleConfirmDelete() {
    if (!confirmationDialog.invoice) return;

    try {
      await deleteInvoiceMutation.mutateAsync(confirmationDialog.invoice.id);
      showSuccess(
        t("invoiceDeletedSuccess"), 
        `${confirmationDialog.invoice.invoiceNumber} ${t("invoiceRemovedFromSystem")}`
      );
      handleCloseConfirmation();
      refetch();
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      showError(t("failedToDeleteInvoice"), t("failedToDeleteInvoice"));
    }
  }

  const confirmationContent = {
    title: t("deleteInvoice"),
    message: confirmationDialog.invoice 
      ? t("deleteInvoiceConfirm", { number: confirmationDialog.invoice.invoiceNumber })
      : t("deleteInvoiceConfirm", { number: "" }),
  };

  return (
    <>
      <DataTable<Invoice>
        title={t("title")}
        description={t("description")}
        headerActions={headerActions}
        cardTitle={t("allInvoices")}
        data={sortedInvoices}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={t("noInvoicesFound")}
        emptyDescription={t("noInvoicesDescription")}
        pagination={pagination}
        onPageChange={setPage}
        sortable={true}
        sortState={sortState}
        onSortChange={onSortChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={handleConfirmDelete}
        confirmLabel={t("deleteInvoice")}
        cancelLabel={commonT("cancel")}
        variant="destructive"
        isLoading={deleteInvoiceMutation.isPending}
      />
    </>
  );
}

