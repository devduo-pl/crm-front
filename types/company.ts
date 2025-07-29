export interface Company {
  id: number;
  name: string;
  nip: string;
  regon: string;
  krs: string;
  legalForm: string;
  status: "active" | "inactive";
  industry: string;
  size: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  province: string;
  county: string;
  municipality: string;
  city: string;
  postalCode: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  fullAddress: string;
  primaryPkdCode: string;
  primaryPkdDescription: string;
  establishmentDate: string;
  startDate: string;
  entityType: string;
  silosId: string;
  annualRevenue: number;
  employeeCount: number;
  socialMediaLinks: Record<string, unknown>;
  additionalData: Record<string, unknown>;
  isFromBir: boolean;
  lastBirSync: string;
  createdAt: string;
  updatedAt: string;
  contacts: unknown[];
  notes: unknown[];
  tags: unknown[];
  customFields: unknown[];
  contactsCount: number;
  notesCount: number;
  tagsCount: number;
  [key: string]: unknown;
}

export interface CompaniesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
  industry?: string;
  size?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface CompanyCreateData {
  name: string;
  nip?: string;
  regon?: string;
  krs?: string;
  legalForm?: string;
  status?: "active" | "inactive";
  industry?: string;
  size?: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  province?: string;
  county?: string;
  municipality?: string;
  city?: string;
  postalCode?: string;
  street?: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  fullAddress?: string;
  annualRevenue?: number;
  employeeCount?: number;
  socialMediaLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  additionalData?: Record<string, unknown>;
  tags?: string[];
}

export interface CompanyUpdateData extends Partial<CompanyCreateData> {
  status?: "active" | "inactive";
}

export interface CompanyFormData {
  name: string;
  nip: string;
  regon: string;
  krs: string;
  legalForm: string;
  status: "active" | "inactive";
  industry: string;
  size: string;
  description: string;
  phone: string;
  email: string;
  province: string;
  county: string;
  municipality: string;
  city: string;
  postalCode: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  fullAddress: string;
  annualRevenue: number;
  employeeCount: number;
  tags: string[];
}
