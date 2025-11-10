import type { User } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message?: string;
}

export interface RefreshTokenResponse {
  user: User;
  message?: string;
}

export interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface PasswordRecoveryRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
