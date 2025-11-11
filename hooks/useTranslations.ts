"use client";

import { useTranslations as useNextIntlTranslations } from "next-intl";

// Type-safe translation keys
export type TranslationKeys = {
  common:
    | "loading"
    | "error"
    | "success"
    | "cancel"
    | "save"
    | "edit"
    | "delete"
    | "confirm"
    | "back"
    | "next"
    | "previous"
    | "search"
    | "filter"
    | "reset"
    | "close"
    | "or";
  auth:
    | "login"
    | "logout"
    | "register"
    | "signIn"
    | "signInButton"
    | "signingIn"
    | "welcomeBack"
    | "signInSubtitle"
    | "forgotPassword"
    | "forgotPasswordQuestion"
    | "forgotPasswordSubtitle"
    | "resetPassword"
    | "resetPasswordSubtitle"
    | "verifyAccount"
    | "accountVerifiedSuccessfully"
    | "invalidResetLink"
    | "invalidResetToken"
    | "loginFailed"
    | "email"
    | "emailAddress"
    | "password"
    | "newPassword"
    | "confirmPassword"
    | "enterEmail"
    | "enterPassword"
    | "enterNewPassword"
    | "enterEmailAddress"
    | "rememberMe"
    | "sendResetEmail"
    | "sendingEmail"
    | "emailSentSuccessfully"
    | "checkEmailForInstructions"
    | "failedToSendResetEmail"
    | "backToSignIn"
    | "resetYourPassword"
    | "confirmNewPassword"
    | "confirmYourNewPassword"
    | "resettingPassword"
    | "passwordResetSuccessfully"
    | "passwordHasBeenReset"
    | "failedToResetPassword"
    | "passwordMustBe8Characters";
  navigation:
    | "dashboard"
    | "users"
    | "companies"
    | "roles"
    | "settings"
    | "main"
    | "signOut"
    | "signingOut"
    | "signedOut"
    | "signOutSuccess"
    | "signOutFailed"
    | "signOutError";
  forms:
    | "required"
    | "invalidEmail"
    | "passwordTooShort"
    | "passwordsDoNotMatch"
    | "user.firstName"
    | "user.lastName"
    | "user.email"
    | "user.enterFirstName"
    | "user.enterLastName"
    | "user.enterEmailAddress"
    | "user.firstNameRequired"
    | "user.lastNameRequired"
    | "user.emailRequired"
    | "user.validEmailRequired"
    | "company.basicInformation"
    | "company.contactInformation"
    | "company.addressInformation"
    | "company.financialInformation"
    | "company.tags"
    | "company.companyName"
    | "company.enterCompanyName"
    | "company.companyNameRequired"
    | "company.nip"
    | "company.regon"
    | "company.krs"
    | "company.legalForm"
    | "company.status"
    | "company.active"
    | "company.inactive"
    | "company.industry"
    | "company.companySize"
    | "company.description"
    | "company.phone"
    | "company.email"
    | "company.province"
    | "company.county"
    | "company.municipality"
    | "company.city"
    | "company.postalCode"
    | "company.street"
    | "company.buildingNumber"
    | "company.apartmentNumber"
    | "company.fullAddress"
    | "company.annualRevenue"
    | "company.employeeCount"
    | "company.tagsCommaSeparated"
    | "company.search"
    | "company.searching"
    | "company.validEmailRequired"
    | "company.validPhoneRequired"
    | "company.validRevenueRequired"
    | "company.validEmployeeCountRequired"
    | "company.searchError"
    | "company.enterNumberFirst"
    | "company.dataRetrieved"
    | "company.dataRetrievedSuccess"
    | "company.companyNotFound"
    | "company.noCompanyFound"
    | "company.searchFailed"
    | "company.searchFailedMessage"
    | "role.roleName"
    | "role.description"
    | "role.enterRoleName"
    | "role.enterDescription"
    | "role.roleNameRequired"
    | "role.roleNameMinLength"
    | "role.descriptionRequired"
    | "role.descriptionMinLength";
  table:
    | "noData"
    | "rowsPerPage"
    | "page"
    | "of"
    | "edit"
    | "delete"
    | "ban"
    | "unban"
    | "actions"
    | "noResults"
    | "emptyState"
    | "noItemsToDisplay"
    | "showingAll"
    | "showingPage"
    | "previous"
    | "next"
    | "noDataFound"
    | "created"
    | "status";
  dashboard:
    | "accountInformation"
    | "accountDetails"
    | "userId"
    | "firstName"
    | "lastName"
    | "noUserInfo"
    | "authenticationStatus"
    | "sessionStatus"
    | "accountType"
    | "active"
    | "successfullyAuthenticated"
    | "valid"
    | "tokenIsActive"
    | "admin"
    | "user"
    | "standardAccess";
  users:
    | "title"
    | "description"
    | "allUsers"
    | "addUser"
    | "editUser"
    | "addNewUser"
    | "updateUser"
    | "createUser"
    | "banUser"
    | "unbanUser"
    | "name"
    | "status"
    | "role"
    | "created"
    | "noRoleAssigned"
    | "userCreatedSuccess"
    | "userUpdatedSuccess"
    | "userBannedSuccess"
    | "userUnbannedSuccess"
    | "failedToCreateUser"
    | "failedToUpdateUser"
    | "failedToBanUser"
    | "failedToUnbanUser"
    | "userAddedToSystem"
    | "userUpdated"
    | "userBannedMessage"
    | "userUnbannedMessage"
    | "banUserConfirm"
    | "unbanUserConfirm"
    | "noUsersFound"
    | "noUsersDescription";
  companies:
    | "title"
    | "description"
    | "allCompanies"
    | "addCompany"
    | "editCompany"
    | "addNewCompany"
    | "updateCompany"
    | "createCompany"
    | "deleteCompany"
    | "companyName"
    | "nip"
    | "industry"
    | "city"
    | "employees"
    | "companyCreatedSuccess"
    | "companyUpdatedSuccess"
    | "companyDeletedSuccess"
    | "failedToCreateCompany"
    | "failedToUpdateCompany"
    | "failedToDeleteCompany"
    | "companyAddedToSystem"
    | "companyUpdated"
    | "companyRemovedFromSystem"
    | "deleteCompanyConfirm"
    | "noCompaniesFound"
    | "noCompaniesDescription";
  roles:
    | "title"
    | "description"
    | "allRoles"
    | "addRole"
    | "editRole"
    | "addNewRole"
    | "updateRole"
    | "createRole"
    | "deleteRole"
    | "roleName"
    | "descriptionColumn"
    | "lastUpdated"
    | "roleCreatedSuccess"
    | "roleUpdatedSuccess"
    | "roleDeletedSuccess"
    | "failedToCreateRole"
    | "failedToUpdateRole"
    | "failedToDeleteRole"
    | "roleAddedToSystem"
    | "roleUpdated"
    | "roleRemovedFromSystem"
    | "deleteRoleConfirm"
    | "noRolesFound"
    | "noRolesDescription";
};

// Utility hooks for different translation namespaces
export function useCommonTranslations() {
  return useNextIntlTranslations("common");
}

export function useAuthTranslations() {
  return useNextIntlTranslations("auth");
}

export function useNavigationTranslations() {
  return useNextIntlTranslations("navigation");
}

export function useFormsTranslations() {
  return useNextIntlTranslations("forms");
}

export function useTableTranslations() {
  return useNextIntlTranslations("table");
}

export function useDashboardTranslations() {
  return useNextIntlTranslations("dashboard");
}

export function useUsersTranslations() {
  return useNextIntlTranslations("users");
}

export function useCompaniesTranslations() {
  return useNextIntlTranslations("companies");
}

export function useRolesTranslations() {
  return useNextIntlTranslations("roles");
}

export function usePermissionsTranslations() {
  return useNextIntlTranslations("permissions");
}

// General hook that can be used with any namespace
export function useTranslations(namespace?: keyof TranslationKeys) {
  return useNextIntlTranslations(namespace);
}
