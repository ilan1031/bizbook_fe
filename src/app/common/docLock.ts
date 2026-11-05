// Rule: once a sales or purchase document has been invoiced or converted it
// can't go back to draft, be reversed, or lose its link. The server enforces
// it (bizbook_be/helpers/docLocks.js) and returns the same reasons. These
// functions mirror those checks so the UI can disable an action and show why.
// Each returns the reason the action is blocked, or null when it is allowed.

type Doc = Record<string, unknown> | null | undefined;

const str = (v: unknown) => String(v ?? "").trim().toLowerCase();
const count = (v: unknown) => (Array.isArray(v) ? v.length : 0);
const num = (v: unknown) => Number(v ?? 0) || 0;

// ---- Invoices ------------------------------------------------------------
export const invoiceIssued = (inv: Doc): boolean => {
  if (!inv) return false;
  if (inv.issued_at) return true;
  if (num(inv.payment_made) > 0 || count(inv.payments) > 0) return true;
  const status = str(inv.status) || "draft";
  return status !== "draft" && status !== "void";
};

const invoicePaid = (inv: Doc) => num(inv?.payment_made) > 0 || ["paid", "partially paid"].includes(str(inv?.status));

export const invoiceStatusBlock = (inv: Doc, next: string): string | null => {
  const to = str(next);
  const from = str(inv?.status) || "draft";
  if (!inv || !to || to === from || !invoiceIssued(inv)) return null;
  if (to === "draft") {
    return invoicePaid(inv)
      ? "This invoice has payments recorded, so it can't go back to draft."
      : "This invoice has been sent, so it can't go back to draft.";
  }
  if (from === "void") return "This invoice has been voided, so it can't be reopened.";
  return null;
};

// ---- Quotes --------------------------------------------------------------
export const quoteConverted = (q: Doc): boolean =>
  count(q?.invoice_ids) > 0 || count(q?.invoices) > 0 || count(q?.salesorder_ids) > 0 || count(q?.salesorders) > 0 || str(q?.status) === "invoiced";

const quoteTarget = (q: Doc) => (count(q?.invoice_ids) > 0 || count(q?.invoices) > 0 || str(q?.status) === "invoiced" ? "an invoice" : "a sales order");

// Draft is never allowed once converted. A quote converted to an invoice keeps
// its "invoiced" status; one converted only to a sales order can still be
// marked sent, accepted or declined.
export const quoteStatusBlock = (q: Doc, next: string): string | null => {
  const to = str(next);
  if (!q || !to || to === str(q.status) || !quoteConverted(q)) return null;
  if (to === "draft") return `This quote is already converted to ${quoteTarget(q)} and can't go back to draft.`;
  if (str(q.status) === "invoiced" || count(q.invoice_ids) > 0 || count(q.invoices) > 0) {
    return `This quote is already converted to ${quoteTarget(q)}, so its status can't change.`;
  }
  return null;
};

export const quoteDeleteBlock = (q: Doc): string | null =>
  q && quoteConverted(q) ? `This quote is already converted to ${quoteTarget(q)} and can't be deleted.` : null;

// ---- Sales orders --------------------------------------------------------
export const salesOrderConverted = (so: Doc): boolean =>
  count(so?.invoice_ids) > 0 || count(so?.invoices) > 0 || str(so?.invoiced_status) === "invoiced";

// `next` holds the status fields being saved.
export const salesOrderStatusBlock = (so: Doc, next: { status?: string; invoiced_status?: string }): string | null => {
  if (!so || !salesOrderConverted(so)) return null;
  const to = str(next.status);
  if (to && to !== str(so.status) && ["draft", "void", "not_invoiced"].includes(to)) {
    return to === "draft"
      ? "This sales order is already converted to an invoice and can't go back to draft."
      : `This sales order is already converted to an invoice, so it can't be marked ${to.replace("_", " ")}.`;
  }
  if (next.invoiced_status !== undefined && str(next.invoiced_status) !== "invoiced" && str(next.invoiced_status) !== str(so.invoiced_status)) {
    return "This sales order is already converted to an invoice, so it can't be marked not invoiced.";
  }
  return null;
};

export const salesOrderDeleteBlock = (so: Doc): string | null =>
  so && salesOrderConverted(so) ? "This sales order is already converted to an invoice and can't be deleted." : null;

// ---- Delivery challans ---------------------------------------------------
export const challanConverted = (c: Doc): boolean => count(c?.invoices) > 0 || str(c?.invoiced_status) === "invoiced";

export const challanStatusBlock = (c: Doc, next: { status?: string; invoiced_status?: string }): string | null => {
  if (!c || !challanConverted(c)) return null;
  if (str(next.status) === "draft" && str(c.status) !== "draft") {
    return "This delivery challan is already converted to an invoice and can't go back to draft.";
  }
  if (next.invoiced_status !== undefined && str(next.invoiced_status) !== "invoiced" && str(next.invoiced_status) !== str(c.invoiced_status)) {
    return "This delivery challan is already converted to an invoice, so it can't be marked not invoiced.";
  }
  return null;
};

export const challanDeleteBlock = (c: Doc): string | null =>
  c && challanConverted(c) ? "This delivery challan is already converted to an invoice and can't be deleted." : null;

// ---- Bills (status: 0 open, 1 draft, 2 void, 3 paid) ---------------------
const BILL_CODE: Record<string, number> = { OPEN: 0, DRAFT: 1, VOID: 2, PAID: 3 };

export const billStatusBlock = (bill: Doc, nextType: string): string | null => {
  const cur = num(bill?.status);
  const to = String(nextType || "").toUpperCase();
  if (!bill || !to || BILL_CODE[to] === cur) return null;
  if (to === "DRAFT" && cur !== BILL_CODE.DRAFT) return "This bill has been recorded, so it can't go back to draft.";
  if (cur === BILL_CODE.VOID) return "This bill has been voided, so it can't be reopened.";
  if (to === "VOID" && cur === BILL_CODE.PAID) return "A paid bill can't be voided.";
  return null;
};

// ---- Purchase orders -----------------------------------------------------
export const poBilled = (po: Doc): boolean => count(po?.bills) > 0 || str(po?.billed_status) === "billed";

// `verb` completes "...so it can't be <verb>."
export const poStatusBlock = (po: Doc, verb: string): string | null =>
  po && poBilled(po) ? `This purchase order has been converted to a bill, so it can't be ${verb}.` : null;

export const poDeleteBlock = (po: Doc): string | null =>
  po && poBilled(po) ? "This purchase order has been converted to a bill and can't be deleted." : null;
