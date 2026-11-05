// Display helpers shared by the inventory pages.
import type { SourceType, StockStatus } from "../../services/inventoryApi";

export const fmtMoney = (n: number): string =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Quantities keep up to 4 decimals (2.5 kg), without trailing zeros.
export const fmtQty = (n: number): string =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 4 });

export const fmtDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB");
};

export const todayIso = (): string => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const SOURCE_LABEL: Record<SourceType, string> = {
  opening: "Opening stock",
  bill: "Bill",
  invoice: "Invoice",
  credit_note: "Credit note",
  vendor_credit: "Vendor credit",
  adjustment: "Adjustment",
};

export const STATUS_COLOR: Record<StockStatus, "success" | "warning" | "error"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "error",
};

// Opens a CSV file in the browser (with a BOM so Excel reads the rupee sign).
export const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]): void => {
  const esc = (v: string | number): string => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
