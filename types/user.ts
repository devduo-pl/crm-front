export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

export interface UserCreateData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserUpdateData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roles?: string[];
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
