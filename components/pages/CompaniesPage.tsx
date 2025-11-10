"use client";

import { useState } from "react";
import {
  DataTable,
  TableColumn,
  TableAction,
  PaginationInfo,
  PageHeaderAction,
} from "@/components/molecules/Table";
import { Popup, PopupAction } from "@/components/molecules/Popup";
import { ConfirmationDialog } from "@/components/molecules/ConfirmationDialog";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import {
  CompanyForm,
  CompanyFormData,
} from "@/components/organisms/CompanyForm";
import {
  useCompanies,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "@/hooks/useCompanies";
import { useNotification } from "@/hooks/useNotification";
import {
  useCompaniesTranslations,
  useTableTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";
import type { Company } from "@/types/company";

export function CompaniesPage() {
  const [page, setPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(
    undefined
  );
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    company: Company | undefined;
  }>({
    isOpen: false,
    company: undefined,
  });

  const t = useCompaniesTranslations();
  const tableT = useTableTranslations();
  const commonT = useCommonTranslations();

  const {
    data: companiesResponse,
    isLoading,
    error,
    refetch,
  } = useCompanies({ page, limit: 10 });

  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();
  const { showSuccess, showError } = useNotification();

  const companies = companiesResponse?.data || [];
  const pagination: PaginationInfo = {
    page: companiesResponse?.meta?.page || 1,
    limit: companiesResponse?.meta?.limit || 10,
    total: companiesResponse?.meta?.total || 0,
    totalPages: companiesResponse?.meta?.totalPages || 0,
  };

  const columns: TableColumn<Company>[] = [
    {
      key: "name",
      header: t("companyName"),
      className: "font-medium",
    },
    {
      key: "nip",
      header: t("nip"),
      render: (value) => (value as string) || "—",
    },
    {
      key: "industry",
      header: t("industry"),
      render: (value) => (value as string) || "—",
    },
    {
      key: "status",
      header: tableT("status"),
      render: (value) => (
        <StatusBadge status={value as "active" | "inactive"} />
      ),
    },
    {
      key: "city",
      header: t("city"),
      render: (value) => (value as string) || "—",
    },
    {
      key: "employeeCount",
      header: t("employees"),
      render: (value) => (value ? (value as number).toString() : "—"),
    },
    {
      key: "createdAt",
      header: tableT("created"),
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const actions: TableAction<Company>[] = [
    {
      label: tableT("edit"),
      onClick: handleEdit,
      variant: "outline",
    },
    {
      label: tableT("delete"),
      onClick: (company) => handleDeleteConfirmation(company),
      variant: "destructive",
    },
  ];

  const headerActions: PageHeaderAction[] = [
    {
      label: t("addCompany"),
      onClick: handleAddCompany,
      variant: "default",
    },
  ];

  const popupActions: PopupAction[] = [
    {
      label: commonT("cancel"),
      onClick: handleClosePopup,
      variant: "outline",
    },
    {
      label: editingCompany ? t("updateCompany") : t("createCompany"),
      onClick: handleSaveCompany,
      variant: "default",
      loading:
        createCompanyMutation.isPending || updateCompanyMutation.isPending,
    },
  ];

  function handleAddCompany() {
    setEditingCompany(undefined);
    setIsPopupOpen(true);
  }

  function handleEdit(company: Company) {
    setEditingCompany(company);
    setIsPopupOpen(true);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
    setEditingCompany(undefined);
  }

  function handleSaveCompany() {
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  }

  // Helper function to ensure numeric fields are properly converted
  const transformFormData = (formData: CompanyFormData): CompanyFormData => ({
    ...formData,
    annualRevenue:
      typeof formData.annualRevenue === "string"
        ? parseFloat(formData.annualRevenue) || 0
        : formData.annualRevenue,
    employeeCount:
      typeof formData.employeeCount === "string"
        ? parseInt(formData.employeeCount) || 0
        : formData.employeeCount,
  });

  async function handleFormSubmit(formData: CompanyFormData) {
    try {
      // Transform data to ensure proper types
      const transformedData = transformFormData(formData);

      if (editingCompany) {
        await updateCompanyMutation.mutateAsync({
          id: editingCompany.id,
          data: transformedData,
        });
        showSuccess(
          t("companyUpdatedSuccess"),
          `${formData.name} ${t("companyUpdated")}`
        );
      } else {
        await createCompanyMutation.mutateAsync(transformedData);
        showSuccess(
          t("companyCreatedSuccess"),
          `${formData.name} ${t("companyAddedToSystem")}`
        );
      }

      handleClosePopup();
    } catch (err) {
      console.error("Error saving company:", err);
      showError(
        editingCompany
          ? t("failedToUpdateCompany")
          : t("failedToCreateCompany"),
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }

  function handleDeleteConfirmation(company: Company) {
    setConfirmationDialog({
      isOpen: true,
      company,
    });
  }

  function handleCloseConfirmation() {
    setConfirmationDialog({
      isOpen: false,
      company: undefined,
    });
  }

  async function handleConfirmDelete() {
    if (!confirmationDialog.company) return;

    const companyName = confirmationDialog.company.name;

    try {
      await deleteCompanyMutation.mutateAsync(confirmationDialog.company.id);
      showSuccess(
        t("companyDeletedSuccess"),
        `${companyName} ${t("companyRemovedFromSystem")}`
      );

      handleCloseConfirmation();
    } catch (err) {
      console.error("Error deleting company:", err);
      showError(
        t("failedToDeleteCompany"),
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }

  const getConfirmationContent = () => {
    if (!confirmationDialog.company) return { title: "", message: "" };

    const companyName = confirmationDialog.company.name;

    return {
      title: t("deleteCompany"),
      message: t("deleteCompanyConfirm", { name: companyName }),
    };
  };

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <DataTable<Company>
        title={t("title")}
        description={t("description")}
        headerActions={headerActions}
        cardTitle={t("allCompanies")}
        data={companies}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={t("noCompaniesFound")}
        emptyDescription={t("noCompaniesDescription")}
        pagination={pagination}
        onPageChange={setPage}
      />

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={editingCompany ? t("editCompany") : t("addNewCompany")}
        actions={popupActions}
        size="lg"
      >
        <CompanyForm initialData={editingCompany} onSubmit={handleFormSubmit} />
      </Popup>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={handleConfirmDelete}
        confirmLabel={t("deleteCompany")}
        cancelLabel={commonT("cancel")}
        variant="destructive"
        isLoading={deleteCompanyMutation.isPending}
      />
    </>
  );
}
