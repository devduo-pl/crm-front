import { fetchApi, fetchApiDelete, buildQueryString } from "@/lib/api-client";
import type {
  Company,
  CompanyCreateData,
  CompanyUpdateData,
  CompaniesQueryParams,
  PaginatedResponse,
} from "./types";

export interface BirSearchRequest {
  nip?: string;
  regon?: string;
  krs?: string;
}

export interface BirSearchResponse {
  success: boolean;
  message: string;
  data?: Company;
  error?: string;
}

export const companiesService = {
  /**
   * Get all companies with filtering and pagination
   */
  getCompanies: async (
    params: CompaniesQueryParams = {}
  ): Promise<PaginatedResponse<Company>> => {
    const queryString = buildQueryString(
      params as Record<string, string | number | boolean | undefined>
    );
    return fetchApi<PaginatedResponse<Company>>(`/companies${queryString}`);
  },

  /**
   * Get company by ID
   */
  getCompany: async (id: number): Promise<Company> => {
    return fetchApi<Company>(`/companies/${id}`);
  },

  /**
   * Create a new company
   */
  createCompany: async (data: CompanyCreateData): Promise<Company> => {
    return fetchApi<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update company
   */
  updateCompany: async (id: number, data: CompanyUpdateData): Promise<Company> => {
    return fetchApi<Company>(`/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete company
   */
  deleteCompany: async (id: number): Promise<void> => {
    return fetchApiDelete(`/companies/${id}`);
  },

  /**
   * Search company data from BIR registry
   */
  searchCompanyInBir: async (data: BirSearchRequest): Promise<BirSearchResponse> => {
    return fetchApi<BirSearchResponse>("/bir/search-company", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
