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
import { useTableSorting } from "@/hooks/useTableSorting";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
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

  const { searchValue, setSearchValue, filteredData } = useGlobalSearch({
    data: companies,
    searchFields: ["name", "nip", "industry", "city", "status"],
  });

  const { sortState, sortedData: sortedCompanies, onSortChange } = useTableSorting<Company>({
    data: filteredData,
  });

  const columns: TableColumn<Company>[] = [
    {
      key: "name",
      header: t("companyName"),
      className: "font-medium",
      sortable: true,
    },
    {
      key: "nip",
      header: t("nip"),
      render: (value) => (value as string) || "—",
      sortable: true,
    },
    {
      key: "industry",
      header: t("industry"),
      render: (value) => (value as string) || "—",
      sortable: true,
    },
    {
      key: "status",
      header: tableT("status"),
      render: (value) => (
        <StatusBadge status={value as "active" | "inactive"} />
      ),
      sortable: true,
    },
    {
      key: "city",
      header: t("city"),
      render: (value) => (value as string) || "—",
      sortable: true,
    },
    {
      key: "employeeCount",
      header: t("employees"),
      render: (value) => (value ? (value as number).toString() : "—"),
      sortable: true,
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

    try {
      await deleteCompanyMutation.mutateAsync(confirmationDialog.company.id);
      showSuccess(t("companyDeletedSuccess"), `${confirmationDialog.company.name} ${t("companyRemovedFromSystem")}`);
      handleCloseConfirmation();
      refetch();
    } catch (error) {
      console.error("Failed to delete company:", error);
      showError(t("failedToDeleteCompany"), t("failedToDeleteCompany"));
    }
  }

  async function handleFormSubmit(formData: CompanyFormData) {
    try {
      if (editingCompany) {
        await updateCompanyMutation.mutateAsync({
          id: editingCompany.id,
          data: formData,
        });
        showSuccess(t("companyUpdatedSuccess"), `${editingCompany.name} ${t("companyUpdated")}`);
      } else {
        await createCompanyMutation.mutateAsync(formData);
        showSuccess(t("companyCreatedSuccess"), `${formData.name} ${t("companyAddedToSystem")}`);
      }
      handleClosePopup();
      refetch();
    } catch (error) {
      console.error("Failed to save company:", error);
      showError(
        editingCompany ? t("failedToUpdateCompany") : t("failedToCreateCompany"),
        editingCompany ? t("failedToUpdateCompany") : t("failedToCreateCompany")
      );
    }
  }

  const confirmationContent = {
    title: t("deleteCompany"),
    message: confirmationDialog.company 
      ? t("deleteCompanyConfirm", { name: confirmationDialog.company.name })
      : t("deleteCompanyConfirm", { name: "" }),
  };

  return (
    <>
      <DataTable<Company>
        title={t("title")}
        description={t("description")}
        headerActions={headerActions}
        cardTitle={t("allCompanies")}
        data={sortedCompanies}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={t("noCompaniesFound")}
        emptyDescription={t("noCompaniesDescription")}
        pagination={pagination}
        onPageChange={setPage}
        sortable={true}
        sortState={sortState}
        onSortChange={onSortChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={editingCompany ? t("editCompany") : t("addNewCompany")}
        actions={popupActions}
        size="lg"
      >
        <CompanyForm
          initialData={editingCompany}
          onSubmit={handleFormSubmit}
        />
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
