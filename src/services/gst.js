// GST for sales forms. Mirrors the server's helpers/gstHelper.js
// (priceSalesDocument), which recomputes and stores the real figures; this
// copy only shows the user what will be saved.
//
// Same state as the company: CGST + SGST (half each). Another state: IGST.
// Overseas customers and SEZ units are zero-rated.

export const GST_RATES = [0, 0.25, 3, 5, 12, 18, 28];

const STATES = [
  ["01", "JK", "Jammu and Kashmir"], ["02", "HP", "Himachal Pradesh"], ["03", "PB", "Punjab"],
  ["04", "CH", "Chandigarh"], ["05", "UK", "Uttarakhand"], ["06", "HR", "Haryana"],
  ["07", "DL", "Delhi"], ["08", "RJ", "Rajasthan"], ["09", "UP", "Uttar Pradesh"],
  ["10", "BR", "Bihar"], ["11", "SK", "Sikkim"], ["12", "AR", "Arunachal Pradesh"],
  ["13", "NL", "Nagaland"], ["14", "MN", "Manipur"], ["15", "MZ", "Mizoram"],
  ["16", "TR", "Tripura"], ["17", "ML", "Meghalaya"], ["18", "AS", "Assam"],
  ["19", "WB", "West Bengal"], ["20", "JH", "Jharkhand"], ["21", "OD", "Odisha"],
  ["22", "CG", "Chhattisgarh"], ["23", "MP", "Madhya Pradesh"], ["24", "GJ", "Gujarat"],
  ["26", "DN", "Dadra and Nagar Haveli and Daman and Diu"], ["27", "MH", "Maharashtra"],
  ["29", "KA", "Karnataka"], ["30", "GA", "Goa"], ["31", "LD", "Lakshadweep"],
  ["32", "KL", "Kerala"], ["33", "TN", "Tamil Nadu"], ["34", "PY", "Puducherry"],
  ["35", "AN", "Andaman and Nicobar Islands"], ["36", "TS", "Telangana"],
  ["37", "AP", "Andhra Pradesh"], ["38", "LA", "Ladakh"], ["97", "OT", "Other Territory"],
];
const norm = (s) => String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
const BY_KEY = new Map();
STATES.forEach(([code, short, name]) => [code, short, name].forEach((k) => BY_KEY.set(norm(k), code)));
[
  ["tamilnadu", "33"], ["orissa", "21"], ["uttaranchal", "05"], ["pondicherry", "34"],
  ["delhinct", "07"], ["nctofdelhi", "07"], ["newdelhi", "07"], ["telengana", "36"],
  ["damananddiu", "26"], ["dadraandnagarhaveli", "26"], ["andamanandnicobar", "35"],
  ["chattisgarh", "22"], ["ts", "36"], ["tg", "36"], ["od", "21"], ["or", "21"], ["ct", "22"],
].forEach(([alias, code]) => BY_KEY.set(alias, code));

export const stateCode = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (/^\d{2}[A-Z0-9]{13}$/i.test(raw)) return raw.slice(0, 2);
  const bracket = /^\[([A-Za-z]{2})\]/.exec(raw);
  if (bracket && BY_KEY.has(norm(bracket[1]))) return BY_KEY.get(norm(bracket[1]));
  const dash = raw.split(" - ").pop();
  return BY_KEY.get(norm(raw)) || BY_KEY.get(norm(dash)) || null;
};

const ZERO_RATED = /overseas|special economic zone|\bsez\b/i;
const toPaise = (v) => Math.round(Number(v || 0) * 100);
const fromPaise = (p) => Math.round(p) / 100;

// Totals for a sales form's values (line_items, discount_percent,
// tax_type/tax_percentage for TDS/TCS, adjustment, shipping_charge).
export const priceDocument = (values, { sellerState, placeOfSupply, gstTreatment } = {}) => {
  const lines = values.line_items || [];
  const zeroRated = ZERO_RATED.test(String(gstTreatment || ""));
  const buyerState = stateCode(placeOfSupply);
  const inter = !zeroRated && Boolean(sellerState && buyerState && sellerState !== buyerState);

  const amounts = lines.map((l) => {
    const disc = Math.min(Math.max(Number(l.discount || 0), 0), 100);
    return Math.round(Number(l.quantity || 0) * toPaise(l.rate) * (1 - disc / 100));
  });
  const subTotal = amounts.reduce((s, a) => s + a, 0);
  const pct = Number(values.discount_percent || 0);
  let discount = pct > 0 ? Math.round((subTotal * Math.min(pct, 100)) / 100) : toPaise(values.discount_amount);
  discount = Math.min(Math.max(discount, 0), subTotal);

  let left = discount;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  lines.forEach((line, i) => {
    const share = i === lines.length - 1 ? left : subTotal ? Math.round((discount * amounts[i]) / subTotal) : 0;
    left -= share;
    let rate = Number(line.gst_rate ?? 0);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100 || zeroRated) rate = 0;
    const gst = Math.round(((amounts[i] - share) * rate) / 100);
    if (inter) igst += gst;
    else {
      cgst += Math.floor(gst / 2);
      sgst += gst - Math.floor(gst / 2);
    }
  });

  const afterDiscount = subTotal - discount;
  const withholding = Math.round((afterDiscount * Number(values.tax_percentage || 0)) / 100);
  const isTcs = values.tax_type === "TCS";
  const total =
    afterDiscount + cgst + sgst + igst + (isTcs ? withholding : -withholding) + toPaise(values.adjustment) + toPaise(values.shipping_charge);

  return {
    subTotal: fromPaise(subTotal),
    discount: fromPaise(discount),
    supplyType: zeroRated ? "zero_rated" : inter ? "inter" : "intra",
    cgst: fromPaise(cgst),
    sgst: fromPaise(sgst),
    igst: fromPaise(igst),
    gst: fromPaise(cgst + sgst + igst),
    withholding: fromPaise(withholding),
    total: fromPaise(total),
  };
};
