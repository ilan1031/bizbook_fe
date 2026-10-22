// The form's GST preview must match what the server stores
// (bizbooks-backend tests/unit/gst.test.js uses the same cases).  Run: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { priceDocument, stateCode } from "../src/services/gst.js";

const values = (extra = {}) => ({
  line_items: [
    { quantity: 2, rate: 1000, gst_rate: 18 },
    { quantity: 1, rate: 500, gst_rate: 5 },
  ],
  ...extra,
});

test("state names, codes, picker labels and GSTINs", () => {
  assert.equal(stateCode("Tamil Nadu"), "33");
  assert.equal(stateCode("[KA] - Karnataka"), "29");
  assert.equal(stateCode("29ABCDE1234F1Z5"), "29");
  assert.equal(stateCode("Delhi (NCT)"), "07");
  assert.equal(stateCode("nowhere"), null);
});

test("same state splits into CGST and SGST", () => {
  const p = priceDocument(values(), { sellerState: "33", placeOfSupply: "TN" });
  assert.equal(p.supplyType, "intra");
  assert.equal(p.cgst + p.sgst, 385);
  assert.equal(p.total, 2885);
});

test("other state is IGST; overseas is zero-rated", () => {
  assert.equal(priceDocument(values(), { sellerState: "33", placeOfSupply: "Karnataka" }).igst, 385);
  assert.equal(priceDocument(values(), { sellerState: "33", placeOfSupply: "KA", gstTreatment: "Overseas" }).total, 2500);
});

test("discount before GST, TDS on the pre-GST value", () => {
  const p = priceDocument(values({ discount_percent: 10, tax_type: "TDS", tax_percentage: 10, adjustment: 1 }), {
    sellerState: "33",
    placeOfSupply: "TN",
  });
  assert.equal(p.discount, 250);
  assert.equal(p.gst, 346.5);
  assert.equal(p.withholding, 225);
  assert.equal(p.total, 2250 + 346.5 - 225 + 1);
});
