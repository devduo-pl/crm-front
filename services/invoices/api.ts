import { fetchApiProxy as fetchApi, fetchApiProxyDelete as fetchApiDelete, buildQueryString } from "@/lib/api-client-proxy";
import type {
  Invoice,
  InvoiceCreateData,
  InvoiceUpdateData,
  InvoicesQueryParams,
  PaginatedInvoicesResponse,
  RecordPaymentData,
} from "./types";

export interface GenerateInvoiceNumberParams {
  prefix?: string;
  year?: number;
}

export interface GenerateInvoiceNumberResponse {
  invoiceNumber: string;
}

export const invoicesService = {
  /**
   * Get all invoices with filtering and pagination
   */
  getInvoices: async (
    params: InvoicesQueryParams = {}
  ): Promise<PaginatedInvoicesResponse> => {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    return fetchApi<PaginatedInvoicesResponse>(`/invoices${queryString}`);
  },

  /**
   * Get invoice by ID
   */
  getInvoice: async (id: string, include?: string): Promise<Invoice> => {
    const queryString = include ? `?include=${include}` : '';
    return fetchApi<Invoice>(`/invoices/${id}${queryString}`);
  },

  /**
   * Create a new invoice
   */
  createInvoice: async (data: InvoiceCreateData): Promise<Invoice> => {
    return fetchApi<Invoice>("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update invoice
   */
  updateInvoice: async (id: string, data: InvoiceUpdateData): Promise<Invoice> => {
    return fetchApi<Invoice>(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete invoice
   */
  deleteInvoice: async (id: string): Promise<void> => {
    return fetchApiDelete(`/invoices/${id}`);
  },

  /**
   * Record payment for an invoice
   */
  recordPayment: async (id: string, data: RecordPaymentData): Promise<Invoice> => {
    return fetchApi<Invoice>(`/invoices/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Generate next invoice number
   */
  generateInvoiceNumber: async (params: GenerateInvoiceNumberParams = {}): Promise<GenerateInvoiceNumberResponse> => {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    return fetchApi<GenerateInvoiceNumberResponse>(`/invoices/generate-number${queryString}`);
  },

  /**
   * Get invoices for a specific company
   */
  getCompanyInvoices: async (
    companyId: number,
    params: InvoicesQueryParams = {}
  ): Promise<PaginatedInvoicesResponse> => {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    return fetchApi<PaginatedInvoicesResponse>(`/companies/${companyId}/invoices${queryString}`);
  },

};

