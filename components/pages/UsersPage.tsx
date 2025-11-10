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
import { UserForm, UserFormData } from "@/components/organisms/UserForm";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import {
  useUsers,
  useBanUser,
  useUnbanUser,
  useCreateUser,
  useUpdateUser,
} from "@/hooks/useUsers";
import { useTableSorting } from "@/hooks/useTableSorting";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useNotification } from "@/hooks/useNotification";
import type { User } from "@/types/user";
import {
  useUsersTranslations,
  useTableTranslations,
  useCommonTranslations,
} from "@/hooks/useTranslations";

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    user: User | undefined;
    type: "ban" | "unban";
  }>({
    isOpen: false,
    user: undefined,
    type: "ban",
  });

  const tUsers = useUsersTranslations();
  const tTable = useTableTranslations();
  const tCommon = useCommonTranslations();

  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useUsers({ page, limit: 10 });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();
  const { showSuccess, showError } = useNotification();

  const users = usersResponse?.data || [];
  const pagination: PaginationInfo = {
    page: usersResponse?.page || 1,
    limit: usersResponse?.limit || 10,
    total: usersResponse?.total || 0,
    totalPages: usersResponse?.totalPages || 0,
  };

  const { searchValue, setSearchValue, filteredData } = useGlobalSearch({
    data: users,
    searchFields: ["firstName", "lastName", "email", "isActive"],
  });

  const { sortState, sortedData: sortedUsers, onSortChange } = useTableSorting<User>({
    data: filteredData,
  });

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: tUsers("name"),
      render: (_, row) => `${row.firstName} ${row.lastName}`,
      className: "font-medium",
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      sortable: true,
    },
    {
      key: "isActive",
      header: tUsers("status"),
      render: (value) => <StatusBadge status={value ? "active" : "inactive"} />,
      sortable: true,
    },
    {
      key: "roles",
      header: tUsers("role"),
      render: (value) => {
        const roles = value as string[];
        return roles && roles.length > 0
          ? roles.join(", ")
          : tUsers("noRoleAssigned");
      },
      sortable: false,
    },
    {
      key: "createdAt",
      header: tUsers("created"),
      render: (value) => new Date(value as string).toLocaleDateString(),
      sortable: true,
    },
  ];

  const actions: TableAction<User>[] = [
    {
      label: tTable("edit"),
      onClick: handleEdit,
      variant: "outline",
    },
    {
      label: tTable("ban"),
      onClick: (user) => handleBanConfirmation(user),
      variant: "destructive",
      condition: (user) => user.isActive,
    },
    {
      label: tTable("unban"),
      onClick: (user) => handleUnbanConfirmation(user),
      variant: "default",
      condition: (user) => !user.isActive,
    },
  ];

  const headerActions: PageHeaderAction[] = [
    {
      label: tUsers("addUser"),
      onClick: handleAddUser,
      variant: "default",
    },
  ];

  const popupActions: PopupAction[] = [
    {
      label: tCommon("cancel"),
      onClick: handleClosePopup,
      variant: "outline",
    },
    {
      label: editingUser ? tUsers("updateUser") : tUsers("createUser"),
      onClick: handleSaveUser,
      variant: "default",
      loading: createUserMutation.isPending || updateUserMutation.isPending,
    },
  ];

  function handleAddUser() {
    setEditingUser(undefined);
    setIsPopupOpen(true);
  }

  function handleEdit(user: User) {
    setEditingUser(user);
    setIsPopupOpen(true);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
    setEditingUser(undefined);
  }

  function handleSaveUser() {
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
  }

  function handleBanConfirmation(user: User) {
    setConfirmationDialog({
      isOpen: true,
      user,
      type: "ban",
    });
  }

  function handleUnbanConfirmation(user: User) {
    setConfirmationDialog({
      isOpen: true,
      user,
      type: "unban",
    });
  }

  function handleCloseConfirmation() {
    setConfirmationDialog({
      isOpen: false,
      user: undefined,
      type: "ban",
    });
  }

  async function handleConfirmAction() {
    if (!confirmationDialog.user) return;

    try {
      if (confirmationDialog.type === "ban") {
        await banUserMutation.mutateAsync(confirmationDialog.user.id);
        showSuccess(tUsers("userBannedSuccess"), `${confirmationDialog.user.firstName} ${confirmationDialog.user.lastName} ${tUsers("userBannedMessage")}`);
      } else {
        await unbanUserMutation.mutateAsync(confirmationDialog.user.id);
        showSuccess(tUsers("userUnbannedSuccess"), `${confirmationDialog.user.firstName} ${confirmationDialog.user.lastName} ${tUsers("userUnbannedMessage")}`);
      }
      handleCloseConfirmation();
      refetch();
    } catch (error) {
      console.error("Failed to update user status:", error);
      showError(
        confirmationDialog.type === "ban" ? tUsers("failedToBanUser") : tUsers("failedToUnbanUser"),
        confirmationDialog.type === "ban" ? tUsers("failedToBanUser") : tUsers("failedToUnbanUser")
      );
    }
  }

  async function handleFormSubmit(formData: UserFormData) {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          data: formData,
        });
        showSuccess(tUsers("userUpdatedSuccess"), `${editingUser.firstName} ${editingUser.lastName} ${tUsers("userUpdated")}`);
      } else {
        await createUserMutation.mutateAsync(formData);
        showSuccess(tUsers("userCreatedSuccess"), `${formData.firstName} ${formData.lastName} ${tUsers("userAddedToSystem")}`);
      }
      handleClosePopup();
      refetch();
    } catch (error) {
      console.error("Failed to save user:", error);
      showError(
        editingUser ? tUsers("failedToUpdateUser") : tUsers("failedToCreateUser"),
        editingUser ? tUsers("failedToUpdateUser") : tUsers("failedToCreateUser")
      );
    }
  }

  const getConfirmationContent = () => {
    if (!confirmationDialog.user) return { title: "", message: "" };

    const userName = `${confirmationDialog.user.firstName} ${confirmationDialog.user.lastName}`;

    if (confirmationDialog.type === "ban") {
      return {
        title: tUsers("banUser"),
        message: tUsers("banUserConfirm", { name: userName }),
      };
    } else {
      return {
        title: tUsers("unbanUser"),
        message: tUsers("unbanUserConfirm", { name: userName }),
      };
    }
  };

  const confirmationContent = getConfirmationContent();

  return (
    <>
      <DataTable<User>
        title={tUsers("title")}
        description={tUsers("description")}
        headerActions={headerActions}
        cardTitle={tUsers("allUsers")}
        data={sortedUsers}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        emptyMessage={tUsers("noUsersFound")}
        emptyDescription={tUsers("noUsersDescription")}
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
        title={editingUser ? tUsers("editUser") : tUsers("addNewUser")}
        actions={popupActions}
        size="md"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          isLoading={
            createUserMutation.isPending || updateUserMutation.isPending
          }
        />
      </Popup>

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={handleCloseConfirmation}
        title={confirmationContent.title}
        message={confirmationContent.message}
        onConfirm={handleConfirmAction}
        confirmLabel={
          confirmationDialog.type === "ban"
            ? tUsers("banUser")
            : tUsers("unbanUser")
        }
        cancelLabel={tCommon("cancel")}
        variant={confirmationDialog.type === "ban" ? "destructive" : "default"}
        isLoading={banUserMutation.isPending || unbanUserMutation.isPending}
      />
    </>
  );
}
