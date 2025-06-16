// Re-export user types from the main types file for convenience
export type {
  User,
  UserCreateData,
  UserUpdateData,
  UsersQueryParams,
  PaginatedResponse,
} from '@/types/user';

// Users service specific types (if any additional ones are needed)
export interface BanUserRequest {
  reason?: string;
}

export interface UnbanUserRequest {
  reason?: string;
} 