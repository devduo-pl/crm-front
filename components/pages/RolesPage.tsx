"use client";

import { useState } from "react";
import {
  DataTable,
  TableColumn,
  TableAction,
  PageHeaderAction,
} from "@/components/molecules/Table";
import { Popup, PopupAction } from "@/components/molecules/Popup";
import { ConfirmationDialog } from "@/components/molecules/ConfirmationDialog";
import { RoleForm, RoleFormData } from "@/components/organisms/RoleForm";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/useRoles";
import { useNotification } from "@/hooks/useNotification";
import {
  useRolesTranslations,
  useTableTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";
import type { Role } from "@/services/roles";

export function RolesPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    role: Role | undefined;
  }>({
    isOpen: false,
    role: undefined,
  });

  const t = useRolesTranslations();
  const tableT = useTableTranslations();
  const commonT = useCommonTranslations();

  const { data: roles = [], isLoading, error, refetch } = useRoles();

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const { showSuccess, showError } = useNotification();

  const columns: TableColumn<Role>[] = [
    {
      key: "name",
      header: t("roleName"),
      className: "font-medium",
    },
    {
      key: "description",
      header: t("descriptionColumn"),
      render: (value) => (
        <span className="text-gray-600 max-w-md truncate block">
          {value as string}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: tableT("created"),
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      header: t("lastUpdated"),
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
  ];

  const actions: TableAction<Role>[] = [
    {
      label: tableT("edit"),
      onClick: handleEdit,
      variant: "outline",
    },
    {
      label: tableT("delete"),
      onClick: (role) => handleDeleteConfirmation(role),
      variant: "destructive",
    },
  ];

  const headerActions: PageHeaderAction[] = [
    {
      label: t("addRole"),
      onClick: handleAddRole,
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
      label: editingRole ? t("updateRole") : t("createRole"),
      onClick: handleSaveRole,
      variant: "default",
      loading: createRoleMutation.isPending || updateRoleMutation.isPending,
    },
  ];

  function handleAddRole() {
    setEditingRole(undefined);
    setIsPopupOpen(true);
  }

  function handleEdit(role: Role) {
    setEditingRole(role);
    setIsPopupOpen(true);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
    setEditingRole(undefined);
  }

  function handleSaveRole() {
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  }

  async function handleFormSubmit(formData: RoleFormData) {
    try {
      if (editingRole) {
        await updateRoleMutation.mutateAsync({
          id: editingRole.id,
          data: {
            name: formData.name,
            description: formData.description,
          },
        });
        showSuccess(
          t("roleUpdatedSuccess"),
          `${formData.name} ${t("roleUpdated")}`
        );
      } else {
        await createRoleMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
        });
        showSuccess(
          t("roleCreatedSuccess"),
          `${formData.name} ${t("roleAddedToSystem")}`
        );
      }

      handleClosePopup();
    } catch (err) {
      console.error("Error saving role:", err);
      showError(
        editingRole ? t("failedToUpdateRole") : t("failedToCreateRole"),
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }

  function handleDeleteConfirmation(role: Role) {
    setConfirmationDialog({
      isOpen: true,
      role,
    });
  }

  function handleCloseConfirmation() {
    setConfirmationDialog({
      isOpen: false,
      role: undefined,
    });
  }

  async function handleConfirmDelete() {
    if (!confirmationDialog.role) return;

    const roleName = confirmationDialog.role.name;

    try {
      await deleteRoleMutation.mutateAsync(confirmationDialog.role.id);
      showSuccess(
        t("roleDeletedSuccess"),
        `${roleName} ${t("roleRemovedFromSystem")}`
      );

      handleCloseConfirmation();
    } catch (err) {
      console.error("Error deleting role:", err);
      showError(
        t("failedToDeleteRole"),
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }

  const getConfirmationContent = () => {
    if (!confirmationDialog.role) return { title: "", message: "" };

    const roleName = confirmationDialog.role.name;

    return {
      title: t("deleteRole"),
      message: t("deleteRoleConfirm", { name: roleName }),
    };
  };

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <DataTable<Role>
        title={t("title")}
        description={t("description")}
        headerActions={headerActions}
        cardTitle={t("allRoles")}
        data={roles}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={t("noRolesFound")}
        emptyDescription={t("noRolesDescription")}
      />

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={editingRole ? t("editRole") : t("addNewRole")}
        actions={popupActions}
        size="md"
      >
        <RoleForm
          role={editingRole}
          onSubmit={handleFormSubmit}
          isLoading={
            createRoleMutation.isPending || updateRoleMutation.isPending
          }
        />
      </Popup>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={handleConfirmDelete}
        confirmLabel={t("deleteRole")}
        cancelLabel={commonT("cancel")}
        variant="destructive"
        isLoading={deleteRoleMutation.isPending}
      />
    </>
  );
}
