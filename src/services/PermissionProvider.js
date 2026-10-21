"use client";

// Loads the signed-in user's role and page permissions (GET /api/v1/user/me)
// and answers "may this user open this route / do this action here?".
// The backend enforces the same rules on every API call; this only decides
// what to show.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import apiService from "./axiosService";

import { buildPermissionHelpers } from "./rbacUtils";

const PermissionContext = createContext(null);

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

  const value = useMemo(
    () => ({ ...state, ...buildPermissionHelpers(state.me), reload: load }),
    [state, load]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export const usePermissions = () => useContext(PermissionContext);
