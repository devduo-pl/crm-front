import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesService } from '@/services/invoices';
import type { 
  InvoicesQueryParams, 
  InvoiceUpdateData, 
  InvoiceCreateData,
  RecordPaymentData,
} from '@/types/invoice';
import type { GenerateInvoiceNumberParams } from '@/services/invoices/api';

// Query keys for React Query
export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (params: InvoicesQueryParams) => [...invoiceKeys.lists(), params] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string, include?: string) => [...invoiceKeys.details(), id, include] as const,
  generateNumber: (params: GenerateInvoiceNumberParams) => [...invoiceKeys.all, 'generate-number', params] as const,
  companyInvoices: (companyId: number, params: InvoicesQueryParams) => 
    [...invoiceKeys.all, 'company', companyId, params] as const,
};

// Hook to fetch invoices with pagination and filters
export function useInvoices(params: InvoicesQueryParams = {}) {
  return useQuery({
    queryKey: invoiceKeys.list(params),
    queryFn: () => invoicesService.getInvoices(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to fetch a single invoice
export function useInvoice(id: string, include?: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id, include),
    queryFn: () => invoicesService.getInvoice(id, include),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to create a new invoice
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvoiceCreateData) => invoicesService.createInvoice(data),
    onSuccess: () => {
      // Invalidate and refetch invoices queries to show the new invoice
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating invoice:', error);
    },
  });
}

// Hook to update an invoice
export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InvoiceUpdateData }) => 
      invoicesService.updateInvoice(id, data),
    onSuccess: (updatedInvoice) => {
      // Update the invoice in the cache
      queryClient.setQueryData(
        invoiceKeys.detail(updatedInvoice.id),
        updatedInvoice
      );
      // Invalidate invoices list to refetch
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
    onError: (error) => {
      console.error('Error updating invoice:', error);
    },
  });
}

// Hook to delete an invoice
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoiceId: string) => invoicesService.deleteInvoice(invoiceId),
    onSuccess: () => {
      // Invalidate and refetch invoices queries
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
    onError: (error) => {
      console.error('Error deleting invoice:', error);
    },
  });
}

// Hook to record payment for an invoice
export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordPaymentData }) => 
      invoicesService.recordPayment(id, data),
    onSuccess: (updatedInvoice) => {
      // Update the invoice in the cache
      queryClient.setQueryData(
        invoiceKeys.detail(updatedInvoice.id),
        updatedInvoice
      );
      // Invalidate invoices list to refetch
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
    },
    onError: (error) => {
      console.error('Error recording payment:', error);
    },
  });
}

// Hook to generate invoice number
export function useGenerateInvoiceNumber(params: GenerateInvoiceNumberParams = {}) {
  return useQuery({
    queryKey: invoiceKeys.generateNumber(params),
    queryFn: () => invoicesService.generateInvoiceNumber(params),
    staleTime: 0, // Always fetch fresh
    gcTime: 0, // Don't cache
  });
}

// Hook to fetch company invoices
export function useCompanyInvoices(companyId: number, params: InvoicesQueryParams = {}) {
  return useQuery({
    queryKey: invoiceKeys.companyInvoices(companyId, params),
    queryFn: () => invoicesService.getCompanyInvoices(companyId, params),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

