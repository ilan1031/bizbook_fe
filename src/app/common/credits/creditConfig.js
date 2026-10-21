// Credit notes (sales) and vendor credits (purchases) share one set of
// screens; this is everything that differs between the two.
export const CREDIT_KINDS = {
  sales: {
    pageKey: "creditNotes",
    section: "Sales",
    title: "Credit Notes",
    single: "Credit Note",
    api: "/api/v1/credit-notes",
    base: "/sales/creditNotes",
    contactLabel: "Customer",
    documentLabel: "Invoice",
    documentsLabel: "invoices",
    // income accounts for lines
    lineAccountTypes: ["income", "other_income"],
    intro:
      "A credit note records money you owe a customer, for returns, discounts or overcharges. Apply it to the customer's invoices or refund it.",
    refundHint: "Money paid back to the customer.",
  },
  purchase: {
    pageKey: "vendorCredits",
    section: "Purchase",
    title: "Vendor Credits",
    single: "Vendor Credit",
    api: "/api/v1/vendor-credits",
    base: "/purchase/vendorcredits",
    contactLabel: "Vendor",
    documentLabel: "Bill",
    documentsLabel: "bills",
    lineAccountTypes: ["cost_of_goods_sold", "expense", "other_expense", "stock", "fixed_asset"],
    intro:
      "A vendor credit records money a vendor owes you, for returns or overbilling. Apply it to the vendor's bills or record a refund from them.",
    refundHint: "Money the vendor paid back to you.",
  },
};

export const STATUS_STYLES = {
  draft: { label: "Draft", color: "#6c718a", bg: "#eef0f5" },
  open: { label: "Open", color: "#1b6fd8", bg: "#e8f1fd" },
  closed: { label: "Closed", color: "#1e8e3e", bg: "#e6f4ea" },
  void: { label: "Void", color: "#b3261e", bg: "#fbe9e7" },
};

export const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Money is compared in whole paise to avoid float rounding surprises.
export const toPaise = (value) => Math.round(Number(value || 0) * 100);
export const isValidAmount = (value) =>
  value === "" || /^\d+(\.\d{0,2})?$/.test(String(value).trim());

export const headerCellSx = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#6c718a",
  textTransform: "uppercase",
  bgcolor: "#f6f6fa",
};
