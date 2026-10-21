"use client";

// Loads the signed-in user's role and page permissions (GET /api/v1/user/me)
// and answers "may this user open this route / do this action here?".
// The backend enforces the same rules on every API call; this only decides
// what to show.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import apiService from "./axiosService";

const PermissionContext = createContext(null);

const matchesRoute = (path, route) => path === route || path.startsWith(route + "/");

// The action a frontend route represents (create/edit screens vs. viewing).
export const actionForRoute = (path) => {
  const p = path.toLowerCase();
  if (/\/(edit|update)(\/|$)|\/edit[a-z]*(\/|$)/.test(p)) return "edit";
  if (/\/(create|new|add)(\/|$)|\/(create|new)[a-z]+(\/|$)/.test(p)) return "create";
  return "view";
};

export function PermissionProvider({ children }) {
  const pathname = usePathname();
  const [state, setState] = useState({ me: null, loading: true, error: null, token: null });

  // `silent` refreshes in the background without the loading state, so the
  // page (and anything typed into it) isn't torn down.
  const load = useCallback(async ({ silent = false } = {}) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setState({ me: null, loading: false, error: null, token: null });
      return null;
    }
    if (!silent) setState((s) => ({ ...s, loading: true }));
    try {
      const res = await apiService({ method: "GET", url: "api/v1/user/me" });
      const me = res.data?.data || null;
      setState({ me, loading: false, error: null, token });
      return me;
    } catch (error) {
      // A failed background refresh keeps the current permissions; real
      // session-ending responses are handled by the API client (endSession).
      if (!silent) setState({ me: null, loading: false, error, token });
      return null;
    }
  }, []);

  // Pick up changes the superadmin makes while the user is signed in: when
  // the tab regains focus, and every 2 minutes. (A deactivated account or a
  // removed IP is also caught by the next API call.)
  useEffect(() => {
    const refresh = () => {
      if (localStorage.getItem("token") && document.visibilityState === "visible") load({ silent: true });
    };
    window.addEventListener("focus", refresh);
    const timer = setInterval(refresh, 2 * 60 * 1000);
    return () => {
      window.removeEventListener("focus", refresh);
      clearInterval(timer);
    };
  }, [load]);

  // Reload when the token changes (login/logout) - checked on navigation.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== state.token || (token && !state.me && !state.loading && !state.error)) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const value = useMemo(() => {
    const { me } = state;
    const catalog = me?.catalog || [];
    const perms = me?.permissions || {};
    const isSuperadmin = Boolean(me?.is_superadmin);
    const hasAnyPage = Object.values(perms).some((a) => Array.isArray(a) && a.length);

    const can = (pageKey, action = "view") =>
      isSuperadmin || (Array.isArray(perms[pageKey]) && perms[pageKey].includes(action));

    // Longest matching catalog route wins (e.g. /purchase/vendorcredits
    // vs /purchase/vendor).
    const pageForPath = (path) => {
      let best = null;
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

    const canAccessPath = (path) => {
      if (!me) return false;
      if (isSuperadmin) return true;
      if (path.startsWith("/admin")) return false;
      if ((me.always_allowed_routes || []).some((r) => matchesRoute(path, r))) return true;
      if ((me.shared_routes || []).some((r) => matchesRoute(path, r))) return hasAnyPage;
      const page = pageForPath(path);
      if (!page) return false;
      return can(page.key, actionForRoute(path));
    };

    // First route the user may open - where to send them after login.
    const firstAllowedRoute = () => {
      if (isSuperadmin) return "/home";
      const page = catalog.find((p) => can(p.key, "view"));
      return page ? page.routes[0] : null;
    };

    return { ...state, isSuperadmin, hasAnyPage, can, pageForPath, canAccessPath, firstAllowedRoute, reload: load };
  }, [state, load]);

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export const usePermissions = () => useContext(PermissionContext);
