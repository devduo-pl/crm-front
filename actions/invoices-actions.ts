"use server";

import { revalidatePath } from "next/cache";
import { fetchApiServer, buildQueryString } from "@/lib/api-server";
import type {
  Invoice,
  InvoiceCreateData,
  InvoiceUpdateData,
  InvoicesQueryParams,
  RecordPaymentData,
  PaginatedInvoicesResponse,
} from "@/types/invoice";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.length > 0) {
    return error;
  }

  return fallback;
};

/**
 * Get all invoices with filtering and pagination
 * Use in Server Components for initial data
 */
export async function getInvoicesAction(params: InvoicesQueryParams = {}) {
  try {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    const data = await fetchApiServer<PaginatedInvoicesResponse>(
      `/invoices${queryString}`
    );
    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch invoices"),
      data: null,
    };
  }
}

/**
 * Get invoice by ID
 */
export async function getInvoiceAction(id: string, include?: string) {
  try {
    const queryString = include ? `?include=${include}` : '';
    const data = await fetchApiServer<Invoice>(`/invoices/${id}${queryString}`);
    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch invoice"),
      data: null,
    };
  }
}

/**
 * Create a new invoice
 */
export async function createInvoiceAction(invoiceData: InvoiceCreateData) {
  try {
    const data = await fetchApiServer<Invoice>("/invoices", {
      method: "POST",
      body: JSON.stringify(invoiceData),
    });

    // Revalidate the invoices page to show the new invoice
    revalidatePath("/[locale]/(dashboard)/invoices");

    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to create invoice"),
      data: null,
    };
  }
}

/**
 * Update invoice
 */
export async function updateInvoiceAction(id: string, invoiceData: InvoiceUpdateData) {
  try {
    const data = await fetchApiServer<Invoice>(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoiceData),
    });

    // Revalidate the invoices page and the invoice detail page
    revalidatePath("/[locale]/(dashboard)/invoices");
    revalidatePath(`/[locale]/(dashboard)/invoices/${id}`);

    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update invoice"),
      data: null,
    };
  }
}

/**
 * Delete invoice
 */
export async function deleteInvoiceAction(id: string) {
  try {
    await fetchApiServer<void>(`/invoices/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/[locale]/(dashboard)/invoices");

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete invoice"),
    };
  }
}

/**
 * Record payment for an invoice
 */
export async function recordPaymentAction(id: string, paymentData: RecordPaymentData) {
  try {
    const data = await fetchApiServer<Invoice>(`/invoices/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(paymentData),
    });

    // Revalidate the invoices page and the invoice detail page
    revalidatePath("/[locale]/(dashboard)/invoices");
    revalidatePath(`/[locale]/(dashboard)/invoices/${id}`);

    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to record payment"),
      data: null,
    };
  }
}

/**
 * Generate invoice number
 */
export async function generateInvoiceNumberAction(prefix?: string, year?: number) {
  try {
    const params: Record<string, string | number> = {};
    if (prefix) params.prefix = prefix;
    if (year) params.year = year;
    
    const queryString = buildQueryString(params);
    const data = await fetchApiServer<{ invoiceNumber: string }>(
      `/invoices/generate-number${queryString}`
    );

    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to generate invoice number"),
      data: null,
    };
  }
}

/**
 * Get invoices for a specific company
 */
export async function getCompanyInvoicesAction(
  companyId: number,
  params: InvoicesQueryParams = {}
) {
  try {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    const data = await fetchApiServer<PaginatedInvoicesResponse>(
      `/companies/${companyId}/invoices${queryString}`
    );
    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch company invoices"),
      data: null,
    };
  }
}

