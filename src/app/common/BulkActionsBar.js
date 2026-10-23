"use client";

// Toolbar shown above a list when rows are ticked. Every button does
// something real: export or print the selected rows, or run the module's
// own status / delete endpoint (the same calls the record's page makes) on
// each selected row. Labels follow RbacButtonGuard's conventions ("Mark as
// ...", "Delete"), so actions the user lacks are hidden automatically.
import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import apiService from "../../services/axiosService";
import { useSnackbar } from "../../components/SnackbarProvider";
import { usePermissions } from "../../services/PermissionProvider";

const orgId = () => localStorage.getItem("organization_id");

const status = (url, idParam, value, label, extra = {}) => (row) =>
  apiService({
    method: "PUT",
    url: `api/v1/${url}`,
    params: { organization_id: orgId(), [idParam]: row[idParam] },
    data: { status: value, status_formatted: label, ...extra },
  });

// Columns for export/print, the row's display number, and the actions.
// `when` limits an action to rows it applies to (others are skipped).
export const BULK_MODULES = {
  customers: {
    title: "Customers",
    number: (r) => r.contact_name,
    columns: [["Name", "contact_name"], ["Company", "company_name"], ["Email", "email"], ["Phone", "phone"], ["Receivables", "outstanding_receivable_amount"]],
    // PATCH /contact/status flips active <-> inactive.
    actions: [
      { label: "Mark as Inactive", when: (r) => r.status !== "inactive", run: (r) => apiService({ method: "PATCH", url: "api/v1/contact/status", params: { organization_id: orgId(), contact_id: r.contact_id } }) },
      { label: "Mark as Active", when: (r) => r.status === "inactive", run: (r) => apiService({ method: "PATCH", url: "api/v1/contact/status", params: { organization_id: orgId(), contact_id: r.contact_id } }) },
      { label: "Delete", danger: true, run: (r) => apiService({ method: "DELETE", url: "api/v1/contact", params: { organization_id: orgId(), contact_id: r.contact_id } }) },
    ],
  },
  items: {
    title: "Items",
    number: (r) => r.name || r.item_name,
    columns: [["Name", "name"], ["SKU", "sku"], ["Type", "item_type_formatted"], ["Rate", "rate"], ["Unit", "unit"], ["Status", "status"]],
    actions: [
      {
        label: "Delete", danger: true,
        run: (r) => apiService({ method: "DELETE", url: `api/v1/items/${r.item_id}`, params: { organization_id: orgId(), admin_id: localStorage.getItem("admin_id") } }),
      },
    ],
  },
  quotes: {
    title: "Quotes",
    number: (r) => r.estimate_number,
    columns: [
      ["Date", "date"], ["Quote#", "estimate_number"], ["Reference#", "reference_number"],
      ["Customer", "customer_name"], ["Status", "status_formatted"], ["Amount", "total"],
    ],
    actions: [
      { label: "Mark as Sent", when: (r) => r.status === "draft", run: status("estimate/status", "quote_id", "sent", "Sent") },
      { label: "Mark as Accepted", when: (r) => ["sent", "draft"].includes(r.status), run: status("estimate/status", "quote_id", "accepted", "Accepted") },
      {
        label: "Delete", danger: true,
        run: (r) => apiService({ method: "DELETE", url: `api/v1/estimates/${r.quote_id}`, params: { organization_id: orgId() } }),
      },
    ],
  },
  invoices: {
    title: "Invoices",
    number: (r) => r.invoice_number,
    columns: [
      ["Date", "date"], ["Invoice#", "invoice_number"], ["Customer", "customer_name"], ["Status", "status_formatted"],
      ["Due date", "due_date_formatted"], ["Amount", "total"], ["Balance due", "balance"],
    ],
    actions: [
      { label: "Mark as Sent", when: (r) => r.status === "draft", run: status("invoices/status", "invoice_id", "sent", "Sent") },
      {
        label: "Delete", danger: true,
        run: (r) => apiService({ method: "DELETE", url: "api/v1/invoices", params: { org_id: orgId(), invoice_id: r.invoice_id } }),
      },
    ],
  },
  salesOrders: {
    title: "Sales Orders",
    number: (r) => r.salesorder_number,
    columns: [
      ["Date", "date"], ["Sales Order#", "salesorder_number"], ["Reference#", "reference_number"],
      ["Customer", "customer_name"], ["Status", "status_formatted"], ["Amount", "total"],
    ],
    actions: [
      {
        label: "Mark as Confirmed", when: (r) => (r.order_status || r.status) === "draft",
        run: status("sales-order/status", "salesorder_id", "open", "Open", {
          order_status: "confirmed",
          order_status_formatted: "Confirmed",
          invoiced_status: "not-invoiced",
          invoiced_status_formatted: "Not Invoiced",
          paid_status: "unpaid",
          paid_status_formatted: "Unpaid",
        }),
      },
      {
        label: "Delete", danger: true,
        run: (r) => apiService({ method: "DELETE", url: "api/v1/salesorders", params: { organization_id: orgId(), salesorder_id: r.salesorder_id } }),
      },
    ],
  },
  paymentsReceived: {
    title: "Payments Received",
    number: (r) => r.payment_number || r.payment_id,
    columns: [
      ["Date", "date"], ["Payment#", "payment_id"], ["Reference#", "reference_number"], ["Customer", "customer_name"],
      ["Mode", "payment_mode"], ["Amount", "amount"],
    ],
    actions: [
      {
        label: "Delete", danger: true,
        run: (r) => apiService({ method: "DELETE", url: "api/v1/payment", params: { organization_id: orgId(), payment_id: r.payment_id } }),
      },
    ],
  },
  recurringInvoices: {
    title: "Recurring Invoices",
    number: (r) => r.recurrence_name || r.recurring_invoice_id,
    columns: [
      ["Customer", "customer_name"], ["Profile", "recurrence_name"], ["Frequency", "recurrence_frequency"],
      ["Last invoice", "last_sent_date"], ["Next invoice", "next_invoice_date"], ["Status", "status"], ["Amount", "total"],
    ],
    actions: [
      {
        label: "Delete", danger: true,
        run: (r) =>
          apiService({
            method: "DELETE",
            url: "api/v1/RecurringInvoices/individual/delete",
            params: { organization_id: orgId(), recurring_invoice_id: r.recurring_invoice_id },
          }),
      },
    ],
  },
  recurringExpenses: {
    title: "Recurring Expenses",
    number: (r) => r.profile_name || r.recurring_expense_id,
    columns: [
      ["Profile", "profile_name"], ["Account", "account_name"], ["Vendor", "vendor_name"], ["Frequency", "repeat_every"],
      ["Next expense", "next_expense_date"], ["Status", "status"], ["Amount", "amount"],
    ],
    actions: [
      {
        label: "Mark as Stopped", when: (r) => r.status !== "stopped",
        run: (r) =>
          apiService({
            method: "POST",
            url: "api/v1/recurring-expense/update-recurring-status",
            params: { org_id: orgId(), recurring_expense_id: r.recurring_expense_id },
            data: { status: "stopped" },
          }),
      },
      {
        label: "Mark as Active", when: (r) => r.status === "stopped",
        run: (r) =>
          apiService({
            method: "POST",
            url: "api/v1/recurring-expense/update-recurring-status",
            params: { org_id: orgId(), recurring_expense_id: r.recurring_expense_id },
            data: { status: "active" },
          }),
      },
      {
        label: "Delete", danger: true,
        run: (r) =>
          apiService({
            method: "POST",
            url: "api/v1/recurring-expense/delete-recurring-expense",
            params: { org_id: orgId(), recurring_expense_id: r.recurring_expense_id },
            data: { is_deleted: true },
          }),
      },
    ],
  },
  recurringBills: {
    title: "Recurring Bills",
    number: (r) => r.profile_name || r.recurring_bill_id,
    columns: [
      ["Vendor", "vendor_name"], ["Profile", "profile_name"], ["Frequency", "repeat_every"],
      ["Next bill", "next_bill_date"], ["Status", "status_type"], ["Amount", "total"],
    ],
    actions: [
      {
        label: "Mark as Stopped", when: (r) => r.status_type === "active",
        run: (r) =>
          apiService({
            method: "PUT",
            url: "api/v1/recurring-bill/update-status/stop",
            params: { recurring_bill_id: r.recurring_bill_id, organization_id: orgId() },
          }),
      },
      {
        label: "Mark as Active", when: (r) => r.status_type !== "active",
        run: (r) =>
          apiService({
            method: "PUT",
            url: "api/v1/recurring-bill/update-status/resume",
            params: { recurring_bill_id: r.recurring_bill_id, organization_id: orgId() },
          }),
      },
      {
        label: "Delete", danger: true,
        run: (r) =>
          apiService({
            method: "DELETE",
            url: `api/v1/recurring-bill/${r.recurring_bill_id}`,
            params: { organization_id: orgId(), journal_id: r.journal_id },
          }),
      },
    ],
  },
};

const cell = (row, key) => {
  const v = row?.[key];
  return v === undefined || v === null ? "" : String(v);
};

export const toCsv = (rows, columns) => {
  const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [columns.map(([h]) => h), ...rows.map((r) => columns.map(([, k]) => cell(r, k)))]
    .map((line) => line.map(esc).join(","))
    .join("\n");
};

// Saves rows as a CSV file. `columns` is [[header, key], ...].
export const downloadCsv = (name, rows, columns) => {
  const blob = new Blob([toCsv(rows, columns)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};

const escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// `columns` (the list's own [{ key, label }]) decides what export and print
// include; the module's defaults are used without it.
export default function BulkActionsBar({ module, rows, columns, onClear, onDone }) {
  const base = BULK_MODULES[module];
  const cfg = base && {
    ...base,
    columns: columns?.length ? columns.map((c) => [c.label, c.key]) : base.columns,
  };
  const { showMessage } = useSnackbar() || {};
  // Bulk actions are a feature the superadmin switches on per user.
  const bulkAllowed = Boolean(usePermissions()?.can("bulkActions", "view"));
  const [pending, setPending] = useState(null); // action awaiting confirmation
  const [busy, setBusy] = useState(false);
  const notify = (msg, type) => (showMessage ? showMessage(msg, type) : window.alert(msg));

  const exportCsv = () => downloadCsv(cfg.title, rows, cfg.columns);

  const print = () => {
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return notify("Allow pop-ups to print.", "error");
    const head = cfg.columns.map(([h]) => `<th>${escHtml(h)}</th>`).join("");
    const body = rows
      .map((r) => `<tr>${cfg.columns.map(([, k]) => `<td>${escHtml(cell(r, k))}</td>`).join("")}</tr>`)
      .join("");
    w.document.write(
      `<html><head><title>${escHtml(cfg.title)}</title><style>body{font-family:sans-serif;padding:16px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px 8px;font-size:12px;text-align:left}th{background:#f5f5f5}</style></head>` +
        `<body><h3>${escHtml(cfg.title)} (${rows.length})</h3><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`
    );
    w.document.close();
    w.focus();
    w.print();
  };

  const run = async (action) => {
    const targets = rows.filter((r) => !action.when || action.when(r));
    setBusy(true);
    let ok = 0;
    const failed = [];
    for (const row of targets) {
      try {
        await action.run(row);
        ok += 1;
      } catch (e) {
        failed.push(`${cfg.number(row) || "?"}: ${e?.message || "failed"}`);
      }
    }
    setBusy(false);
    setPending(null);
    const skipped = rows.length - targets.length;
    const parts = [`${action.label}: ${ok} done`];
    if (skipped) parts.push(`${skipped} skipped (not applicable)`);
    if (failed.length) parts.push(`${failed.length} failed - ${failed.slice(0, 2).join("; ")}`);
    notify(parts.join(", "), failed.length ? "error" : "success");
    onClear?.();
    onDone?.();
  };

  if (!cfg) return null;
  const applicable = (a) => rows.filter((r) => !a.when || a.when(r)).length;
  const btnSx = {
    textTransform: "none",
    fontWeight: 500,
    color: "#333",
    mr: 1,
    border: "1px solid #ddd",
    bgcolor: "white",
    "&:hover": { bgcolor: "#f8f8f8" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        bgcolor: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
        px: 2,
        py: 1,
      }}
    >
      {bulkAllowed && cfg.actions.map((a) => (
        <Button
          key={a.label}
          size="small"
          disabled={busy || applicable(a) === 0}
          onClick={() => (a.danger ? setPending(a) : run(a))}
          sx={{ ...btnSx, ...(a.danger ? { color: "#d32f2f" } : {}) }}
        >
          {a.label}
        </Button>
      ))}
      <Tooltip title="Export selected (CSV)">
        <IconButton aria-label="Export selected" size="small" onClick={exportCsv} sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}>
          <FileDownloadIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Print selected">
        <IconButton aria-label="Print selected" size="small" onClick={print} sx={{ mx: 0.5, bgcolor: "white", border: "1px solid #ddd" }}>
          <LocalPrintshopOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {busy && <CircularProgress size={18} sx={{ ml: 1 }} />}

      <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <Typography sx={{ color: "primary.main", fontWeight: 500, fontSize: 14, mr: 1 }}>
          {rows.length} Selected
        </Typography>
        <IconButton aria-label="Clear selection" size="small" onClick={onClear}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Dialog open={Boolean(pending)} onClose={() => !busy && setPending(null)}>
        <DialogTitle>
          {pending?.label} {pending ? applicable(pending) : 0} {cfg.title.toLowerCase()}?
        </DialogTitle>
        <DialogContent>
          <Typography>
            {rows
              .filter((r) => !pending?.when || pending.when(r))
              .slice(0, 8)
              .map(cfg.number)
              .join(", ")}
            {rows.length > 8 ? "..." : ""}
          </Typography>
          <Typography color="text.secondary" mt={1}>
            This can&apos;t be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button data-rbac-ignore onClick={() => setPending(null)} disabled={busy}>
            Cancel
          </Button>
          <Button data-rbac-ignore color="error" variant="contained" disabled={busy} onClick={() => run(pending)}>
            {busy ? "Working..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
