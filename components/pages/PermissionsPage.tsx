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
import {
  PermissionForm,
  PermissionFormData,
} from "@/components/organisms/PermissionForm";
import {
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from "@/hooks/usePermissions";
import { useNotification } from "@/hooks/useNotification";
import {
  usePermissionsTranslations,
  useTableTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";
import type { Permission } from "@/services/permissions";

export function PermissionsPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<
    Permission | undefined
  >(undefined);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    permission: Permission | undefined;
  }>({
    isOpen: false,
    permission: undefined,
  });

  const t = usePermissionsTranslations();
  const tableT = useTableTranslations();
  const commonT = useCommonTranslations();

  const {
    data: permissions = [],
    isLoading,
    error,
    refetch,
  } = usePermissions();

  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();
  const { showSuccess, showError } = useNotification();

  const columns: TableColumn<Permission>[] = [
    {
      key: "name",
      header: t("permissionKey"),
      className: "font-mono text-xs",
      render: (value) => (
        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-gray-800">
          {value as string}
        </span>
      ),
    },
    {
      key: "description",
      header: t("permissionDescription"),
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
  ];

  const actions: TableAction<Permission>[] = [
    {
      label: tableT("edit"),
      onClick: handleEdit,
      variant: "outline",
    },
    {
      label: tableT("delete"),
      onClick: (permission) => handleDeleteConfirmation(permission),
      variant: "destructive",
    },
  ];

  const headerActions: PageHeaderAction[] = [
    {
      label: t("addPermission"),
      onClick: handleAddPermission,
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
      label: editingPermission ? t("updatePermission") : t("createPermission"),
      onClick: handleSavePermission,
      variant: "default",
      loading:
        createPermissionMutation.isPending ||
        updatePermissionMutation.isPending,
    },
  ];

  function handleAddPermission() {
    setEditingPermission(undefined);
    setIsPopupOpen(true);
  }

  function handleEdit(permission: Permission) {
    setEditingPermission(permission);
    setIsPopupOpen(true);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
    setEditingPermission(undefined);
  }

  function handleSavePermission() {
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  }

  async function handleFormSubmit(formData: PermissionFormData) {
    try {
      if (editingPermission) {
        await updatePermissionMutation.mutateAsync({
          id: editingPermission.id,
          data: {
            name: formData.name,
            description: formData.description,
          },
        });
        showSuccess(
          t("permissionUpdatedSuccess"),
          `${formData.name} ${t("permissionUpdated")}`
        );
      } else {
        await createPermissionMutation.mutateAsync({
          name: formData.name, // Backend uses 'name' as the permission key
          description: formData.description,
        });
        showSuccess(
          t("permissionCreatedSuccess"),
          `${formData.name} ${t("permissionAddedToSystem")}`
        );
      }

      handleClosePopup();
    } catch (err) {
      console.error("Error saving permission:", err);
      showError(
        editingPermission
          ? t("failedToUpdatePermission")
          : t("failedToCreatePermission"),
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }

  function handleDeleteConfirmation(permission: Permission) {
    setConfirmationDialog({
      isOpen: true,
      permission,
    });
  }

  function handleCloseConfirmation() {
    setConfirmationDialog({
      isOpen: false,
      permission: undefined,
    });
  }

  async function handleConfirmDelete() {
    if (!confirmationDialog.permission) return;

    const permissionName = confirmationDialog.permission.name;

    try {
      await deletePermissionMutation.mutateAsync(
        confirmationDialog.permission.id
      );
      showSuccess(
        t("permissionDeletedSuccess"),
        `${permissionName} ${t("permissionRemovedFromSystem")}`
      );

      handleCloseConfirmation();
    } catch (err) {
      console.error("Error deleting permission:", err);
      showError(
        t("failedToDeletePermission"),
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }

  const getConfirmationContent = () => {
    if (!confirmationDialog.permission) return { title: "", message: "" };

    const permissionName = confirmationDialog.permission.name;

    return {
      title: t("deletePermission"),
      message: t("deletePermissionConfirm", { name: permissionName }),
    };
  };

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <DataTable<Permission>
        title={t("title")}
        description={t("description")}
        headerActions={headerActions}
        cardTitle={t("allPermissions")}
        data={permissions}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={t("noPermissionsFound")}
        emptyDescription={t("noPermissionsDescription")}
      />

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={
          editingPermission ? t("editPermission") : t("addNewPermission")
        }
        actions={popupActions}
        size="md"
      >
        <PermissionForm
          permission={editingPermission}
          onSubmit={handleFormSubmit}
          isLoading={
            createPermissionMutation.isPending ||
            updatePermissionMutation.isPending
          }
        />
      </Popup>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={handleConfirmDelete}
        confirmLabel={t("deletePermission")}
        cancelLabel={commonT("cancel")}
        variant="destructive"
        isLoading={deletePermissionMutation.isPending}
      />
    </>
  );
}

