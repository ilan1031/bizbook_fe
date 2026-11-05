// Pure permission logic shared by PermissionProvider, AuthGuard, the sidebar
// and RbacButtonGuard. No React here, so it can be unit-tested directly
// (see src/services/rbacUtils.test.mjs).

import type { CatalogPage, Me, PermissionAction, PermissionHelpers } from "../types/rbac";

export const matchesRoute = (path: string, route: string): boolean => path === route || path.startsWith(route + "/");

// The action a frontend route represents: create/edit screens vs. viewing.
export const actionForRoute = (path: string): "edit" | "create" | "view" => {
  const p = String(path || "").toLowerCase();
  if (/\/(edit|update)(\/|$)|\/edit[a-z]*(\/|$)/.test(p)) return "edit";
  if (/\/(create|new|add)(\/|$)|\/(create|new)[a-z]+(\/|$)/.test(p)) return "create";
  return "view";
};

// Builds the helpers PermissionProvider exposes for a /user/me payload.
export const buildPermissionHelpers = (me: Me | null | undefined): PermissionHelpers => {
  const catalog = me?.catalog || [];
  const perms = me?.permissions || {};
  const isSuperadmin = Boolean(me?.is_superadmin);
  const hasAnyPage = Object.values(perms).some((a) => Array.isArray(a) && a.length);

  const can = (pageKey: string, action: PermissionAction = "view"): boolean =>
    isSuperadmin || (Array.isArray(perms[pageKey]) && perms[pageKey].includes(action));

  // Longest matching catalog route wins (e.g. /purchase/vendorcredits
  // vs /purchase/vendor).
  const pageForPath = (path: string): CatalogPage | null => {
    let best: CatalogPage | null = null;
    let bestLen = -1;
    for (const page of catalog) {
      for (const route of page.routes) {
        if (matchesRoute(path, route) && route.length > bestLen) {
          best = page;
          bestLen = route.length;
        }
      }
    }
    return best;
  };

  const canAccessPath = (path: string): boolean => {
    if (!me) return false;
    if ((me.planned_routes || []).some((r) => matchesRoute(path, r))) return false;
    if (isSuperadmin) return true;
    if (path.startsWith("/admin")) return false;
    // Settings > Users & Roles: the org admin's Team users switch (not a page).
    if (matchesRoute(path, "/settings/users")) return can("teamUsers", "view");
    if ((me.always_allowed_routes || []).some((r) => matchesRoute(path, r))) return true;
    if ((me.shared_routes || []).some((r) => matchesRoute(path, r))) return hasAnyPage;
    const page = pageForPath(path);
    if (!page) return false;
    return can(page.key, actionForRoute(path));
  };

  // First route the user may open - where to send them after login.
  const firstAllowedRoute = (): string | null => {
    if (isSuperadmin) return "/home";
    const page = catalog.find((p) => can(p.key, "view"));
    return page ? page.routes[0] : null;
  };

  return { isSuperadmin, hasAnyPage, can, pageForPath, canAccessPath, firstAllowedRoute };
};

// Which action a button/menu label stands for ("+ New", "Edit", "Delete"...),
// or null for anything else.
const ACTION_PATTERNS = {
  delete: /^(delete|remove|void)\b/,
  edit: /^(edit|mark as)\b/,
  // Turning a quote / order / challan into another document.
  convert: /^convert( to)?\b/,
  create: /^(\+\s*)?(new|create|add|clone|import)\b/,
};
// Labels that look like actions but aren't record changes.
const IGNORE_LABEL = /(custom view|filter|new tab|new window)/;
const MAX_LABEL = 40;

export const actionForLabel = (rawLabel: unknown): string | null => {
  const label = String(rawLabel || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!label || label.length > MAX_LABEL || IGNORE_LABEL.test(label)) return null;
  return Object.keys(ACTION_PATTERNS).find((a) => ACTION_PATTERNS[a].test(label)) || null;
};
