import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authService } from "@/services/auth";
import type { User } from "@/types/user";

interface AppState {
  // Add your state properties here
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        isDarkMode: false,
        toggleDarkMode: () =>
          set((state) => ({ isDarkMode: !state.isDarkMode })),
      }),
      {
        name: "app-storage",
      }
    )
  )
);

// Auth store for managing authentication state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  verifyAccount: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        setUser: (user) => set({ user }),
        setLoading: (loading) => set({ isLoading: loading }),

        login: async (email: string, password: string, rememberMe: boolean) => {
          set({ isLoading: true });
          try {
            const response = await authService.login({
              email,
              password,
              rememberMe,
            });
            set({ user: response.user, isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await authService.logout();
            set({ user: null, isLoading: false });
          } catch {
            // Even if server logout fails, clear user state
            set({ user: null, isLoading: false });
          }
        },

        refreshToken: async () => {
          const success = await authService.refreshToken();
          if (success) {
            // Get updated user info
            const user = await authService.getCurrentUser();
            set({ user });
            return true;
          } else {
            set({ user: null });
            return false;
          }
        },

        checkAuth: async () => {
          try {
            const user = await authService.getCurrentUser();
            set({ user });
          } catch {
            set({ user: null });
          }
        },

        verifyAccount: async (token: string) => {
          try {
            await authService.verifyAccount(token);
            set({ isLoading: false });
          } catch {
            set({ isLoading: false });
            throw new Error("Account verification failed");
          }
        },

        forgotPassword: async (email: string) => {
          set({ isLoading: true });
          try {
            await authService.requestPasswordRecovery(email);
            set({ isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        resetPassword: async (token: string, password: string) => {
          set({ isLoading: true });
          try {
            await authService.resetPassword(token, password);
            set({ isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user }), // Only persist user data
      }
    )
  )
);
