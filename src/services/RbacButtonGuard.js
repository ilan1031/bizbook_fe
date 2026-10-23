"use client";

// Hides create / edit / delete / convert buttons and menu items on the current
// page when the user lacks that permission for the page. Buttons are
// recognised by their visible label, aria-label or title ("New", "+ New",
// "Create ...", "Edit", "Mark as ...", "Delete", "Convert to ...", ...), which
// lets every existing page follow the permissions without per-page changes.
// It also hides switched-off features everywhere: Export / Print controls
// (the "Export & Print" feature) and any element marked
// data-rbac-feature="<feature key>" (e.g. the Classic toggle).
// This is presentation only - the backend refuses the same actions. Add
// data-rbac-ignore to an element (or an ancestor) to exclude it.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePermissions } from "./PermissionProvider";
import { actionForLabel } from "./rbacUtils";

const CANDIDATES = 'button, [role="button"], [role="menuitem"], a, li.MuiMenuItem-root';
const EXPORT_LABEL = /^(export|print)\b/i;

const labelOf = (el) => (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "").trim();

const restoreAll = () => {
  document.querySelectorAll("[data-rbac-hidden]").forEach((el) => {
    el.style.display = el.dataset.rbacPrevDisplay || "";
    delete el.dataset.rbacHidden;
    delete el.dataset.rbacPrevDisplay;
  });
};

const hide = (el, why) => {
  el.dataset.rbacPrevDisplay = el.style.display || "";
  el.dataset.rbacHidden = why;
  el.style.display = "none";
};

export default function RbacButtonGuard() {
  const pathname = usePathname();
  const perms = usePermissions();

  useEffect(() => {
    restoreAll();
    if (!perms?.me || perms.isSuperadmin || pathname.startsWith("/portal")) return undefined;
    const page = perms.pageForPath(pathname);
    // Shared/helper routes have no page of their own: the backend still enforces.
    const missing = page ? ["create", "edit", "delete", "convert"].filter((a) => !perms.can(page.key, a)) : [];
    const noExport = !perms.can("exportData", "view");

    let frame = null;
    const scan = () => {
      frame = null;
      document.querySelectorAll("[data-rbac-feature]").forEach((el) => {
        if (!el.dataset.rbacHidden && !perms.can(el.dataset.rbacFeature, "view")) hide(el, "feature");
      });
      if (!missing.length && !noExport) return;
      document.querySelectorAll(CANDIDATES).forEach((el) => {
        if (el.dataset.rbacHidden || el.closest("[data-rbac-ignore]")) return;
        const label = labelOf(el);
        const action = actionForLabel(label);
        if (action && missing.includes(action)) hide(el, action);
        else if (noExport && label.length <= 40 && EXPORT_LABEL.test(label)) hide(el, "export");
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
