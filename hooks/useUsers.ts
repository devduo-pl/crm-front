import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/users';
import type { UsersQueryParams, UserUpdateData, UserCreateData } from '@/types/user';

// Query keys for React Query
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UsersQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Hook to fetch users with pagination and filters
export function useUsers(params: UsersQueryParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersService.getUsers(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to fetch a single user
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersService.getUser(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreateData) => usersService.createUser(data),
    onSuccess: () => {
      // Invalidate and refetch users queries to show the new user
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });
}

// Hook to ban a user
export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => usersService.banUser(userId),
    onSuccess: () => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Error banning user:', error);
    },
  });
}

// Hook to unban a user
export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => usersService.unbanUser(userId),
    onSuccess: () => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Error unbanning user:', error);
    },
  });
}

// Hook to update a user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateData }) => 
      usersService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update the user in the cache
      queryClient.setQueryData(
        userKeys.detail(updatedUser.id),
        updatedUser
      );
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    },
  });
} 