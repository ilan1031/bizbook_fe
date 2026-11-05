// Typed client for the inventory API (bizbook_be/controllers/inventoryController.js).
// The server owns the rules (valuation, stock checks, journals); these types
// describe what it returns and what the forms send.
import apiService from "./axiosService";

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type ValuationMethod = "average" | "fifo" | "lifo";
// How a valuation method is named on screen.
export const valuationLabel = (m?: string) => (m === "lifo" ? "LIFO" : m === "fifo" ? "FIFO" : "Average cost");
export type SellPolicy = "warn" | "block";
export type SourceType = "opening" | "bill" | "invoice" | "credit_note" | "vendor_credit" | "adjustment";
export type AdjustmentMode = "quantity" | "value";

export interface StockRow {
  _id: string;
  item_id: string;
  name: string;
  sku: string;
  unit: string;
  stock_qty: number;
  reorder_level: number;
  avg_cost: number;
  stock_value: number;
  valuation_method: ValuationMethod;
  status: StockStatus;
  status_label: string;
}

export interface SummaryResponse {
  status: boolean;
  data: StockRow[];
  totals: { items: number; stock_value: number; low_stock: number };
  pagination: Pagination;
}

export interface ItemStock {
  _id: string;
  item_id: string;
  name: string;
  sku: string;
  unit: string;
  stock_qty: number;
  stock_value: number;
  avg_cost: number;
  reorder_level: number;
  valuation_method: ValuationMethod;
}

export interface LedgerRow {
  _id: string;
  date: string;
  source_type: SourceType;
  source_id: string;
  source_number: string;
  party_name: string;
  qty: number;
  rate: number;
  value: number;
  running_qty: number;
  running_value: number;
  unit_cost: number;
}

export interface LedgerResponse {
  status: boolean;
  item: ItemStock;
  data: LedgerRow[];
}

export interface ValuationRow {
  _id: string;
  item_id: string;
  name: string;
  sku: string;
  valuation_method: ValuationMethod;
  qty: number;
  avg_cost: number;
  value: number;
}

export interface ValuationResponse {
  status: boolean;
  as_of: string;
  data: ValuationRow[];
  totals: { items: number; value: number; value_formatted: string };
}

export interface LookupItem {
  _id: string;
  item_id: string;
  name: string;
  sku: string;
  unit: string;
  stock_qty: number;
  avg_cost: number;
}

export interface LookupAccount {
  account_id: string;
  account_name: string;
  account_type: string;
}

export interface LookupsResponse {
  status: boolean;
  items: LookupItem[];
  accounts: LookupAccount[];
}

export interface AdjustmentListRow {
  _id: string;
  adjustment_number: string;
  date: string;
  reason: string;
  reference_number: string;
  account_name: string;
  line_count: number;
  total_value: number;
}

export interface AdjustmentListResponse {
  status: boolean;
  data: AdjustmentListRow[];
  pagination: Pagination;
}

export interface AdjustmentLine {
  item_ref: string;
  item_id: string;
  item_name: string;
  mode: AdjustmentMode;
  qty_change: number;
  value_change: number;
  rate: number | null;
  value: number;
}

export interface JournalLine {
  coa_account_id: string;
  coa_account_name: string;
  creditOrDebit: "Debit" | "Credit";
  amount: number;
}

export interface AdjustmentDetail {
  _id: string;
  adjustment_number: string;
  date: string;
  reason: string;
  reference_number: string;
  notes: string;
  account_id: string;
  account_name: string;
  lines: AdjustmentLine[];
  total_value: number;
  journal_id: string;
  journal_lines: JournalLine[];
}

export interface AdjustmentDetailResponse {
  status: boolean;
  data: AdjustmentDetail;
}

export interface AdjustmentInputLine {
  item_id: string;
  mode: AdjustmentMode;
  qty_change?: number;
  value_change?: number;
  rate?: number | null;
}

export interface AdjustmentInput {
  date: string;
  reason: string;
  reference_number: string;
  notes: string;
  account_id: string;
  line_items: AdjustmentInputLine[];
}

export interface SettingsResponse {
  status: boolean;
  data: { sell_policy: SellPolicy };
}

export interface SummaryQuery {
  search?: string;
  filter?: "all" | "low" | "out";
  page?: number;
  limit?: number;
}

// The message the server sent with an error (or a fallback).
export const errorMessage = (e: unknown, fallback = "Something went wrong"): string => {
  if (e && typeof e === "object" && "message" in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return fallback;
};

export const currentOrgId = (): string =>
  typeof window !== "undefined" ? localStorage.getItem("organization_id") || "" : "";

type Method = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(method: Method, url: string, options: { params?: Record<string, string | number | undefined>; data?: unknown } = {} as any): Promise<T> {
  const res = await apiService({ method, url, params: options.params, data: options.data, file: undefined, customBaseUrl: undefined });
  return res.data as T;
}

export const inventoryApi = {
  summary: (org: string, q: SummaryQuery = {} as any) =>
    request<SummaryResponse>("GET", "/api/v1/inventory/summary", {
      params: { org_id: org, search: q.search, filter: q.filter, page: q.page, limit: q.limit },
    }),
  ledger: (org: string, itemId: string) =>
    request<LedgerResponse>("GET", `/api/v1/inventory/items/${encodeURIComponent(itemId)}/ledger`, { params: { org_id: org } }),
  valuation: (org: string, asOf?: string) =>
    request<ValuationResponse>("GET", "/api/v1/inventory/valuation", { params: { org_id: org, as_of: asOf } }),
  lookups: (org: string) => request<LookupsResponse>("GET", "/api/v1/inventory/lookups", { params: { org_id: org } }),
  getSettings: (org: string) => request<SettingsResponse>("GET", "/api/v1/inventory/settings", { params: { org_id: org } }),
  saveSettings: (org: string, sell_policy: SellPolicy) =>
    request<SettingsResponse>("PUT", "/api/v1/inventory/settings", { params: { org_id: org }, data: { sell_policy } }),
  listAdjustments: (org: string, search: string, page: number) =>
    request<AdjustmentListResponse>("GET", "/api/v1/inventory/adjustments", { params: { org_id: org, search: search || undefined, page, limit: 25 } }),
  getAdjustment: (org: string, id: string) =>
    request<AdjustmentDetailResponse>("GET", `/api/v1/inventory/adjustments/${encodeURIComponent(id)}`, { params: { org_id: org } }),
  createAdjustment: (org: string, body: AdjustmentInput) =>
    request<{ status: boolean; data: { _id: string } }>("POST", "/api/v1/inventory/adjustments", { params: { org_id: org }, data: body }),
  deleteAdjustment: (org: string, id: string) =>
    request<{ status: boolean; message: string }>("DELETE", `/api/v1/inventory/adjustments/${encodeURIComponent(id)}`, { params: { org_id: org } }),
};
