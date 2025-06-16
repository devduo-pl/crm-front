"use client";

import { useState } from "react";
import { DataTable, TableColumn, TableAction, PaginationInfo, PageHeaderAction } from "../molecules/Table";
import { Popup, PopupAction } from "../molecules/Popup";
import { ConfirmationDialog } from "../molecules/ConfirmationDialog";
import { UserForm, UserFormData } from "../organisms/UserForm";
import { StatusBadge } from "../atoms/StatusBadge";
import { useUsers, useBanUser, useUnbanUser, useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { useNotification } from "@/hooks/useNotification";
import type { User } from "@/types/user";

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    type: 'ban' | 'unban';
    user: User | null;
  }>({
    isOpen: false,
    type: 'ban',
    user: null,
  });
  
  const { 
    data: usersResponse, 
    isLoading, 
    error, 
    refetch 
  } = useUsers({ page, limit: 10 });
  
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const { showSuccess, showError } = useNotification();

  const users = usersResponse?.data || [];
  const pagination: PaginationInfo = {
    page: usersResponse?.page || 1,
    limit: usersResponse?.limit || 10,
    total: usersResponse?.total || 0,
    totalPages: usersResponse?.totalPages || 0
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (_, row) => `${row.firstName} ${row.lastName}`,
      className: 'font-medium'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} />
      )
    },
    {
      key: 'roleId',
      header: 'Role ID'
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => new Date(value as string).toLocaleDateString()
    }
  ];

  const actions: TableAction<User>[] = [
    {
      label: 'Edit',
      onClick: handleEdit,
      variant: 'outline'
    },
    {
      label: 'Ban',
      onClick: (user) => handleBanConfirmation(user),
      variant: 'destructive',
      condition: (user) => user.isActive
    },
    {
      label: 'Unban',
      onClick: (user) => handleUnbanConfirmation(user),
      variant: 'default',
      condition: (user) => !user.isActive
    }
  ];

  const headerActions: PageHeaderAction[] = [
    {
      label: 'Add User',
      onClick: handleAddUser,
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
      label: editingUser ? 'Update User' : 'Create User',
      onClick: handleSaveUser,
      variant: 'default',
      loading: createUserMutation.isPending || updateUserMutation.isPending
    }
  ];

  function handleAddUser() {
    setEditingUser(null);
    setIsPopupOpen(true);
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setIsPopupOpen(true);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
    setEditingUser(null);
  }

  function handleSaveUser() {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  }

  async function handleFormSubmit(formData: UserFormData) {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          }
        });
        showSuccess(
          'User Updated Successfully',
          `${formData.firstName} ${formData.lastName} has been updated.`
        );
      } else {
        await createUserMutation.mutateAsync({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        });
        showSuccess(
          'User Created Successfully',
          `${formData.firstName} ${formData.lastName} has been added to the system.`
        );
      }
      
      handleClosePopup();
    } catch (err) {
      console.error('Error saving user:', err);
      showError(
        editingUser ? 'Failed to Update User' : 'Failed to Create User',
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    }
  }

  function handleBanConfirmation(user: User) {
    setConfirmationDialog({
      isOpen: true,
      type: 'ban',
      user,
    });
  }

  function handleUnbanConfirmation(user: User) {
    setConfirmationDialog({
      isOpen: true,
      type: 'unban',
      user,
    });
  }

  function handleCloseConfirmation() {
    setConfirmationDialog({
      isOpen: false,
      type: 'ban',
      user: null,
    });
  }

  async function handleConfirmAction() {
    if (!confirmationDialog.user) return;

    const userName = `${confirmationDialog.user.firstName} ${confirmationDialog.user.lastName}`;

    try {
      if (confirmationDialog.type === 'ban') {
        await banUserMutation.mutateAsync(confirmationDialog.user.id);
        showSuccess(
          'User Banned Successfully',
          `${userName} has been banned and can no longer access the system.`
        );
      } else {
        await unbanUserMutation.mutateAsync(confirmationDialog.user.id);
        showSuccess(
          'User Unbanned Successfully',
          `${userName} has been unbanned and can now access the system.`
        );
      }
      
      handleCloseConfirmation();
    } catch (err) {
      console.error(`Error ${confirmationDialog.type}ning user:`, err);
      showError(
        `Failed to ${confirmationDialog.type === 'ban' ? 'Ban' : 'Unban'} User`,
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    }
  }

  const getConfirmationContent = () => {
    if (!confirmationDialog.user) return { title: '', message: '' };

    const userName = `${confirmationDialog.user.firstName} ${confirmationDialog.user.lastName}`;
    
    if (confirmationDialog.type === 'ban') {
      return {
        title: 'Ban User',
        message: `Are you sure you want to ban ${userName}? This will prevent them from accessing the system.`,
      };
    } else {
      return {
        title: 'Unban User',
        message: `Are you sure you want to unban ${userName}? This will restore their access to the system.`,
      };
    }
  };

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <DataTable<User>
        title="Users"
        description="Manage your team members and user accounts"
        headerActions={headerActions}
        cardTitle="All Users"
        data={users}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage="No users found"
        emptyDescription="There are no users to display."
        pagination={pagination}
        onPageChange={setPage}
      />

      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={editingUser ? 'Edit User' : 'Add New User'}
        actions={popupActions}
        size="md"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          isLoading={createUserMutation.isPending || updateUserMutation.isPending}
        />
      </Popup>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={handleConfirmAction}
        confirmLabel={confirmationDialog.type === 'ban' ? 'Ban User' : 'Unban User'}
        cancelLabel="Cancel"
        variant={confirmationDialog.type === 'ban' ? 'destructive' : 'default'}
        isLoading={banUserMutation.isPending || unbanUserMutation.isPending}
      />
    </>
  );
} 