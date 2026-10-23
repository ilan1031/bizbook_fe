"use client";

// Printable invoice / quote laid out like the Terranova proforma: header
// with company and document details, Bill to / Ship to / Supply details,
// line items with HSN and GST, an HSN-wise tax summary, totals, amount in
// words, bank details, terms and signatory. Everything optional comes from
// the organisation's saved template (Settings > Invoice & Quote Templates).
import React from "react";
import { Box } from "@mui/material";
import { amountInWords } from "../../../services/amountInWords";

const inr = (n) =>
  Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

const fmtDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const addressLines = (a) => {
  if (!a) return [];
  const street = [a.address || a.street1, a.street2].filter(Boolean).join(", ");
  const city = [a.city, a.zip].filter(Boolean).join(" – ");
  return [a.attention, street, [city, a.state].filter(Boolean).join(", "), a.country && a.country !== "India" ? a.country : ""].filter(
    Boolean
  );
};

// Turns a stored invoice or quote into what the template prints.
export const toTemplateDoc = (kind, raw = {}) => {
  const lines = (raw.line_items || []).map((l) => {
    const qty = Number(l.quantity) || 0;
    const rate = Number(l.rate) || 0;
    const taxable = l.taxable_amount != null && l.taxable_amount !== 0 ? Number(l.taxable_amount) : round2(qty * rate);
    const gstRate = Number(l.gst_rate ?? l.tax_percentage ?? 0) || 0;
    const gst = l.gst_amount != null && l.gst_amount !== 0 ? Number(l.gst_amount) : round2((taxable * gstRate) / 100);
    return {
      name: l.name || l.item_name || "",
      description: l.description || "",
      hsn: l.hsn_or_sac || l.hsn || l.sac || "",
      qty,
      unit: l.unit || "",
      rate,
      taxable,
      gstRate,
      cgst: Number(l.cgst_amount) || 0,
      sgst: Number(l.sgst_amount) || 0,
      igst: Number(l.igst_amount) || 0,
      gst,
      amount: round2(taxable + gst),
    };
  });
  const taxable = round2(lines.reduce((s, l) => s + l.taxable, 0));
  const igst = Number(raw.igst_total) || 0;
  let cgst = Number(raw.cgst_total) || 0;
  let sgst = Number(raw.sgst_total) || 0;
  const gstTotal = Number(raw.gst_total) || round2(lines.reduce((s, l) => s + l.gst, 0));
  // Older documents only carry a total tax: split it as intra-state.
  if (!cgst && !sgst && !igst && gstTotal) {
    cgst = round2(gstTotal / 2);
    sgst = round2(gstTotal - cgst);
  }
  return {
    kind,
    number: raw.invoice_number || raw.estimate_number || raw.quote_number || "",
    date: raw.date,
    dueLabel: kind === "invoice" ? "Due Date" : "Valid Until",
    due: kind === "invoice" ? raw.due_date : raw.expiry_date,
    reference: raw.reference_number || "",
    placeOfSupply: raw.place_of_supply || "",
    paymentTerms: raw.payment_terms_label || raw.payment_terms || "",
    customerName: raw.customer_name || "",
    customerGst: raw.gst_no || "",
    lines,
    taxable,
    cgst,
    sgst,
    igst,
    adjustment: Number(raw.adjustment) || 0,
    roundOff: Number(raw.roundoff_value) || 0,
    total: Number(raw.total) || round2(taxable + cgst + sgst + igst + (Number(raw.adjustment) || 0)),
    notes: raw.notes || "",
    terms: raw.terms || "",
  };
};

const hsnSummary = (lines) => {
  const map = new Map();
  for (const l of lines) {
    const key = `${l.hsn || "—"}|${l.gstRate}`;
    const row = map.get(key) || { hsn: l.hsn || "—", rate: l.gstRate, taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    row.taxable += l.taxable;
    if (l.igst) row.igst += l.igst;
    else if (l.cgst || l.sgst) {
      row.cgst += l.cgst;
      row.sgst += l.sgst;
    } else {
      row.cgst += l.gst / 2;
      row.sgst += l.gst / 2;
    }
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => String(a.hsn).localeCompare(String(b.hsn)));
};

const label = { color: "#6b6b6b" };
const sectionHead = { fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", mb: 0.75 };
const th = (accent) => ({
  background: accent,
  color: "#fff",
  fontWeight: 700,
  fontSize: 11,
  padding: "8px 6px",
  textAlign: "left",
  border: `1px solid ${accent}`,
});
const td = { fontSize: 11.5, padding: "7px 6px", border: "1px solid #d9d9d9", verticalAlign: "top" };

export default function DocumentTemplate({ doc, org = {}, customer = {}, settings = {} }) {
  const accent = settings.accent || "#1f1f1f";
  const interState = doc.igst > 0;
  const summary = hsnSummary(doc.lines);
  const advance = Number(settings.advance_percent) || 0;
  const bank = settings.bank || {};
  const hasBank = Object.values(bank).some(Boolean);
  const terms = String(settings.terms || doc.terms || "")
    .split(/\r?\n/)
    .filter((t) => t.trim());
  const orgAddress = [
    [org.first_street, org.second_street].filter(Boolean).join(", "),
    [org.city, org.zip].filter(Boolean).join(" – "),
    [org.state, org.country].filter(Boolean).join(", "),
  ].filter(Boolean);
  const qtyTotal = doc.lines.reduce((s, l) => s + l.qty, 0);
  const columns = 3 - (settings.show_ship_to === false ? 1 : 0) - (settings.show_supply_details === false ? 1 : 0);

  return (
    <Box
      className="doc-template"
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        p: "14mm 12mm",
        bgcolor: "#fff",
        color: "#1f1f1f",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 12,
        boxSizing: "border-box",
        "& table": { borderCollapse: "collapse", width: "100%" },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, pb: 2, borderBottom: `3px solid ${accent}` }}>
        <Box sx={{ maxWidth: "60%" }}>
          {settings.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo} alt="" style={{ maxHeight: 54, maxWidth: 220, marginBottom: 8 }} />
          )}
          <Box sx={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.04em" }}>{(org.org_name || "").toUpperCase()}</Box>
          {settings.tagline && <Box sx={{ fontStyle: "italic", fontSize: 11 }}>{settings.tagline}</Box>}
          {orgAddress.map((l) => (
            <Box key={l} sx={{ ...label, fontSize: 11 }}>
              {l}
            </Box>
          ))}
          <Box sx={{ ...label, fontSize: 11 }}>
            {[org.phone && org.phone !== 0 ? `+91 ${org.phone}` : "", org.email].filter(Boolean).join(" · ")}
          </Box>
          {org.gst_in && (
            <Box sx={{ fontSize: 11 }}>
              <span style={label}>GSTIN:</span> <b>{org.gst_in}</b>
            </Box>
          )}
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Box sx={{ fontSize: 24, fontWeight: 700, letterSpacing: "0.12em" }}>{settings.title || (doc.kind === "quote" ? "QUOTATION" : "TAX INVOICE")}</Box>
          {settings.subtitle && <Box sx={{ ...label, fontSize: 10, letterSpacing: "0.3em", mb: 1 }}>{settings.subtitle}</Box>}
          <Box sx={{ mt: 1, fontSize: 11.5, lineHeight: 1.7 }}>
            <div>
              <span style={label}>{doc.kind === "quote" ? "Quote No." : "Invoice No."}</span> <b>{doc.number}</b>
            </div>
            <div>
              <span style={label}>Date</span> <b>{fmtDate(doc.date)}</b>
            </div>
            {doc.due && (
              <div>
                <span style={label}>{doc.dueLabel}</span> <b>{fmtDate(doc.due)}</b>
              </div>
            )}
          </Box>
        </Box>
      </Box>

      {/* Parties */}
      <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, border: "1px solid #d9d9d9", mt: 2.5 }}>
        <Box sx={{ p: 1.25, borderRight: columns > 1 ? "1px solid #d9d9d9" : 0 }}>
          <Box sx={sectionHead}>Bill To (Recipient)</Box>
          <Box sx={{ fontWeight: 700 }}>{doc.customerName}</Box>
          {addressLines(customer.billing_address).map((l) => (
            <Box key={l} sx={label}>
              {l}
            </Box>
          ))}
          {(doc.customerGst || customer.gst_no) && (
            <Box>
              <span style={label}>GSTIN:</span> <b>{doc.customerGst || customer.gst_no}</b>
            </Box>
          )}
          {(customer.phone || customer.mobile) && (
            <Box>
              <span style={label}>Contact:</span> <b>{customer.phone || customer.mobile}</b>
            </Box>
          )}
        </Box>
        {settings.show_ship_to !== false && (
          <Box sx={{ p: 1.25, borderRight: settings.show_supply_details !== false ? "1px solid #d9d9d9" : 0 }}>
            <Box sx={sectionHead}>Ship To (Consignee)</Box>
            <Box sx={{ fontWeight: 700 }}>{customer.shipping_address?.attention || doc.customerName}</Box>
            {addressLines({ ...customer.shipping_address, attention: "" }).map((l) => (
              <Box key={l} sx={label}>
                {l}
              </Box>
            ))}
          </Box>
        )}
        {settings.show_supply_details !== false && (
          <Box sx={{ p: 1.25 }}>
            <Box sx={sectionHead}>Supply Details</Box>
            {doc.placeOfSupply && (
              <Box>
                <span style={label}>Place of Supply:</span> <b>{doc.placeOfSupply}</b>
              </Box>
            )}
            {doc.reference && (
              <Box>
                <span style={label}>Reference:</span> <b>{doc.reference}</b>
              </Box>
            )}
            {doc.paymentTerms && (
              <Box>
                <span style={label}>Payment Terms:</span> <b>{doc.paymentTerms}</b>
              </Box>
            )}
            <Box>
              <span style={label}>Supply:</span> <b>{interState ? "Inter-state (IGST)" : "Intra-state (CGST + SGST)"}</b>
            </Box>
          </Box>
        )}
      </Box>

      {/* Lines */}
      <Box component="table" sx={{ mt: 2.5 }}>
        <thead>
          <tr>
            {["#", "Description of Goods / Services", "HSN/SAC", "Qty", "Unit", "Rate (₹)", "Taxable Value (₹)", "GST %", "Amount (₹)"].map(
              (h, i) => (
                <th key={h} style={{ ...th(accent), textAlign: i >= 3 && i !== 4 ? "right" : "left" }}>
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {doc.lines.map((l, i) => (
            <tr key={i}>
              <td style={td}>{i + 1}</td>
              <td style={td}>
                <b>{l.name}</b>
                {l.description && <div style={{ ...label, fontSize: 10.5 }}>{l.description}</div>}
              </td>
              <td style={td}>{l.hsn}</td>
              <td style={{ ...td, textAlign: "right" }}>{l.qty}</td>
              <td style={td}>{l.unit}</td>
              <td style={{ ...td, textAlign: "right" }}>{inr(l.rate)}</td>
              <td style={{ ...td, textAlign: "right" }}>{inr(l.taxable)}</td>
              <td style={{ ...td, textAlign: "right" }}>{l.gstRate}%</td>
              <td style={{ ...td, textAlign: "right" }}>{inr(l.amount)}</td>
            </tr>
          ))}
          <tr style={{ background: "#f3f3f3", fontWeight: 700 }}>
            <td style={{ ...td, textAlign: "right" }} colSpan={3}>
              Total
            </td>
            <td style={{ ...td, textAlign: "right" }}>{qtyTotal}</td>
            <td style={td} colSpan={2} />
            <td style={{ ...td, textAlign: "right" }}>{inr(doc.taxable)}</td>
            <td style={td} />
            <td style={{ ...td, textAlign: "right" }}>{inr(doc.lines.reduce((s, l) => s + l.amount, 0))}</td>
          </tr>
        </tbody>
      </Box>

      {/* Tax summary + totals */}
      <Box sx={{ display: "flex", gap: 3, mt: 2.5, alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          {settings.show_hsn_summary !== false && summary.length > 0 && (
            <table>
              <thead>
                <tr>
                  {["HSN/SAC", "Taxable Value", ...(interState ? ["IGST Rate", "IGST"] : ["CGST Rate", "CGST", "SGST Rate", "SGST"]), "Total Tax"].map((h) => (
                    <th key={h} style={{ ...td, background: "#f3f3f3", fontSize: 10.5, fontWeight: 700 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.map((r) => (
                  <tr key={`${r.hsn}-${r.rate}`}>
                    <td style={td}>{r.hsn}</td>
                    <td style={{ ...td, textAlign: "right" }}>{inr(r.taxable)}</td>
                    {interState ? (
                      <>
                        <td style={td}>{r.rate}%</td>
                        <td style={{ ...td, textAlign: "right" }}>{inr(r.igst)}</td>
                      </>
                    ) : (
                      <>
                        <td style={td}>{r.rate / 2}%</td>
                        <td style={{ ...td, textAlign: "right" }}>{inr(r.cgst)}</td>
                        <td style={td}>{r.rate / 2}%</td>
                        <td style={{ ...td, textAlign: "right" }}>{inr(r.sgst)}</td>
                      </>
                    )}
                    <td style={{ ...td, textAlign: "right" }}>{inr(r.cgst + r.sgst + r.igst)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Box>
        <Box sx={{ width: 270, fontSize: 12 }}>
          {[
            ["Taxable Amount", doc.taxable],
            ...(interState ? [["IGST", doc.igst]] : [["CGST", doc.cgst], ["SGST", doc.sgst]]),
            ...(doc.adjustment ? [["Adjustment", doc.adjustment]] : []),
            ...(doc.roundOff ? [["Round Off", doc.roundOff]] : []),
          ].map(([k, v]) => (
            <Box key={k} sx={{ display: "flex", justifyContent: "space-between", py: 0.4 }}>
              <span style={label}>{k}</span>
              <span>₹ {inr(v)}</span>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", bgcolor: accent, color: "#fff", fontWeight: 700, fontSize: 15, px: 1.25, py: 1, mt: 0.75 }}>
            <span>GRAND TOTAL</span>
            <span>₹ {inr(doc.total)}</span>
          </Box>
          {advance > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 700, py: 0.75, px: 1.25 }}>
              <span>Advance Payable ({advance}%)</span>
              <span>₹ {inr(round2((doc.total * advance) / 100))}</span>
            </Box>
          )}
        </Box>
      </Box>

      {settings.show_amount_in_words !== false && (
        <Box sx={{ mt: 2.5, border: "1px solid #d9d9d9", bgcolor: "#f3f3f3", px: 1.25, py: 1 }}>
          <span style={label}>Amount Payable (in words): </span>
          <b>{amountInWords(doc.total)}</b>
        </Box>
      )}

      {/* Bank, terms, signatory */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr", gap: 3, mt: 3 }}>
        <Box>
          {hasBank && (
            <>
              <Box sx={sectionHead}>Bank Details</Box>
              {[
                ["Account Name", bank.account_name],
                ["Bank", bank.bank],
                ["A/c No.", bank.account_no],
                ["IFSC", bank.ifsc],
                ["Branch", bank.branch],
                ["UPI ID", bank.upi],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <Box key={k} sx={{ fontSize: 11.5 }}>
                    <span style={label}>{k}:</span> <b>{v}</b>
                  </Box>
                ))}
            </>
          )}
        </Box>
        <Box>
          {terms.length > 0 && (
            <>
              <Box sx={sectionHead}>Terms</Box>
              {terms.map((t, i) => (
                <Box key={i} sx={{ ...label, fontSize: 10.5 }}>
                  {t}
                </Box>
              ))}
            </>
          )}
        </Box>
        <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 110 }}>
          <Box sx={{ fontWeight: 700, fontSize: 12 }}>For {(org.org_name || "").toUpperCase()}</Box>
          <Box sx={{ borderTop: "1px solid #6b6b6b", pt: 0.5 }}>
            <Box sx={{ fontWeight: 700, fontSize: 12 }}>Authorised Signatory</Box>
            {settings.signatory && <Box sx={{ ...label, fontSize: 11 }}>{settings.signatory}</Box>}
          </Box>
        </Box>
      </Box>

      {(settings.note || doc.notes) && (
        <Box sx={{ mt: 2.5, fontSize: 11 }}>
          <b>Note:</b> {settings.note || doc.notes}
        </Box>
      )}
      {settings.footer && (
        <Box sx={{ mt: 4, pt: 1, borderTop: "1px solid #d9d9d9", textAlign: "center", ...label, fontSize: 10.5 }}>{settings.footer}</Box>
      )}
    </Box>
  );
}

// Sample document for the template editor's preview.
export const SAMPLE_DOC = (kind) =>
  toTemplateDoc(kind, {
    invoice_number: "INV-2026-27/0001",
    estimate_number: "QT-2026-27/0012",
    date: new Date().toISOString(),
    due_date: new Date(Date.now() + 15 * 864e5).toISOString(),
    expiry_date: new Date(Date.now() + 15 * 864e5).toISOString(),
    customer_name: "Sample Traders",
    gst_no: "33PQRST5678K1Z2",
    place_of_supply: "Tamil Nadu (33)",
    payment_terms_label: "50% advance, balance before dispatch",
    line_items: [
      { name: "Microconcrete – Base Coat", description: "20 kg bag", hsn_or_sac: "38245090", quantity: 10, unit: "Bag", rate: 3200, gst_rate: 18 },
      { name: "Primer – Acrylic Bonding", description: "5 L can", hsn_or_sac: "32091090", quantity: 4, unit: "Can", rate: 2400, gst_rate: 18 },
    ],
    cgst_total: 3744,
    sgst_total: 3744,
    total: 49088,
  });
