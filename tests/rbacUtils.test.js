// Unit tests for the frontend permission logic.  Run: npm test
import test from "node:test";
import assert from "node:assert/strict";
import {
  actionForRoute,
  actionForLabel,
  buildPermissionHelpers,
  matchesRoute,
} from "../src/services/rbacUtils.js";

// A slice of the backend catalog with the routes that are easy to confuse.
const ALL = ["view", "create", "edit", "delete"];
const catalog = [
  { key: "home", routes: ["/home"], actions: ["view"] },
  { key: "items", routes: ["/items", "/item"], actions: ALL },
  { key: "invoices", routes: ["/sales/invoices"], actions: ALL },
  { key: "vendors", routes: ["/purchase/vendor"], actions: ALL },
  { key: "vendorCredits", routes: ["/purchase/vendorcredits"], actions: ALL },
  { key: "expenses", routes: ["/purchase/expense"], actions: ALL },
  { key: "profitAndLoss", routes: ["/reports/profitandloss"], actions: ["view"] },
];
const me = (permissions, extra = {}) => ({
  catalog,
  permissions,
  is_superadmin: false,
  always_allowed_routes: ["/organisation", "/organization-list", "/no-access"],
  shared_routes: ["/common", "/import"],
  ...extra,
});

test("matchesRoute matches whole path segments only", () => {
  assert.ok(matchesRoute("/purchase/vendor", "/purchase/vendor"));
  assert.ok(matchesRoute("/purchase/vendor/edit/1", "/purchase/vendor"));
  assert.ok(!matchesRoute("/purchase/vendorcredits", "/purchase/vendor"));
});

test("actionForRoute recognises the app's create and edit screens", () => {
  for (const p of [
    "/sales/invoices/new",
    "/purchase/bills/create",
    "/purchase/expense/newexpense",
    "/purchase/expense/newexpense/recordMileage",
    "/purchase/vendor/createvendor",
    "/purchase/recurringbills/newRecurringBill",
    "/sales/paymentsReceived/newPaymentReceived",
  ]) {
    assert.equal(actionForRoute(p), "create", p);
  }
  for (const p of ["/sales/invoices/edit/abc", "/item/edit/1", "/purchase/paymentmade/edit"]) {
    assert.equal(actionForRoute(p), "edit", p);
  }
  for (const p of ["/sales/invoices", "/sales/invoices/INV-1", "/sales/creditNotes", "/home", ""]) {
    assert.equal(actionForRoute(p), "view", p);
  }
});

test("canAccessPath follows page actions", () => {
  const h = buildPermissionHelpers(me({ invoices: ["view", "create"], vendorCredits: ["view"] }));
  assert.ok(h.canAccessPath("/sales/invoices"));
  assert.ok(h.canAccessPath("/sales/invoices/new"));
  assert.ok(!h.canAccessPath("/sales/invoices/edit/1"), "no edit permission");
  assert.ok(h.canAccessPath("/purchase/vendorcredits/homepage"));
  assert.ok(!h.canAccessPath("/purchase/vendor"), "vendor credits doesn't grant vendors");
  assert.ok(!h.canAccessPath("/home"));
  assert.ok(!h.canAccessPath("/admin/users"));
  assert.ok(!h.canAccessPath("/unknown/page"));
});

test("always-allowed and shared routes", () => {
  const withPages = buildPermissionHelpers(me({ invoices: ["view"] }));
  const noPages = buildPermissionHelpers(me({}));
  assert.ok(noPages.canAccessPath("/organisation/organisationsetuppage"), "company setup");
  assert.ok(!noPages.canAccessPath("/common/newitem"), "shared needs some page");
  assert.ok(withPages.canAccessPath("/common/newitem"));
  assert.equal(noPages.hasAnyPage, false);
  assert.equal(withPages.hasAnyPage, true);
});

test("superadmin can open everything, including the admin screen", () => {
  const h = buildPermissionHelpers(me({}, { is_superadmin: true }));
  assert.ok(h.canAccessPath("/admin/users"));
  assert.ok(h.canAccessPath("/sales/invoices/edit/1"));
  assert.ok(h.can("anything", "delete"));
  assert.equal(h.firstAllowedRoute(), "/home");
});

test("modules without screens are closed to everyone, the superadmin included", () => {
  const planned = { planned_routes: ["/time/timesheets", "/time/projects"] };
  const sa = buildPermissionHelpers(me({}, { is_superadmin: true, ...planned }));
  assert.ok(!sa.canAccessPath("/time/projects"));
  assert.ok(sa.canAccessPath("/sales/invoices"));
  assert.ok(!buildPermissionHelpers(me({ invoices: ["view"] }, planned)).canAccessPath("/time/timesheets/new"));
});

test("firstAllowedRoute picks the first permitted page in catalog order", () => {
  assert.equal(buildPermissionHelpers(me({ profitAndLoss: ["view"], invoices: ["view"] })).firstAllowedRoute(), "/sales/invoices");
  assert.equal(buildPermissionHelpers(me({ home: ["view"] })).firstAllowedRoute(), "/home");
  assert.equal(buildPermissionHelpers(me({})).firstAllowedRoute(), null);
});

test("no user loaded means no access", () => {
  const h = buildPermissionHelpers(null);
  assert.equal(h.canAccessPath("/home"), false);
  assert.equal(h.can("home"), false);
});

test("actionForLabel classifies button labels", () => {
  const cases = {
    NEW: "create",
    "+ New": "create",
    "New Invoice": "create",
    "Create my account": "create",
    "Add line": "create",
    Clone: "create",
    "Convert to Invoice": "convert",
    "Convert to Sales Order": "convert",
    "Import Invoices": "create",
    Edit: "edit",
    "Mark as Sent": "edit",
    Delete: "delete",
    "Remove this IP": "delete",
    Void: "delete",
    "New Custom View": null,
    Filter: null,
    Save: null,
    Export: null,
    "": null,
  };
  for (const [label, expected] of Object.entries(cases)) {
    assert.equal(actionForLabel(label), expected, JSON.stringify(label));
  }
  assert.equal(actionForLabel("New " + "x".repeat(60)), null, "long text isn't a button label");
});
