"use client";

// Hides create / edit / delete buttons and menu items on the current page
// when the user lacks that permission for the page. Buttons are recognised by
// their visible label, aria-label or title ("New", "+ New", "Create ...",
// "Edit", "Mark as ...", "Delete", ...), which lets every existing page follow
// the permissions without per-page changes. This is presentation only - the
// backend refuses the same actions. Add data-rbac-ignore to an element (or an
// ancestor) to exclude it.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePermissions } from "./PermissionProvider";

const CANDIDATES = 'button, [role="button"], [role="menuitem"], a, li.MuiMenuItem-root';
const MAX_LABEL = 40;

const ACTION_PATTERNS = {
  delete: /^(delete|remove|void)\b/,
  edit: /^(edit|mark as)\b/,
  create: /^(\+\s*)?(new|create|add|clone|convert to|import)\b/,
};
// Labels that look like actions but aren't record changes.
const IGNORE = /(custom view|filter|new tab|new window)/;

const labelOf = (el) =>
  (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const actionOf = (el) => {
  const label = labelOf(el);
  if (!label || label.length > MAX_LABEL || IGNORE.test(label)) return null;
  return Object.keys(ACTION_PATTERNS).find((a) => ACTION_PATTERNS[a].test(label)) || null;
};

const restoreAll = () => {
  document.querySelectorAll("[data-rbac-hidden]").forEach((el) => {
    el.style.display = el.dataset.rbacPrevDisplay || "";
    delete el.dataset.rbacHidden;
    delete el.dataset.rbacPrevDisplay;
  });
};

export default function RbacButtonGuard() {
  const pathname = usePathname();
  const perms = usePermissions();

  useEffect(() => {
    restoreAll();
    if (!perms?.me || perms.isSuperadmin) return undefined;
    const page = perms.pageForPath(pathname);
    if (!page) return undefined; // shared/helper routes: backend still enforces
    const missing = ["create", "edit", "delete"].filter((a) => !perms.can(page.key, a));
    if (!missing.length) return undefined;

    let frame = null;
    const scan = () => {
      frame = null;
      document.querySelectorAll(CANDIDATES).forEach((el) => {
        if (el.dataset.rbacHidden || el.closest("[data-rbac-ignore]")) return;
        const action = actionOf(el);
        if (action && missing.includes(action)) {
          el.dataset.rbacPrevDisplay = el.style.display || "";
          el.dataset.rbacHidden = action;
          el.style.display = "none";
        }
      });
    };
    scan();
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      restoreAll();
    };
  }, [pathname, perms?.me]);

  return null;
}
