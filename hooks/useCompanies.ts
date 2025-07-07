import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '@/services/companies';
import type { CompaniesQueryParams, CompanyUpdateData, CompanyCreateData } from '@/types/company';
import type { BirSearchRequest } from '@/services/companies/api';

// Query keys for React Query
export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (params: CompaniesQueryParams) => [...companyKeys.lists(), params] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: number) => [...companyKeys.details(), id] as const,
  birSearch: () => [...companyKeys.all, 'bir-search'] as const,
};

// Hook to fetch companies with pagination and filters
export function useCompanies(params: CompaniesQueryParams = {}) {
  return useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => companiesService.getCompanies(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to fetch a single company
export function useCompany(id: number) {
  return useQuery({
    queryKey: companyKeys.detail(id),
    queryFn: () => companiesService.getCompany(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to create a new company
export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyCreateData) => companiesService.createCompany(data),
    onSuccess: () => {
      // Invalidate and refetch companies queries to show the new company
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating company:', error);
    },
  });
}

// Hook to update a company
export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompanyUpdateData }) => 
      companiesService.updateCompany(id, data),
    onSuccess: (updatedCompany) => {
      // Update the company in the cache
      queryClient.setQueryData(
        companyKeys.detail(updatedCompany.id),
        updatedCompany
      );
      // Invalidate companies list to refetch
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating company:', error);
    },
  });
}

// Hook to delete a company
export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: number) => companiesService.deleteCompany(companyId),
    onSuccess: () => {
      // Invalidate and refetch companies queries
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting company:', error);
    },
  });
}

// Hook to search company data from BIR registry
export function useBirSearch() {
  return useMutation({
    mutationFn: (data: BirSearchRequest) => companiesService.searchCompanyInBir(data),
    onError: (error) => {
      console.error('Error searching company in BIR:', error);
    },
  });
}
