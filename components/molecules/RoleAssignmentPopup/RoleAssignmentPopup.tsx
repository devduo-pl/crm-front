import { useState } from "react";
import { Popup, PopupAction } from "@/components/molecules/Popup";
import { useRoles, useChangeUserRole } from "@/hooks/useRoles";
import { useNotification } from "@/hooks/useNotification";
import { useUsersTranslations, useCommonTranslations } from "@/hooks/useTranslations";
import type { User } from "@/types/user";
import { Select } from "@/components/ui/select";

interface RoleAssignmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess?: () => void;
}

export function RoleAssignmentPopup({
  isOpen,
  onClose,
  user,
  onSuccess,
}: RoleAssignmentPopupProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const tUsers = useUsersTranslations();
  const tCommon = useCommonTranslations();
  
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const changeUserRoleMutation = useChangeUserRole();
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async () => {
    if (!user || !selectedRoleId) return;

    try {
      await changeUserRoleMutation.mutateAsync({
        userId: user.id,
        roleId: parseInt(selectedRoleId),
      });
      
      const selectedRole = roles.find(role => role.id === parseInt(selectedRoleId));
      showSuccess(
        tUsers("roleAssignedSuccess"),
        `${user.firstName} ${user.lastName} ${tUsers("roleAssignedMessage")} ${selectedRole?.name}`
      );
      
      setSelectedRoleId("");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to assign role:", error);
      showError(tUsers("failedToAssignRole"), tUsers("failedToAssignRole"));
    }
  };

  const handleClose = () => {
    setSelectedRoleId("");
    onClose();
  };

  const actions: PopupAction[] = [
    {
      label: tCommon("cancel"),
      onClick: handleClose,
      variant: "outline",
    },
    {
      label: tUsers("assignRole"),
      onClick: handleSubmit,
      variant: "default",
      loading: changeUserRoleMutation.isPending,
      disabled: !selectedRoleId,
    },
  ];

  if (!user) return null;

  return (
    <Popup
      isOpen={isOpen}
      onClose={handleClose}
      title={`${tUsers("assignRoleTo")} ${user.firstName} ${user.lastName}`}
      actions={actions}
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {tUsers("assignRoleDescription")}
        </p>
        
        <div>
          <label htmlFor="role-select" className="block text-sm font-medium text-foreground mb-2">
            {tUsers("selectRole")}
          </label>
          <Select
            id="role-select"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            disabled={rolesLoading}
          >
            <option value="">{rolesLoading ? tUsers("loadingRoles") : tUsers("selectRoleOption")}</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id.toString()}>
                {role.name}
              </option>
            ))}
          </Select>
        </div>

        {user.roles && user.roles.length > 0 && (
          <div className="p-3 bg-muted/20 rounded-md">
            <p className="text-sm font-medium mb-2">{tUsers("currentRoles")}:</p>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {role}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {tUsers("roleReplaceWarning")}
            </p>
          </div>
        )}
      </div>
    </Popup>
  );
}
