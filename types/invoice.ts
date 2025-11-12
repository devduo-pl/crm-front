export type InvoiceType = "VAT" | "PROFORMA" | "CORRECTION" | "RECEIPT";
export type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
export type PaymentMethod = "TRANSFER" | "CASH" | "CARD" | "OTHER";

export interface InvoiceItem {
  id: string;
  description: string;
  pkwiuCode?: string;
  quantity: number;
  unit: string;
  unitNetPrice: number;
  vatRate: number;
  vatExemptionReason?: string;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

export interface InvoicePayment {
  id: string;
  paymentDate: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  transactionReference?: string;
  notes?: string;
}

export interface InvoiceTaxSummary {
  id: string;
  vatRate: number;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

export interface CompanySnapshot {
  id: number;
  name: string;
  nip?: string;
  regon?: string;
  krs?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  issueDate: string;
  saleDate: string;
  dueDate: string;
  currency: string;
  exchangeRate?: number;
  exchangeRateDate?: string;
  sellerId: number;
  buyerId: number;
  sellerSnapshot?: CompanySnapshot;
  buyerSnapshot?: CompanySnapshot;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalNet: number;
  totalVat: number;
  totalGross: number;
  totalNetPln?: number;
  totalVatPln?: number;
  totalGrossPln?: number;
  notes?: string;
  correctionInvoiceId?: string;
  metadata?: Record<string, unknown>;
  items?: InvoiceItem[];
  payments?: InvoicePayment[];
  taxSummaries?: InvoiceTaxSummary[];
  itemsCount?: number;
  totalPaid?: number;
  remainingAmount?: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface InvoicesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: InvoiceType;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  sellerId?: number;
  buyerId?: number;
  currency?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  minTotalGross?: number;
  maxTotalGross?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  include?: string;
}

export interface InvoiceItemInput {
  description: string;
  pkwiuCode?: string;
  quantity: number;
  unit: string;
  unitNetPrice: number;
  vatRate: number;
  vatExemptionReason?: string;
}

export interface InvoiceCreateData {
  invoiceNumber: string;
  type: InvoiceType;
  issueDate: string;
  saleDate: string;
  dueDate: string;
  currency: string;
  exchangeRate?: number;
  exchangeRateDate?: string;
  sellerId: number;
  buyerId: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  correctionInvoiceId?: string;
  metadata?: Record<string, unknown>;
  items: InvoiceItemInput[];
}

export interface InvoiceUpdateData extends Partial<InvoiceCreateData> {
  paymentStatus?: PaymentStatus;
}

export interface RecordPaymentData {
  paymentDate: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  transactionReference?: string;
  notes?: string;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  type: InvoiceType;
  issueDate: string;
  saleDate: string;
  dueDate: string;
  currency: string;
  exchangeRate: number;
  exchangeRateDate: string;
  sellerId: number;
  buyerId: number;
  paymentMethod: PaymentMethod;
  notes: string;
  items: InvoiceItemInput[];
}

export interface PaginatedInvoicesResponse {
  data: Invoice[];
  meta: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  summary?: {
    totalNet: number;
    totalVat: number;
    totalGross: number;
  };
}

