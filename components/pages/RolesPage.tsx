"use client";

import { useState } from "react";
import { DataTable, TableColumn, TableAction, PageHeaderAction } from "../molecules/Table";
import { Popup, PopupAction } from "../molecules/Popup";
import { ConfirmationDialog } from "../molecules/ConfirmationDialog";
import { RoleForm, RoleFormData } from "../organisms/RoleForm";
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/useRoles";
import { useNotification } from "@/hooks/useNotification";
import type { Role } from "@/services/roles";

export function RolesPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    role: Role | null;
  }>({
    isOpen: false,
    role: null,
  });
  
  const { 
    data: roles = [], 
    isLoading, 
    error, 
    refetch 
  } = useRoles();
  
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const { showSuccess, showError } = useNotification();

  const columns: TableColumn<Role>[] = [
    {
      key: 'name',
      header: 'Role Name',
      className: 'font-medium'
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => (
        <span className="text-gray-600 max-w-md truncate block">
          {value as string}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => new Date(value as string).toLocaleDateString()
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      render: (value) => new Date(value as string).toLocaleDateString()
    }
  ];

  const actions: TableAction<Role>[] = [
    {
      label: 'Edit',
      onClick: handleEdit,
      variant: 'outline'
    },
    {
      label: 'Delete',
      onClick: (role) => handleDeleteConfirmation(role),
      variant: 'destructive'
    }
  ];

  const headerActions: PageHeaderAction[] = [
    {
      label: 'Add Role',
      onClick: handleAddRole,
      variant: 'default'
    }
  ];

  const popupActions: PopupAction[] = [
    {
      label: 'Cancel',
      onClick: handleClosePopup,
      variant: 'outline'
    },
    {
      label: editingRole ? 'Update Role' : 'Create Role',
      onClick: handleSaveRole,
      variant: 'default',
      loading: createRoleMutation.isPending || updateRoleMutation.isPending
    }
  ];

  function handleAddRole() {
    setEditingRole(null);
    setIsPopupOpen(true);
  }

  function handleEdit(role: Role) {
    setEditingRole(role);
    setIsPopupOpen(true);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
    setEditingRole(null);
  }

  function handleSaveRole() {
    const form = document.querySelector('form');
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
          }
        });
        showSuccess(
          'Role Updated Successfully',
          `${formData.name} has been updated.`
        );
      } else {
        await createRoleMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
        });
        showSuccess(
          'Role Created Successfully',
          `${formData.name} has been added to the system.`
        );
      }
      
      handleClosePopup();
    } catch (err) {
      console.error('Error saving role:', err);
      showError(
        editingRole ? 'Failed to Update Role' : 'Failed to Create Role',
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
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
      role: null,
    });
  }

  async function handleConfirmDelete() {
    if (!confirmationDialog.role) return;

    const roleName = confirmationDialog.role.name;

    try {
      await deleteRoleMutation.mutateAsync(confirmationDialog.role.id);
      showSuccess(
        'Role Deleted Successfully',
        `${roleName} has been removed from the system.`
      );
      
      handleCloseConfirmation();
    } catch (err) {
      console.error('Error deleting role:', err);
      showError(
        'Failed to Delete Role',
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    }
  }

  const getConfirmationContent = () => {
    if (!confirmationDialog.role) return { title: '', message: '' };

    const roleName = confirmationDialog.role.name;
    
    return {
      title: 'Delete Role',
      message: `Are you sure you want to delete the "${roleName}" role? This action cannot be undone and may affect users assigned to this role.`,
    };
  };

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <DataTable<Role>
        title="Roles"
        description="Manage user roles and permissions"
        headerActions={headerActions}
        cardTitle="All Roles"
        data={roles}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage="No roles found"
        emptyDescription="There are no roles to display. Create your first role to get started."
      />

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
        actions={popupActions}
        size="md"
      >
        <RoleForm
          role={editingRole}
          onSubmit={handleFormSubmit}
          isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
        />
      </Popup>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={handleConfirmDelete}
        confirmLabel="Delete Role"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={deleteRoleMutation.isPending}
      />
    </>
  );
} 